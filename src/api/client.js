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
  async (error) => Promise.reject(normalizeErrorObject(error))
);

apiClientRaw.interceptors.response.use(
  async (response) => {
    await processResponseCookies(response);
    return response.data;
  },
  async (error) => Promise.reject(normalizeErrorObject(error))
);

export default apiClient;
