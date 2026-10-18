import apiClient, { apiClientRaw } from './client';
import { storage } from '../utils/storage';
import { CONFIG } from '../config/env';

export const authService = {
  async login(credentials) {
    const response = await fetch(`${CONFIG.API_BASE_URL}/auth-api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
      },
      body: JSON.stringify(credentials),
    });

    let sc = null;
    if (typeof response.headers.getSetCookie === 'function') {
      sc = response.headers.getSetCookie().join('; ');
    } else if (response.headers.get) {
      sc = response.headers.get('set-cookie');
    }

    if (sc) {
      const accessMatch = sc.match(/(?:^|[;,]\s*)ACCESS_TOKEN=([^;]+)/);
      if (accessMatch && accessMatch[1]) {
        await storage.setAccessToken(accessMatch[1].trim());
      }
      const refreshMatch = sc.match(/(?:^|[;,]\s*)REFRESH_TOKEN=([^;]+)/);
      if (refreshMatch && refreshMatch[1]) {
        await storage.setRefreshToken(refreshMatch[1].trim());
      }
    }

    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.success === false) {
      throw new Error(body.message || 'Login failed. Please check your credentials.');
    }

    const data = body?.data?.data || body?.data || {};
    if (data?.accessToken) {
      await storage.setAccessToken(data.accessToken);
    }
    if (data?.refreshToken) {
      await storage.setRefreshToken(data.refreshToken);
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
