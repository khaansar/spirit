import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import catalogReducer from './slices/catalogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
