import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/public/Home';
import StoreDetails from '../pages/public/StoreDetails';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/store/:slug" element={<StoreDetails />} />
      {/* Fallback to Home for now */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
