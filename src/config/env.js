import { Platform } from 'react-native';

const DEFAULT_DEV_URL = Platform.select({
  android: 'http://10.0.2.2:8080',
  ios: 'http://localhost:8080',
  default: 'http://localhost:8080',
});

export const CONFIG = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_DEV_URL,
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'ClearIt',
  APP_TAGLINE: process.env.EXPO_PUBLIC_APP_TAGLINE || 'Practice. Perform. Clear It.',
};

export default CONFIG;
