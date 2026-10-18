import axios from 'axios';
import { CONFIG } from '../config/env';
import { storage } from '../utils/storage';

export const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 4000, // Fast 4-second timeout to prevent stalling on offline backends
  headers: {
    'Content-Type': 'application/json',
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

// Request Interceptor: Attach Bearer Token from SecureStore
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to attach auth token:', e);
    }
    return config;
  },
  (error) => Promise.reject(normalizeErrorObject(error))
);

// Response Interceptor: Unwrap data & normalize errors
apiClient.interceptors.response.use(
  (response) => {
    // If backend returns { success: true, data: { ... } }, unwrap it
    if (response?.data?.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  async (error) => {
    return Promise.reject(normalizeErrorObject(error));
  }
);

export default apiClient;
