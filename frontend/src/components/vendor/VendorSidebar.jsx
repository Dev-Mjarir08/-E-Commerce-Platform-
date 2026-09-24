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
  Tag,
  Store,
  UserCheck,
  ExternalLink,
  X
} from 'lucide-react';

const VendorSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, store } = useSelector((state) => state.vendor || {});
  const { user: authUser } = useSelector((state) => state.auth || {});

  const storeName = store?.name || 'Atelier Store';
  const vendorName = user?.name || authUser?.name || 'Vendor Partner';

  const isActive = (path) => {
    if (path === '/vendor/dashboard') {
      return location.pathname === '/vendor' || location.pathname === '/vendor/dashboard';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
      isActive(path)
        ? 'bg-emerald-600 text-white font-semibold shadow-xs'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  const navGroups = [
    {
      group: 'Operations',
      links: [
        { label: 'Overview', to: '/vendor/dashboard', icon: LayoutDashboard },
        { label: 'Orders', to: '/vendor/orders', icon: ShoppingBag },
      ]
    },
    {
      group: 'Catalog & Stock',
      links: [
        { label: 'All Products', to: '/vendor/products', icon: Package },
        { label: 'Add Product', to: '/vendor/products/create', icon: PlusCircle },
        { label: 'Inventory Control', to: '/vendor/inventory', icon: Boxes },
      ]
    },
    {
      group: 'Customers & Growth',
      links: [
        { label: 'Customers', to: '/vendor/customers', icon: Users },
        { label: 'Coupons & Deals', to: '/vendor/coupons', icon: Tag },
        { label: 'Reviews & Feedback', to: '/vendor/reviews', icon: Star },
        { label: 'Analytics & Reports', to: '/vendor/analytics', icon: BarChart3 },
      ]
    },
    {
      group: 'Communications',
      links: [
        { label: 'Notifications', to: '/vendor/notifications', icon: Bell },
      ]
    },
    {
      group: 'Store & Settings',
      links: [
        { label: 'Storefront', to: '/vendor/store', icon: Store },
        { label: 'Store Settings', to: '/vendor/settings', icon: Settings },
        { label: 'Vendor Profile', to: '/vendor/profile', icon: UserCheck },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 shrink-0 border-r border-slate-800`}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* Brand */}
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <Link to="/vendor/dashboard" className="flex items-center gap-3 min-w-0" onClick={onClose}>
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-900 font-bold text-base shrink-0 shadow-sm">
                {storeName ? storeName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white leading-tight truncate">
                  {storeName}
                </h2>
                <p className="text-[11px] text-slate-400 truncate">{vendorName}</p>
              </div>
            </Link>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white md:hidden p-1 rounded-md"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Links Navigation */}
          <nav className="p-3 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            {navGroups.map((group) => (
              <div key={group.group}>
                <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  {group.group}
                </p>
                <div className="space-y-0.5">
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={onClose}
                        className={linkClass(link.to)}
                      >
                        <Icon size={16} className="shrink-0" />
                        <span className="truncate">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer Navigation */}
          <div className="p-3 border-t border-slate-800 space-y-1 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
            >
              <ExternalLink size={15} />
              <span>Public Boutique</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default VendorSidebar;
