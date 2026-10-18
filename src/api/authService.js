import apiClient, { apiClientRaw } from './client';
import { storage } from '../utils/storage';

export const authService = {
  async login(credentials) {
    const rawRes = await apiClientRaw.post('/auth-api/login', credentials);
    const data = rawRes?.data?.data || rawRes?.data || {};
    if (data?.accessToken) {
      await storage.setAccessToken(data.accessToken);
    }
    const user = data?.user || data;
    if (user && typeof user === 'object') {
      await storage.setItem('clearit_user', JSON.stringify(user));
    }
    return user;
  },

  async register(userData) {
    let { firstName, lastName, name, email, password, phone, targetExam } = userData;
    if (!firstName && name) {
      const names = name.trim().split(/\s+/);
      firstName = names[0];
      lastName = names.slice(1).join(' ') || 'Student';
    }
    const response = await apiClient.post('/auth-api/register', {
      firstName: firstName || 'Student',
      lastName: lastName || 'Learner',
      email,
      password,
      phone: phone || null,
      targetExam: targetExam || null,
    });
    return response;
  },

  async getCurrentUser() {
    try {
      return await apiClient.get('/auth-api/users/me');
    } catch {
      return await apiClient.get('/auth-api/me');
    }
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
