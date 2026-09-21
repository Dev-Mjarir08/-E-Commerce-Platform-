import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Menu,
  Bell,
  Store,
  RotateCcw,
  ShieldCheck,
  PlusCircle,
  ShoppingBag,
  Boxes
} from 'lucide-react';

const VendorNavbar = ({ onMenuClick, onRefresh, loading }) => {
  const { user, store } = useSelector((state) => state.vendor || {});
  const { user: authUser } = useSelector((state) => state.auth || {});

  const vendorName = user?.name || authUser?.name || 'Vendor Partner';
  const storeName = store?.name || 'Atelier Store';
  const avatarUrl =
    user?.avatar?.url ||
    authUser?.avatar?.url ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80';

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="text-base sm:text-lg font-bold text-slate-800">
          Vendor Operations
        </h1>
        {store?.isVerified && (
          <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full">
            <ShieldCheck size={12} /> Verified Atelier
          </span>
        )}
      </div>

      {/* Quick Action Navigation in Navbar */}
      <div className="hidden lg:flex items-center gap-2">
        <Link
          to="/vendor/products/create"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium transition-colors"
        >
          <PlusCircle size={14} />
          <span>New Product</span>
        </Link>
        <Link
          to="/vendor/orders"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
        >
          <ShoppingBag size={14} />
          <span>Orders</span>
        </Link>
        <Link
          to="/vendor/inventory"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
        >
          <Boxes size={14} />
          <span>Inventory</span>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh Data"
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          >
            <RotateCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        )}

        <Link
          to="/vendor/notifications"
          title="Vendor Notifications"
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </Link>

        <Link
          to="/vendor/store"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
        >
          <Store size={14} />
          <span>Storefront</span>
        </Link>

        <Link
          to="/vendor/profile"
          className="flex items-center gap-3 pl-3 border-l border-slate-200 hover:opacity-85 transition-opacity"
        >
          <img
            src={avatarUrl}
            alt={vendorName}
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">{vendorName}</p>
            <p className="text-[10px] font-mono uppercase text-slate-500 mt-1">{storeName}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default VendorNavbar;
