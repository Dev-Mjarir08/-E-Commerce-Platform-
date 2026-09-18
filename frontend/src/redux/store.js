import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import storeReducer from './slices/storeSlice';
import couponReducer from './slices/couponSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    products: productReducer,
    stores: storeReducer,
    coupons: couponReducer
  }
});

export default store;