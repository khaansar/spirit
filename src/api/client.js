import axios from 'axios';
import { CONFIG } from '../config/env';
import { storage } from '../utils/storage';

export const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:3000',
  },
});

export const apiClientRaw = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:3000',
  },
});

export const normalizeErrorObject = (error) => {
  const status = error?.response?.status || 500;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected network error occurred';
  const errors = error?.response?.data?.errors || [];

  return {
    message,
    status,
    errors,
  };
};

const extractCookieValue = (cookies, key) => {
  if (!cookies) return null;
  const cookieList = Array.isArray(cookies) ? cookies : [cookies];
  for (const c of cookieList) {
    if (typeof c === 'string') {
      const match = c.match(new RegExp(`(?:^|[;,]\\s*)${key}=([^;]+)`));
      if (match) return match[1].trim();
    }
  }
  return null;
};

// Request Interceptor: Attach Bearer Token & Cookie from SecureStore
const attachAuthHeaders = async (config) => {
  try {
    config.withCredentials = true;
    const token = await storage.getAccessToken();
    if (config.headers) {
      config.headers['Origin'] = 'http://localhost:3000';
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.Cookie = `ACCESS_TOKEN=${token}`;
      }
    }
  } catch (e) {
    console.warn('Failed to attach auth token:', e);
  }
  return config;
};

apiClient.interceptors.request.use(attachAuthHeaders, (error) => Promise.reject(normalizeErrorObject(error)));
apiClientRaw.interceptors.request.use(attachAuthHeaders, (error) => Promise.reject(normalizeErrorObject(error)));

// Response Interceptor: Extract set-cookie and unwrap data
const processResponseCookies = async (response) => {
  try {
    const rawHeaders = response?.headers;
    let setCookie = null;
    if (rawHeaders && typeof rawHeaders.getSetCookie === 'function') {
      setCookie = rawHeaders.getSetCookie();
    }
    if (!setCookie && rawHeaders && typeof rawHeaders.get === 'function') {
      setCookie = rawHeaders.get('set-cookie') || rawHeaders.get('Set-Cookie');
    }
    if (!setCookie && rawHeaders) {
      setCookie = rawHeaders['set-cookie'] || rawHeaders['Set-Cookie'];
    }

    if (setCookie) {
      const accessToken = extractCookieValue(setCookie, 'ACCESS_TOKEN');
      const refreshToken = extractCookieValue(setCookie, 'REFRESH_TOKEN');
      if (accessToken) {
        await storage.setAccessToken(accessToken);
      }
      if (refreshToken) {
        await storage.setRefreshToken(refreshToken);
      }
    }

    // Also inspect body if server returns token in payload
    const bodyData = response?.data?.data || response?.data;
    if (bodyData?.accessToken) {
      await storage.setAccessToken(bodyData.accessToken);
    }
    if (bodyData?.refreshToken) {
      await storage.setRefreshToken(bodyData.refreshToken);
    }
  } catch (e) {
    console.warn('Failed to persist cookies from response:', e);
  }
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const refreshAuthSession = async () => {
  const refreshToken = await storage.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const refreshRes = await fetch(`${CONFIG.API_BASE_URL}/auth-api/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000',
      'Cookie': `REFRESH_TOKEN=${refreshToken}`,
    },
  });

  let newAccessToken = null;
  let newRefreshToken = null;

  let sc = null;
  if (typeof refreshRes.headers.getSetCookie === 'function') {
    sc = refreshRes.headers.getSetCookie().join('; ');
  } else if (refreshRes.headers.raw && typeof refreshRes.headers.raw === 'function') {
    const raw = refreshRes.headers.raw();
    sc = Array.isArray(raw['set-cookie']) ? raw['set-cookie'].join('; ') : raw['set-cookie'];
  } else if (refreshRes.headers.get) {
    sc = refreshRes.headers.get('set-cookie') || refreshRes.headers.get('Set-Cookie');
  }
  if (!sc && refreshRes.headers?.map) {
    sc = refreshRes.headers.map['set-cookie'] || refreshRes.headers.map['Set-Cookie'];
  }

  if (sc) {
    newAccessToken = extractCookieValue(sc, 'ACCESS_TOKEN');
    newRefreshToken = extractCookieValue(sc, 'REFRESH_TOKEN');
  }

  // Also inspect body if server returns token in payload
  const body = await refreshRes.json().catch(() => ({}));
  const bodyData = body?.data?.data || body?.data;
  if (bodyData?.accessToken) {
    newAccessToken = bodyData.accessToken;
  }
  if (bodyData?.refreshToken) {
    newRefreshToken = bodyData.refreshToken;
  }

  if (newAccessToken) {
    await storage.setAccessToken(newAccessToken);
    if (newRefreshToken) {
      await storage.setRefreshToken(newRefreshToken);
    }
    return newAccessToken;
  }

  if (!refreshRes.ok) {
    throw new Error(body?.message || 'Failed to refresh session');
  }

  return await storage.getAccessToken();
};

const handleTokenRefresh = async (error, clientInstance) => {
  const originalRequest = error.config;
  const status = error?.response?.status || error?.status;

  if (
    status !== 401 ||
    !originalRequest ||
    originalRequest._retry ||
    originalRequest.url?.includes('/auth-api/login') ||
    originalRequest.url?.includes('/auth-api/refresh')
  ) {
    return Promise.reject(normalizeErrorObject(error));
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          originalRequest.headers.Cookie = `ACCESS_TOKEN=${token}`;
        }
        return clientInstance(originalRequest);
      })
      .catch((err) => Promise.reject(err));
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const newAccessToken = await refreshAuthSession();

    if (newAccessToken) {
      processQueue(null, newAccessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Cookie = `ACCESS_TOKEN=${newAccessToken}`;
      }
      return clientInstance(originalRequest);
    } else {
      throw new Error('Refresh response did not provide a valid access token');
    }
  } catch (refreshErr) {
    processQueue(refreshErr, null);
    return Promise.reject(normalizeErrorObject(error));
  } finally {
    isRefreshing = false;
  }
};

apiClient.interceptors.response.use(
  async (response) => {
    await processResponseCookies(response);
    if (response.config?.preserveResponseEnvelope) {
      return response.data;
    }
    if (response?.data?.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  async (error) => handleTokenRefresh(error, apiClient)
);

apiClientRaw.interceptors.response.use(
  async (response) => {
    await processResponseCookies(response);
    return response.data;
  },
  async (error) => handleTokenRefresh(error, apiClientRaw)
);

export default apiClient;
