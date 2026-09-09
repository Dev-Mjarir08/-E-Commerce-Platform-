import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: ['m4m-01'] // Pre-seed 1 item
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const productId = action.payload;
      if (state.items.includes(productId)) {
        state.items = state.items.filter(id => id !== productId);
      } else {
        state.items.push(productId);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    }
  }
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
