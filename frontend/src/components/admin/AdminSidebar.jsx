import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const AdminSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const totalProducts = useSelector((state) => state.products.items.length);

  const mainNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package, badge: `${totalProducts}` }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
            M4
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white tracking-wide text-sm truncate">M4M PLATFORM</span>
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Admin Portal</span>
            </div>
          )}
        </div>

        {/* Collapse toggle on desktop */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Admin Profile Mini Card */}
      {!isCollapsed && (
        <div className="p-4 mx-3 my-3 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white truncate">Administrator</span>
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            </div>
            <span className="text-[11px] text-slate-400 block truncate">admin@m4m-platform.com</span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {!isCollapsed ? 'Menu' : '•••'}
        </div>

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!isCollapsed && <span className="truncate flex-1">{item.name}</span>}
              {!isCollapsed && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title={isCollapsed ? 'View Storefront' : undefined}
        >
          <ExternalLink size={16} className="text-slate-400 shrink-0" />
          {!isCollapsed && <span className="truncate">View Public Store</span>}
        </Link>
        {!isCollapsed && (
          <div className="pt-2 px-3 text-[10px] text-slate-500 flex items-center justify-between">
            <span>v2.4.0</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`fixed top-0 bottom-0 left-0 z-30 ${isCollapsed ? 'w-20' : 'w-64'}`}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
