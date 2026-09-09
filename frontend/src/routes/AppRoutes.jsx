import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/public/Home';
import StoreDetails from '../pages/public/StoreDetails';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/store/:slug" element={<StoreDetails />} />
      {/* Fallback to Home for now */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
