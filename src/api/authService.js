import apiClient from './client';
import { storage } from '../utils/storage';

export const authService = {
  async login(credentials) {
    const response = await apiClient.post('/auth-api/login', credentials);
    if (response?.data?.data?.accessToken) {
      await storage.setAccessToken(response.data.data.accessToken);
    }
    return response.data;
  },

  async register(userData) {
    const response = await apiClient.post('/auth-api/register', userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth-api/me');
    return response.data;
  },

  async logout() {
    try {
      await apiClient.post('/auth-api/logout');
    } finally {
      await storage.clearTokens();
    }
  },
};

export default authService;
