import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'ecommerce_admin_coupons';

const loadCouponsFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading coupons from localStorage:', error);
  }
  return []; // Default clean state: no dummy data
};

const saveCouponsToStorage = (coupons) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
  } catch (error) {
    console.error('Error saving coupons to localStorage:', error);
  }
};

const initialState = {
  items: loadCouponsFromStorage()
};

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    addCoupon: (state, action) => {
      state.items.unshift(action.payload);
      saveCouponsToStorage(state.items);
    },
    updateCoupon: (state, action) => {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        saveCouponsToStorage(state.items);
      }
    },
    deleteCoupon: (state, action) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
      saveCouponsToStorage(state.items);
    },
    toggleCouponStatus: (state, action) => {
      const coupon = state.items.find((c) => c.id === action.payload);
      if (coupon) {
        coupon.isActive = !coupon.isActive;
        saveCouponsToStorage(state.items);
      }
    },
    clearAllCoupons: (state) => {
      state.items = [];
      saveCouponsToStorage([]);
    }
  }
});

export const {
  addCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  clearAllCoupons
} = couponSlice.actions;

export default couponSlice.reducer;
