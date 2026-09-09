import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'ecommerce_admin_products';

const loadProductsFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
  }
  return []; // Default empty state: no fake data
};

const saveProductsToStorage = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};

const initialState = {
  items: loadProductsFromStorage()
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.items.unshift(action.payload);
      saveProductsToStorage(state.items);
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        saveProductsToStorage(state.items);
      }
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      saveProductsToStorage(state.items);
    },
    clearAllProducts: (state) => {
      state.items = [];
      saveProductsToStorage([]);
    }
  }
});

export const { addProduct, updateProduct, deleteProduct, clearAllProducts } = productSlice.actions;
export default productSlice.reducer;
