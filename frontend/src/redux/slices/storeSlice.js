import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storeApi from '../../services/storeApi';

/**
 * Mapper helper to strictly conform to existing UI store item shape
 */
export const mapBackendStoreToItem = (store) => {
  if (!store) return null;
  return {
    id: store._id,
    name: store.name || '',
    slug: store.slug || '',
    ownerEmail: store.owner?.email || store.email || '',
    phone: store.phone || '',
    city: store.address?.city || '',
    description: store.description || '',
    status: store.status || 'pending',
    isVerified: Boolean(store.isVerified),
    logo: store.logo?.url || (typeof store.logo === 'string' ? store.logo : ''),
    rating: store.ratingAverage ?? 0
  };
};

/**
 * Async Thunk: Fetch all stores for Admin
 */
export const fetchStores = createAsyncThunk(
  'stores/fetchStores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storeApi.getAllStores();
      const rawStores = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      return rawStores.map(mapBackendStoreToItem).filter(Boolean);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch stores';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunk: Create new store
 */
export const addStore = createAsyncThunk(
  'stores/addStore',
  async (storeData, { rejectWithValue }) => {
    try {
      const response = await storeApi.createStore(storeData);
      const createdStore = response?.data || response;
      return mapBackendStoreToItem(createdStore);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to create store';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunk: Update store details by ID
 */
export const updateStore = createAsyncThunk(
  'stores/updateStore',
  async ({ id, ...storeData }, { rejectWithValue }) => {
    try {
      const response = await storeApi.updateStore(id, storeData);
      const updatedStore = response?.data || response;
      return mapBackendStoreToItem(updatedStore);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update store';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunk: Delete store by ID
 */
export const deleteStore = createAsyncThunk(
  'stores/deleteStore',
  async (id, { rejectWithValue }) => {
    try {
      await storeApi.deleteStore(id);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to delete store';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunk: Toggle store operational status
 */
export const toggleStoreStatus = createAsyncThunk(
  'stores/toggleStoreStatus',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const store = state.stores.items.find((s) => s.id === id);
      const nextStatus = store?.status === 'active' ? 'suspended' : 'active';
      const response = await storeApi.updateStoreStatus(id, nextStatus);
      const updatedStore = response?.data || response;
      return mapBackendStoreToItem(updatedStore) || { id, status: nextStatus };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update store status';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunk: Toggle store verification badge
 */
export const toggleStoreVerification = createAsyncThunk(
  'stores/toggleStoreVerification',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const store = state.stores.items.find((s) => s.id === id);
      const nextVerified = !store?.isVerified;
      const response = await storeApi.updateStoreVerification(id, nextVerified);
      const updatedStore = response?.data || response;
      return mapBackendStoreToItem(updatedStore) || { id, isVerified: nextVerified };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update verification';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null
};

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    clearStoreError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchStores
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addStore
      .addCase(addStore.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.items.unshift(action.payload);
      })

      // updateStore
      .addCase(updateStore.fulfilled, (state, action) => {
        if (!action.payload) return;
        const index = state.items.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })

      // deleteStore
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
      })

      // toggleStoreStatus
      .addCase(toggleStoreStatus.fulfilled, (state, action) => {
        if (!action.payload) return;
        const index = state.items.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })

      // toggleStoreVerification
      .addCase(toggleStoreVerification.fulfilled, (state, action) => {
        if (!action.payload) return;
        const index = state.items.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      });
  }
});

export const { clearStoreError } = storeSlice.actions;

export default storeSlice.reducer;

