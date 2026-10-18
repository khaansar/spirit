import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'clearit_access_token';
const REFRESH_TOKEN_KEY = 'clearit_refresh_token';
const USER_KEY = 'clearit_user';

const memoryCache = {};

export const storage = {
  async setItem(key, value) {
    memoryCache[key] = value;
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (_) {}
    } catch (e) {
      console.warn(`Error setting storage item ${key}:`, e);
    }
  },

  async getItem(key) {
    if (memoryCache[key] !== undefined && memoryCache[key] !== null) {
      return memoryCache[key];
    }
    try {
      if (Platform.OS === 'web') {
        const val = localStorage.getItem(key);
        if (val != null) memoryCache[key] = val;
        return val;
      }

      // Check SecureStore first
      try {
        const sVal = await SecureStore.getItemAsync(key);
        if (sVal != null) {
          memoryCache[key] = sVal;
          return sVal;
        }
      } catch (_) {}

      // Fallback to AsyncStorage
      const aVal = await AsyncStorage.getItem(key);
      if (aVal != null) {
        memoryCache[key] = aVal;
        return aVal;
      }

      return null;
    } catch (e) {
      console.warn(`Error reading storage item ${key}:`, e);
      return memoryCache[key] || null;
    }
  },

  async removeItem(key) {
    delete memoryCache[key];
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
      }
      await AsyncStorage.removeItem(key);
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (_) {}
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
    delete memoryCache[ACCESS_TOKEN_KEY];
    delete memoryCache[REFRESH_TOKEN_KEY];
    delete memoryCache[USER_KEY];
    await this.removeItem(ACCESS_TOKEN_KEY);
    await this.removeItem(REFRESH_TOKEN_KEY);
    await this.removeItem(USER_KEY);
  },
};

export default storage;
