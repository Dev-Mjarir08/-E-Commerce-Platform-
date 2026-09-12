import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'ecommerce_admin_stores';

const loadStoresFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading stores from localStorage:', error);
  }
  return []; // Default clean state: no dummy data
};

const saveStoresToStorage = (stores) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
  } catch (error) {
    console.error('Error saving stores to localStorage:', error);
  }
};

const initialState = {
  items: loadStoresFromStorage()
};

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    addStore: (state, action) => {
      state.items.unshift(action.payload);
      saveStoresToStorage(state.items);
    },
    updateStore: (state, action) => {
      const index = state.items.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        saveStoresToStorage(state.items);
      }
    },
    deleteStore: (state, action) => {
      state.items = state.items.filter((s) => s.id !== action.payload);
      saveStoresToStorage(state.items);
    },
    toggleStoreStatus: (state, action) => {
      const store = state.items.find((s) => s.id === action.payload);
      if (store) {
        store.status = store.status === 'active' ? 'suspended' : 'active';
        saveStoresToStorage(state.items);
      }
    },
    toggleStoreVerification: (state, action) => {
      const store = state.items.find((s) => s.id === action.payload);
      if (store) {
        store.isVerified = !store.isVerified;
        saveStoresToStorage(state.items);
      }
    },
    clearAllStores: (state) => {
      state.items = [];
      saveStoresToStorage([]);
    }
  }
});

export const {
  addStore,
  updateStore,
  deleteStore,
  toggleStoreStatus,
  toggleStoreVerification,
  clearAllStores
} = storeSlice.actions;

export default storeSlice.reducer;
