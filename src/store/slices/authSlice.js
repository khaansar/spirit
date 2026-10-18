import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import { storage } from '../../utils/storage';

const getErrorMessage = (error, fallback) => {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (typeof error.message === 'string') return error.message;
  if (Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors
      .map((item) => (typeof item === 'string' ? item : item?.message || JSON.stringify(item)))
      .join(', ');
  }
  return fallback;
};

import authService from '../../api/authService';

// Async Thunk: Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await authService.login(credentials);
      return user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Login failed. Please check your credentials.'));
    }
  }
);

// Async Thunk: Register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      let { firstName, lastName, name, email, password, phone, targetExam } = userData;
      if (!firstName && name) {
        const names = name.trim().split(/\s+/);
        firstName = names[0];
        lastName = names.slice(1).join(' ') || 'Student';
      }

      const payload = {
        firstName: firstName || 'Student',
        lastName: lastName || 'Learner',
        email,
        password,
        phone: phone || null,
        targetExam: targetExam || null,
      };

      const data = await apiClient.post('/auth-api/register', payload);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Registration failed.'));
    }
  }
);

// Async Thunk: Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const data = await apiClient.post('/auth-api/forgot-password', { email });
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to send password reset link.'));
    }
  }
);

// Async Thunk: Restore Session on App Startup
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = await storage.getAccessToken();
      if (!token) {
        return null;
      }

      // Try fetching current user profile from Baahubali
      try {
        const userData = await apiClient.get('/auth-api/users/me');
        const user = userData?.user || userData;
        if (user) {
          await storage.setItem('clearit_user', JSON.stringify(user));
          return user;
        }
      } catch (apiErr) {
        // Fallback to /auth-api/me if /users/me fails
        try {
          const userData = await apiClient.get('/auth-api/me');
          const user = userData?.user || userData;
          if (user) {
            await storage.setItem('clearit_user', JSON.stringify(user));
            return user;
          }
        } catch (e) {
          // Fallback to locally cached user if network is temporarily offline
          const cachedUserStr = await storage.getItem('clearit_user');
          if (cachedUserStr) {
            return JSON.parse(cachedUserStr);
          }
          await storage.clearTokens();
          return null;
        }
      }
    } catch (err) {
      await storage.clearTokens();
      return rejectWithValue(null);
    }
  }
);

// Async Thunk: Fetch Current User Profile
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await apiClient.get('/auth-api/users/me');
      const user = userData?.user || userData;
      if (user) {
        await storage.setItem('clearit_user', JSON.stringify(user));
      }
      return user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to fetch user profile.'));
    }
  }
);

// Async Thunk: Logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    try {
      await apiClient.post('/auth-api/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      await storage.clearTokens();
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isRestoringSession: true,
  loginStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  registerStatus: 'idle',
  forgotStatus: 'idle',
  error: null,
  registerSuccessMessage: null,
  forgotSuccessMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    resetAuthStatus(state) {
      state.loginStatus = 'idle';
      state.registerStatus = 'idle';
      state.forgotStatus = 'idle';
      state.error = null;
      state.registerSuccessMessage = null;
      state.forgotSuccessMessage = null;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isRestoringSession = false;
    },
    updateUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH CURRENT USER
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = 'succeeded';
        state.user = action.payload?.user || action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = 'failed';
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerStatus = 'succeeded';
        state.registerSuccessMessage =
          action.payload?.message || 'Account created successfully! Please verify your email.';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = 'failed';
        state.error = action.payload;
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.forgotStatus = 'loading';
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotStatus = 'succeeded';
        state.forgotSuccessMessage =
          action.payload?.message || 'Password reset link sent to your email!';
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotStatus = 'failed';
        state.error = action.payload;
      })

      // RESTORE SESSION
      .addCase(restoreSession.pending, (state) => {
        state.isRestoringSession = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isRestoringSession = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isRestoringSession = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loginStatus = 'idle';
        state.registerStatus = 'idle';
        state.error = null;
      });
  },
});

export const { clearAuthError, resetAuthStatus, setUser, updateUser } = authSlice.actions;
export default authSlice.reducer;
