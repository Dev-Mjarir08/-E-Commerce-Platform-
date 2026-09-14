import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/public/Home';
import StoreDetails from '../pages/public/StoreDetails';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Customer imports
import CustomerLayout from '../layouts/CustomerLayout';
import Profile from '../pages/customer/Profile';

// Admin imports
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import AddProduct from '../pages/admin/products/AddProduct';
import Stores from "../pages/admin/Stores";
import Coupons from "../pages/admin/Coupons";
import Orders from "../pages/admin/Orders";
import Settings from "../pages/admin/Settings";
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
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

