import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'clearit_access_token';
const REFRESH_TOKEN_KEY = 'clearit_refresh_token';
const USER_KEY = 'clearit_user';

// Timeout helper: prevents async storage from hanging indefinitely
const withTimeout = (promise, ms = 600) => {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
};

export const storage = {
  async setItem(key, value) {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return;
      }
      await withTimeout(SecureStore.setItemAsync(key, value), 800);
    } catch (e) {
      console.warn(`Error setting storage item ${key}:`, e);
    }
  },

  async getItem(key) {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await withTimeout(SecureStore.getItemAsync(key), 600);
    } catch (e) {
      console.warn(`Error reading storage item ${key}:`, e);
      return null;
    }
  },

  async removeItem(key) {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
      }
      await withTimeout(SecureStore.deleteItemAsync(key), 600);
    } catch (e) {
      console.warn(`Error removing storage item ${key}:`, e);
    }
  },

  // Token helpers
  async getAccessToken() {
    return this.getItem(ACCESS_TOKEN_KEY);
  },

  async setAccessToken(token) {
    return this.setItem(ACCESS_TOKEN_KEY, token);
  },

  async getRefreshToken() {
    return this.getItem(REFRESH_TOKEN_KEY);
  },

  async setRefreshToken(token) {
    return this.setItem(REFRESH_TOKEN_KEY, token);
  },

  async clearTokens() {
    await this.removeItem(ACCESS_TOKEN_KEY);
    await this.removeItem(REFRESH_TOKEN_KEY);
    await this.removeItem(USER_KEY);
  },
};

export default storage;
