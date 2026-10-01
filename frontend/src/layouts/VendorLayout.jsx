import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import VendorSidebar from '../components/vendor/VendorSidebar';
import VendorNavbar from '../components/vendor/VendorNavbar';
import { fetchVendorDashboard } from '../redux/slices/vendorSlice';

const VendorLayout = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch live vendor profile and metrics on layout mount
  useEffect(() => {
    dispatch(fetchVendorDashboard());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchVendorDashboard()).unwrap();
    } catch (err) {
      console.warn('Dashboard refresh notice:', err);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 antialiased selection:bg-emerald-600 selection:text-white">
      {/* Responsive Vendor Sidebar */}
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <VendorNavbar
          onMenuClick={() => setSidebarOpen(true)}
          onRefresh={handleRefresh}
          loading={refreshing}
        />

        {/* Dynamic Outlet Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
