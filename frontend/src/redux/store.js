import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import storeReducer from './slices/storeSlice';
import couponReducer from './slices/couponSlice';
import customerReducer from './slices/customerSlice';
import vendorReducer from './slices/vendorSlice';
import categoryReducer from './slices/categorySlice';
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    products: productReducer,
    stores: storeReducer,
    categories: categoryReducer,
    coupons: couponReducer,
    customers: customerReducer,
    vendor: vendorReducer,
    orders: orderReducer,
  }
});

export default store;