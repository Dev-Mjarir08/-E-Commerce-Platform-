import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/public/Home';
import StoreDetails from '../pages/public/StoreDetails';
import Login from '../pages/auth/Login';

// Admin imports
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Products from '../pages/admin/Products';
import Stores from '../pages/admin/Stores';
import Coupons from '../pages/admin/Coupons';
import Settings from '../pages/admin/Settings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Client Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/store/:slug" element={<StoreDetails />} />

      {/* Admin Operations Suite */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="stores" element={<Stores />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
