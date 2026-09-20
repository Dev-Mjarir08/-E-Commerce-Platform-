import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vendorApi from '../../services/vendorApi';

/**
 * Async Thunks for Vendor Management
 */

// Fetch Vendor Profile, Store Details & Dashboard Metrics
export const fetchVendorDashboard = createAsyncThunk(
  'vendor/fetchVendorDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorApi.getProfile();
      // response is already extracted data via axios interceptor
      return response?.data || response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch vendor dashboard data';
      return rejectWithValue(message);
    }
  }
);

// Update Vendor Profile & Store Details
export const updateVendorProfile = createAsyncThunk(
  'vendor/updateVendorProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await vendorApi.updateProfile(profileData);
      return response?.data || response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update vendor profile';
      return rejectWithValue(message);
    }
  }
);

// Change Vendor Password
export const changeVendorPassword = createAsyncThunk(
  'vendor/changeVendorPassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await vendorApi.changePassword(passwordData);
      return response?.message || 'Password changed successfully';
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to change password';
      return rejectWithValue(message);
    }
  }
);

// Upload Vendor Avatar
export const uploadVendorAvatar = createAsyncThunk(
  'vendor/uploadVendorAvatar',
  async (avatarData, { rejectWithValue }) => {
    try {
      const response = await vendorApi.uploadAvatar(avatarData);
      return response?.data || response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to upload avatar';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: null,
  store: null,
  metrics: {
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    activeProducts: 0,
    totalProducts: 0
  },
  recentOrders: [],
  topProducts: [],
  loading: false,
  error: null,
  updateLoading: false,
  updateSuccess: false
};

export const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    clearVendorError: (state) => {
      state.error = null;
    },
    resetUpdateStatus: (state) => {
      state.updateLoading = false;
      state.updateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    // fetchVendorDashboard
    builder
      .addCase(fetchVendorDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          state.user = action.payload.user || state.user;
          state.store = action.payload.store || state.store;
          state.metrics = action.payload.metrics || state.metrics;
          state.recentOrders = action.payload.recentOrders || [];
          state.topProducts = action.payload.topProducts || [];
        }
      })
      .addCase(fetchVendorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateVendorProfile
    builder
      .addCase(updateVendorProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
      })
      .addCase(updateVendorProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        if (action.payload) {
          if (action.payload.user) state.user = { ...state.user, ...action.payload.user };
          if (action.payload.store) state.store = { ...state.store, ...action.payload.store };
        }
      })
      .addCase(updateVendorProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    // uploadVendorAvatar
    builder
      .addCase(uploadVendorAvatar.fulfilled, (state, action) => {
        if (action.payload?.avatar && state.user) {
          state.user.avatar = action.payload.avatar;
        }
      });
  }
});

export const { clearVendorError, resetUpdateStatus } = vendorSlice.actions;
export default vendorSlice.reducer;
