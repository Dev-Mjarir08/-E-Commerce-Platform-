import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Menu,
  Search,
  Plus,
  ChevronDown,
  Settings as SettingsIcon,
  LogOut,
  ShoppingBag,
  ExternalLink,
  User as UserIcon,
  Store
} from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';
import { getImageUrl } from '../../utils/imageUrl';

const AdminNavbar = ({ setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // Dynamic breadcrumb/page title mapping
  const getPageTitle = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/admin/products/inventory')) {
      return { title: 'Inventory Control', category: 'Catalog Management' };
    }
    if (path.includes('/admin/products/categories')) {
      return { title: 'Product Categories', category: 'Catalog Management' };
    }
    if (path.includes('/admin/products/add')) {
      return { title: 'Add Product', category: 'Catalog Management' };
    }
    if (path.includes('/admin/products')) {
      return { title: 'Product Catalog', category: 'Catalog Management' };
    }
    if (path.includes('/admin/stores')) {
      return { title: 'Tenant Boutiques', category: 'Multi-Store Operations' };
    }
    if (path.includes('/admin/coupons')) {
      return { title: 'Coupons & Promotions', category: 'Discount Engine' };
    }
    if (path.includes('/admin/orders')) {
      return { title: 'Order Fulfillment', category: 'Sales & Logistics' };
    }
    if (path.includes('/admin/customers')) {
      return { title: 'Client Directory', category: 'Customer Relations' };
    }
    if (path.includes('/admin/settings')) {
      return { title: 'Platform Settings', category: 'Administration' };
    }
    return { title: 'Dashboard Overview', category: 'Catalog Analytics' };
  };

  const { title, category } = getPageTitle();

  const userInitials = (user?.name || 'AD')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AD';

  const rawAvatar = user?.avatar?.url || (typeof user?.avatar === 'string' ? user.avatar : null);
  const avatarUrl = rawAvatar ? getImageUrl(rawAvatar) : null;

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

      {/* Right Area: Actions, Customer Page Switcher & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Go to Customer Page Button */}
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-all shadow-xs group"
          title="Go to Customer Storefront / Page"
        >
          <ShoppingBag size={15} className="text-indigo-600 group-hover:scale-110 transition-transform shrink-0" />
          <span className="hidden sm:inline">Customer Page</span>
          <span className="sm:hidden">Store</span>
          <ExternalLink size={12} className="text-slate-400 group-hover:text-slate-600 transition-colors hidden md:inline shrink-0" />
        </Link>

        {/* Quick Add Product Button */}
        <Link
          to="/admin/products/add"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Add Product</span>
        </Link>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        {/* Big & Properly Aligned Admin Avatar Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2.5 sm:gap-3 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200/80 transition-all focus:outline-none"
            aria-expanded={showProfileMenu}
            aria-label="Admin Profile Menu"
          >
            {/* Big Profile Avatar */}
            <div className="relative w-10 h-10 rounded-full shrink-0 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || 'Admin'}
                  className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-indigo-600/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-700 text-white flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-indigo-600/20 tracking-wider">
                  {userInitials}
                </div>
              )}
              {/* Online indicator */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            {/* User Meta - Properly Aligned */}
            <div className="hidden sm:flex flex-col text-left justify-center min-w-0">
              <span className="text-xs font-bold text-slate-900 leading-snug truncate max-w-[120px]">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                {user?.role ? `${user.role}` : 'ADMIN'}
              </span>
            </div>

            <ChevronDown
              size={15}
              className={`text-slate-400 transition-transform duration-200 hidden sm:block shrink-0 ${
                showProfileMenu ? 'rotate-180 text-indigo-600' : ''
              }`}
            />
          </button>

          {showProfileMenu && (
            <div
              className="absolute right-0 mt-2.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onClick={() => setShowProfileMenu(false)}
            >
              {/* Profile Card Header with Large Avatar */}
              <div className="px-3.5 py-3 border-b border-slate-100 flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full shrink-0 flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || 'Admin'}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-600/20 shadow-xs"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-700 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                      {userInitials}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user?.name || 'Administrator'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@domain.com'}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    {user?.role ? `${user.role.toUpperCase()} PORTAL` : 'ADMIN PORTAL'}
                  </span>
                </div>
              </div>

              {/* Menu Navigation Links */}
              <div className="py-1">
                <Link
                  to="/"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition-colors"
                >
                  <ShoppingBag size={15} className="text-indigo-600" />
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-slate-800">Customer Storefront</span>
                    <span className="text-[10px] text-slate-400">View live marketplace</span>
                  </div>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition-colors"
                >
                  <UserIcon size={15} className="text-slate-500" />
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-slate-800">Customer Profile</span>
                    <span className="text-[10px] text-slate-400">View buyer account</span>
                  </div>
                </Link>

                <Link
                  to="/admin/settings"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition-colors"
                >
                  <SettingsIcon size={15} className="text-slate-500" />
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-slate-800">Admin Settings</span>
                    <span className="text-[10px] text-slate-400">Platform preferences</span>
                  </div>
                </Link>
              </div>

              {/* Logout Option */}
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut size={15} className="text-rose-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Direct Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 text-xs font-semibold border border-rose-200 transition-colors shadow-xs"
          title="Log Out of Admin Portal"
        >
          <LogOut size={14} className="text-rose-600 shrink-0" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
