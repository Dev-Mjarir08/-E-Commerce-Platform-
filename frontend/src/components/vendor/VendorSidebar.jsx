import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Users,
  Star,
  BarChart3,
  Settings,
  Bell,
  Boxes,
  AlertTriangle,
  AlertCircle,
  History,
  Tag,
  UploadCloud,
  Store,
  UserCheck,
  Layers,
  ExternalLink,
  X
} from 'lucide-react';

const VendorSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, store, metrics } = useSelector((state) => state.vendor || {});
  const { user: authUser } = useSelector((state) => state.auth || {});

  const storeName = store?.name || 'Atelier Store';
  const vendorName = user?.name || authUser?.name || 'Vendor Partner';

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
      isActive(path)
        ? 'bg-emerald-600 text-white font-semibold'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <aside
      className={`fixed md:static top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 shrink-0`}
    >
      <div>
        {/* Brand */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-900 font-bold text-base">
              {storeName ? storeName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white leading-tight truncate">
                {storeName}
              </h2>
              <p className="text-[11px] text-slate-400 truncate">{vendorName}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white md:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Links Navigation */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          {/* Core Operations */}
          <div>
            <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Core Operations
            </p>
            <div className="space-y-0.5">
              <Link to="/vendor/dashboard" className={linkClass('/vendor/dashboard')}>
                <LayoutDashboard size={16} />
                <span>Overview</span>
              </Link>
              <Link to="/vendor/orders" className={linkClass('/vendor/orders')}>
                <ShoppingBag size={16} />
                <span>Orders</span>
              </Link>
            </div>
          </div>

          {/* Catalog & Stock */}
          <div>
            <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Catalog & Stock
            </p>
            <div className="space-y-0.5">
              <Link to="/vendor/products" className={linkClass('/vendor/products')}>
                <Package size={16} />
                <span>All Products</span>
              </Link>
              <Link to="/vendor/products/create" className={linkClass('/vendor/products/create')}>
                <PlusCircle size={16} />
                <span>Add Product</span>
              </Link>
              <Link to="/vendor/inventory" className={linkClass('/vendor/inventory')}>
                <Boxes size={16} />
                <span>Inventory Control</span>
              </Link>
            </div>
          </div>

          {/* Customers & Marketing */}
          <div>
            <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Customers & Growth
            </p>
            <div className="space-y-0.5">
              <Link to="/vendor/customers" className={linkClass('/vendor/customers')}>
                <Users size={16} />
                <span>Customers</span>
              </Link>
              <Link to="/vendor/coupons" className={linkClass('/vendor/coupons')}>
                <Tag size={16} />
                <span>Coupons</span>
              </Link>
              <Link to="/vendor/analytics" className={linkClass('/vendor/analytics')}>
                <BarChart3 size={16} />
                <span>Analytics</span>
              </Link>
            </div>
          </div>

          {/* Store & Settings */}
          <div>
            <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Store & Account
            </p>
            <div className="space-y-0.5">
              <Link to="/vendor/store" className={linkClass('/vendor/store')}>
                <Store size={16} />
                <span>Storefront</span>
              </Link>
              <Link to="/vendor/settings" className={linkClass('/vendor/settings')}>
                <Settings size={16} />
                <span>Store Settings</span>
              </Link>
              <Link to="/vendor/profile" className={linkClass('/vendor/profile')}>
                <UserCheck size={16} />
                <span>Vendor Profile</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
        >
          <ExternalLink size={15} />
          <span>Public Boutique</span>
        </Link>
      </div>
    </aside>
  );
};

export default VendorSidebar;
