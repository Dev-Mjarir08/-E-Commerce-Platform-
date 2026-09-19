import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customerApi from '../../services/customerApi';

// Async Thunks for Admin Customer Management
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await customerApi.getAllCustomers(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch customer list';
      return rejectWithValue(message);
    }
  }
);

export const fetchCustomerDetails = createAsyncThunk(
  'customers/fetchCustomerDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerApi.getCustomerById(id);
      return response?.data || response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch customer details';
      return rejectWithValue(message);
    }
  }
);

export const updateCustomerStatus = createAsyncThunk(
  'customers/updateCustomerStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await customerApi.updateCustomerStatus(id, status);
      return { id, status, data: response?.data || response };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update customer status';
      return rejectWithValue(message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await customerApi.deleteCustomer(id);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to delete customer';
      return rejectWithValue(message);
    }
  }
);

// Async Thunks for Logged-In Customer Self-Service Profile
export const fetchCustomerProfile = createAsyncThunk(
  'customers/fetchCustomerProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerApi.getProfile();
      return response?.data || response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch profile';
      return rejectWithValue(message);
    }
  }
);

export const updateCustomerProfile = createAsyncThunk(
  'customers/updateCustomerProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await customerApi.updateProfile(profileData);
      return response?.data || response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update profile';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  customers: [],
  selectedCustomer: null,
  summary: {
    totalCustomers: 0,
    totalOrders: 0,
    totalSpend: '₹0'
  },
  pagination: {
    total: 0,
    page: 1,
    totalPages: 1
  },
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null,
  actionLoading: false
};

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
      state.detailError = null;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchCustomers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        // Robust handling: payload could be { data: [...], summary, ... } or directly [...]
        if (Array.isArray(payload)) {
          state.customers = payload;
          state.summary.totalCustomers = payload.length;
        } else if (payload && Array.isArray(payload.data)) {
          state.customers = payload.data;
          state.summary = payload.summary || {
            totalCustomers: payload.total || payload.data.length,
            totalOrders: 0,
            totalSpend: '₹0'
          };
          state.pagination = {
            total: payload.total || payload.data.length,
            page: payload.page || 1,
            totalPages: payload.totalPages || 1
          };
        } else {
          state.customers = [];
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchCustomerDetails
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        const payload = action.payload;
        state.selectedCustomer = payload?.data || payload;
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })

      // updateCustomerStatus
      .addCase(updateCustomerStatus.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateCustomerStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { id, status } = action.payload;
        // Update in list
        const customer = state.customers.find((c) => c.id === id || c._id === id);
        if (customer) {
          customer.status = status;
        }
        // Update in selected customer
        if (state.selectedCustomer && (state.selectedCustomer.id === id || state.selectedCustomer._id === id)) {
          state.selectedCustomer.status = status;
        }
      })
      .addCase(updateCustomerStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // deleteCustomer
      .addCase(deleteCustomer.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.actionLoading = false;
        const deletedId = action.payload;
        state.customers = state.customers.filter((c) => c.id !== deletedId && c._id !== deletedId);
        if (state.selectedCustomer && (state.selectedCustomer.id === deletedId || state.selectedCustomer._id === deletedId)) {
          state.selectedCustomer = null;
        }
        if (state.summary.totalCustomers > 0) {
          state.summary.totalCustomers -= 1;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCustomerError, clearSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;
