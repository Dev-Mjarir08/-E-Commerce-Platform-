import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Plus,
  ChevronDown,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';

const AdminNavbar = ({ isCollapsed, setIsMobileOpen }) => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dynamic breadcrumb/page title mapping
  const getPageTitle = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/admin/products')) {
      return { title: 'Product Catalog', category: 'Catalog Management' };
    }
    if (path.includes('/admin/stores')) {
      return { title: 'Tenant Boutiques', category: 'Multi-Store Operations' };
    }
    if (path.includes('/admin/coupons')) {
      return { title: 'Coupons & Promotions', category: 'Discount Engine' };
    }
    if (path.includes('/admin/settings')) {
      return { title: 'Platform Settings', category: 'Administration' };
    }
    return { title: 'Dashboard Overview', category: 'Catalog Analytics' };
  };

  const { title, category } = getPageTitle();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
      {/* Left Area: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open mobile menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {category}
          </span>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Middle: Quick Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name, SKU, or category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right Area: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Product Button */}
        <Link
          to="/admin/products"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Add Product</span>
        </Link>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        {/* Admin Avatar Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              AD
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">Admin</span>
              <span className="text-[10px] text-slate-500">Store Manager</span>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50"
              onClick={() => setShowProfileMenu(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Admin</p>
                <p className="text-[11px] text-slate-500 truncate">admin@m4m-platform.com</p>
              </div>
              <Link
                to="/admin/settings"
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <SettingsIcon size={14} className="text-slate-500" />
                <span>Admin Settings</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
              >
                <LogOut size={14} className="text-rose-500" />
                <span>Log Out</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
