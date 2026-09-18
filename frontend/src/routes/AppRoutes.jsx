import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/public/Home';
import StoreDetails from '../pages/public/StoreDetails';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Customer imports
import CustomerLayout from '../layouts/CustomerLayout';
import Profile from '../pages/customer/Profile';
import Cart from '../pages/customer/Cart';
import Wishlist from '../pages/customer/Wishlist';
import Addresses from '../pages/customer/Addresses';
import Orders from '../pages/customer/Orders';
import OrderDetails from '../pages/customer/OrderDetails';
import Checkout from '../pages/customer/Checkout';
import OrderSuccess from '../pages/customer/OrderSuccess';
import OrderFailed from '../pages/customer/OrderFailed';
import CustomerSettings from '../pages/customer/Settings';

// Admin imports
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import AddProduct from '../pages/admin/products/AddProduct';
import Stores from "../pages/admin/Stores";
import Coupons from "../pages/admin/Coupons";
import OrdersAdmin from "../pages/admin/Orders";
import SettingsAdmin from "../pages/admin/Settings";
import Customers from "../pages/admin/Customers";
import Categories from "../pages/admin/Categories";
import Inventory from "../pages/admin/products/Inventory";

// Security & Auth
import ProtectedRoute from "../components/common/ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Client Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/store/:slug" element={<StoreDetails />} />

      {/* Customer Routes - Protected for authenticated users */}
      <Route element={<ProtectedRoute allowedRoles={['customer', 'seller', 'admin']} />}>
        <Route element={<CustomerLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/customer/profile" element={<Navigate to="/profile" replace />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/customer/cart" element={<Navigate to="/cart" replace />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/customer/wishlist" element={<Navigate to="/wishlist" replace />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/customer/addresses" element={<Navigate to="/addresses" replace />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/customer/checkout" element={<Navigate to="/checkout" replace />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customer/orders" element={<Navigate to="/orders" replace />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/customer/orders/:id" element={<OrderDetails />} />
          <Route path="/order/success/:id" element={<OrderSuccess />} />
          <Route path="/order/failed" element={<OrderFailed />} />
          <Route path="/settings" element={<CustomerSettings />} />
          <Route path="/customer/settings" element={<Navigate to="/settings" replace />} />
        </Route>
      </Route>

      {/* Admin Operations Suite - Protected for 'admin' role only */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/categories" element={<Categories />} />
          <Route path="products/inventory" element={<Inventory />} />
          <Route path="stores" element={<Stores />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

