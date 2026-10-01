import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../services/authApi';

// Initial state helpers from localStorage
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('atelier_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getStoredToken = () => {
  try {
    return localStorage.getItem('atelier_token') || null;
  } catch {
    return null;
  }
};

const getStoredRefreshToken = () => {
  try {
    return localStorage.getItem('atelier_refresh_token') || null;
  } catch {
    return null;
  }
};

/**
 * Async Thunks
 */

// Login User Thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed. Please verify credentials.');
    }
  }
);

// Register Customer Thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed.');
    }
  }
);

// Register Vendor Thunk
export const registerVendorUser = createAsyncThunk(
  'auth/registerVendorUser',
  async (vendorData, { rejectWithValue }) => {
    try {
      const response = await authApi.registerVendor(vendorData);
      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Vendor registration failed.');
    }
  }
);

// Register Admin Thunk
export const registerAdminUser = createAsyncThunk(
  'auth/registerAdminUser',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await authApi.registerAdmin(adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Admin registration failed.');
    }
  }
);


// Fetch Current Authenticated User (Profile Validation)
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getMe();
      return response?.data || response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Session expired.',
        status: error.response?.status || 0
      });
    }
  }
);

// Logout User Thunk
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    try {
      await authApi.logout();
      return null;
    } catch {
      return null;
    }
  }
);

const initialState = {
  user: getStoredUser(),
  token: getStoredToken(),
  refreshToken: getStoredRefreshToken(),
  isAuthenticated: Boolean(getStoredToken()),
  loading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      try {
        localStorage.setItem('atelier_user', JSON.stringify(state.user));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      try {
        localStorage.removeItem('atelier_token');
        localStorage.removeItem('atelier_refresh_token');
        localStorage.removeItem('atelier_user');
      } catch (err) {
        console.warn('LocalStorage clear failed:', err);
      }
    }
  },
  extraReducers: (builder) => {
    // loginUser
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        const payload = action.payload?.data || action.payload;
        const user = payload?.user || action.payload?.user;
        const token = payload?.accessToken || payload?.token || action.payload?.accessToken;
        const refreshToken = payload?.refreshToken || action.payload?.refreshToken;

        state.user = user;
        state.token = token;
        state.refreshToken = refreshToken;
        state.error = null;

        try {
          if (token) localStorage.setItem('atelier_token', token);
          if (user) localStorage.setItem('atelier_user', JSON.stringify(user));
          if (refreshToken) {
            localStorage.setItem('atelier_refresh_token', refreshToken);
          }
        } catch (err) {
          console.warn('LocalStorage save failed:', err);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // registerUser
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.accessToken) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;

          try {
            localStorage.setItem('atelier_token', action.payload.accessToken);
            localStorage.setItem('atelier_user', JSON.stringify(action.payload.user));
          } catch (err) {
            console.warn('LocalStorage save failed:', err);
          }
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // registerVendorUser
    builder
      .addCase(registerVendorUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerVendorUser.fulfilled, (state, action) => {
        state.loading = false;
        const token = action.payload?.accessToken || action.payload?.token;
        const user = action.payload?.user;
        if (token && user) {
          state.isAuthenticated = true;
          state.user = user;
          state.token = token;
          state.refreshToken = action.payload.refreshToken || null;

          try {
            localStorage.setItem('atelier_token', token);
            localStorage.setItem('atelier_user', JSON.stringify(user));
            if (action.payload.refreshToken) {
              localStorage.setItem('atelier_refresh_token', action.payload.refreshToken);
            }
          } catch (err) {
            console.warn('LocalStorage save failed:', err);
          }
        }
      })
      .addCase(registerVendorUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // registerAdminUser
    builder
      .addCase(registerAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.accessToken) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;

          try {
            localStorage.setItem('atelier_token', action.payload.accessToken);
            localStorage.setItem('atelier_user', JSON.stringify(action.payload.user));
            if (action.payload.refreshToken) {
              localStorage.setItem('atelier_refresh_token', action.payload.refreshToken);
            }
          } catch (err) {
            console.warn('LocalStorage save failed:', err);
          }
        }
      })
      .addCase(registerAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // fetchCurrentUser
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        const payload = action.payload?.data || action.payload;
        const user = payload?.user || action.payload?.user;
        if (user) {
          state.user = user;
          state.isAuthenticated = true;
          try {
            localStorage.setItem('atelier_user', JSON.stringify(user));
          } catch (err) {
            console.warn('LocalStorage save failed:', err);
          }
        }
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        // Only wipe credentials if the server explicitly returned 401 Unauthorized (token invalid/expired)
        // Keep persisted state intact during transient network disconnections
        if (action.payload?.status === 401) {
          state.user = null;
          state.token = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          try {
            localStorage.removeItem('atelier_token');
            localStorage.removeItem('atelier_refresh_token');
            localStorage.removeItem('atelier_user');
          } catch (err) {
            console.warn('LocalStorage clear failed:', err);
          }
        }
      });

    // logoutUser
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        try {
          localStorage.removeItem('atelier_token');
          localStorage.removeItem('atelier_refresh_token');
          localStorage.removeItem('atelier_user');
        } catch (err) {
          console.warn('LocalStorage clear failed:', err);
        }
      });
  }
});

export const { clearError, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
