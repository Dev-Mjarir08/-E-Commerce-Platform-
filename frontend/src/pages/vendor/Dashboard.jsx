import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorDashboard } from '../../redux/slices/vendorSlice';

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
  ChevronDown,
  TrendingUp,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  ShoppingCart,
  Boxes,
  Menu,
  X,
  RotateCcw,
  Store,
  ShieldCheck,
  Tag,
  History,
  AlertTriangle,
  UploadCloud,
  UserCheck,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function VendorDashboard() {
  const dispatch = useDispatch();
  const { user, store, metrics, recentOrders, topProducts, loading, error } = useSelector(
    (state) => state.vendor
  );
  const { user: authUser } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('This Month');

  // Fetch Vendor Profile & Dashboard Data on mount
  useEffect(() => {
    dispatch(fetchVendorDashboard());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchVendorDashboard());
  };

  // Profile data with fallbacks
  const vendorName = user?.name || authUser?.name || 'Vendor Partner';
  const storeName = store?.name || 'Atelier Store';
  const avatarUrl =
    user?.avatar?.url ||
    authUser?.avatar?.url ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80';

  // Metrics data
  const stats = [
    {
      title: 'TOTAL SALES',
      value: `$${(metrics?.totalSales || 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      change: '+12.5%',
      subtext: 'vs last month',
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'TOTAL ORDERS',
      value: (metrics?.totalOrders || 0).toString(),
      change: '+4.8%',
      subtext: 'vs last week',
      icon: ShoppingCart,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'AVERAGE ORDER VALUE',
      value: `$${(metrics?.averageOrderValue || 0).toFixed(2)}`,
      change: '+2.1%',
      subtext: 'vs last month',
      icon: TrendingUp,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'ACTIVE PRODUCTS',
      value: (metrics?.activeProducts || 0).toString(),
      change: `${metrics?.totalProducts || 0} total listed`,
      subtext: '',
      icon: Boxes,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  // Helper for order status badge styling
  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s === 'delivered' || s === 'completed') {
      return 'bg-emerald-100 text-emerald-800';
    }
    if (s === 'shipped') {
      return 'bg-blue-100 text-blue-800';
    }
    if (s === 'processing' || s === 'confirmed') {
      return 'bg-purple-100 text-purple-800';
    }
    if (s === 'cancelled' || s === 'failed') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-amber-100 text-amber-800';
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans">
      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-60 md:hidden bg-emerald-600 text-white p-3 rounded-lg shadow-lg"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 shrink-0`}
      >
        <div>
          {/* Vendor Portal Branding */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-900 font-bold text-lg">
                {storeName ? storeName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white leading-tight truncate">
                  {storeName}
                </h2>
                <p className="text-xs text-slate-400 truncate">{vendorName}</p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-white md:hidden"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            {/* Core */}
            <div>
              <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
                Core Operations
              </p>
              <div className="space-y-0.5">
                <Link
                  to="/vendor/dashboard"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-600 text-white font-medium text-xs transition-colors"
                >
                  <LayoutDashboard size={16} />
                  <span>Overview</span>
                </Link>

                <Link
                  to="/vendor/orders"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={16} />
                    <span>Orders</span>
                  </div>
                  {metrics?.totalOrders > 0 && (
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {metrics.totalOrders}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Catalog & Inventory */}
            <div>
              <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
                Products & Stock
              </p>
              <div className="space-y-0.5">
                <Link
                  to="/vendor/products"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-xs transition-colors"
                >
                  <Package size={16} />
                  <span>All Products</span>
                </Link>
                <Link
                  to="/vendor/products/create"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-xs transition-colors"
                >
                  <PlusCircle size={16} />
                  <span>Add Product</span>
                </Link>
                <Link
                  to="/vendor/inventory"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-xs transition-colors"
                >
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
                <Link
                  to="/vendor/customers"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-xs transition-colors"
                >
                  <Users size={16} />
                  <span>Customers</span>
                </Link>
                <Link
                  to="/vendor/coupons"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-xs transition-colors"
                >
                  <Tag size={16} />
                  <span>Coupons & Promo</span>
                </Link>
                <Link
                  to="/vendor/analytics"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-xs transition-colors"
                >
                  <BarChart3 size={16} />
                  <span>Analytics & Sales</span>
                </Link>
              </div>
            </div>

            {/* Storefront & Settings */}
            <div>
              <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
                Store & Account
              </p>
              <div className="space-y-0.5">
                <Link
                  to="/vendor/store"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-xs transition-colors"
                >
                  <Store size={16} />
                  <span>My Storefront</span>
                </Link>
                <Link
                  to="/vendor/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-xs transition-colors"
                >
                  <Settings size={16} />
                  <span>Store Settings</span>
                </Link>
                <Link
                  to="/vendor/profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-xs transition-colors"
                >
                  <UserCheck size={16} />
                  <span>Vendor Profile</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
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

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="ml-10 md:ml-0 text-lg sm:text-xl font-bold text-slate-800">
              Vendor Dashboard
            </h1>
            {store?.isVerified && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full">
                <ShieldCheck size={12} /> Verified Atelier
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRetry}
              disabled={loading}
              title="Refresh Dashboard"
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <RotateCcw size={16} className={loading ? 'animate-spin' : ''} />
            </button>

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
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">{vendorName}</p>
                <p className="text-[10px] font-mono uppercase text-slate-500 mt-1">{storeName}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={18} className="text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className="underline font-semibold hover:text-red-900 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton Indicator */}
          {loading && !user && !store ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Fetching Atelier metrics & records...
              </p>
            </div>
          ) : (
            <>
              {/* VENDOR QUICK ACTION ROUTES BAR */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-500">
                    Quick Operations Hub
                  </span>
                  <span className="text-xs text-slate-400">Direct portal routing</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
                  <Link
                    to="/vendor/products/create"
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200/80 text-slate-700 hover:text-emerald-700 transition-all text-center group"
                  >
                    <PlusCircle size={20} className="text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">New Product</span>
                  </Link>

                  <Link
                    to="/vendor/products"
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200/80 text-slate-700 hover:text-emerald-700 transition-all text-center group"
                  >
                    <Package size={20} className="text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Products</span>
                  </Link>

                  <Link
                    to="/vendor/orders"
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/80 text-slate-700 hover:text-blue-700 transition-all text-center group"
                  >
                    <ShoppingBag size={20} className="text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">All Orders</span>
                  </Link>

                  <Link
                    to="/vendor/inventory"
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200/80 text-slate-700 hover:text-amber-700 transition-all text-center group"
                  >
                    <Boxes size={20} className="text-amber-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Inventory</span>
                  </Link>

                  <Link
                    to="/vendor/coupons"
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-purple-50 hover:border-purple-200 border border-slate-200/80 text-slate-700 hover:text-purple-700 transition-all text-center group"
                  >
                    <Tag size={20} className="text-purple-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Coupons</span>
                  </Link>

                  <Link
                    to="/vendor/customers"
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200/80 text-slate-700 hover:text-indigo-700 transition-all text-center group"
                  >
                    <Users size={20} className="text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Customers</span>
                  </Link>

                  <Link
                    to="/vendor/analytics"
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-teal-50 hover:border-teal-200 border border-slate-200/80 text-slate-700 hover:text-teal-700 transition-all text-center group"
                  >
                    <BarChart3 size={20} className="text-teal-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Analytics</span>
                  </Link>
                </div>
              </div>

              {/* TOP METRICS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                          {stat.title}
                        </span>
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="flex items-center gap-1.5 mt-1 text-xs">
                          {stat.change && (
                            <span className="text-emerald-600 font-semibold flex items-center">
                              <ArrowUpRight size={14} /> {stat.change}
                            </span>
                          )}
                          <span className="text-slate-400">{stat.subtext}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MIDDLE SECTION: SALES TREND & TOP PRODUCTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Performance Card */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-800">Sales Trend</h3>
                      <p className="text-xs text-slate-500">Gross storefront revenue performance</p>
                    </div>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 bg-white focus:outline-none cursor-pointer"
                    >
                      <option>This Month</option>
                      <option>Last Quarter</option>
                      <option>This Year</option>
                    </select>
                  </div>

                  {/* SVG Chart Graphic */}
                  <div className="h-60 w-full relative flex flex-col justify-between pt-4">
                    <div className="border-b border-slate-100 text-[10px] font-mono text-slate-400 pb-1">
                      $10,000
                    </div>
                    <div className="border-b border-slate-100 text-[10px] font-mono text-slate-400 pb-1">
                      $5,000
                    </div>
                    <div className="border-b border-slate-100 text-[10px] font-mono text-slate-400 pb-1">
                      $2,500
                    </div>
                    <div className="border-b border-slate-100 text-[10px] font-mono text-slate-400 pb-1">
                      $0
                    </div>

                    {/* Ambient wave graph illustration */}
                    <svg
                      className="absolute inset-0 w-full h-full pt-6 pointer-events-none"
                      preserveAspectRatio="none"
                      viewBox="0 0 400 150"
                    >
                      <defs>
                        <linearGradient id="vendorGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,130 C80,90 120,40 200,60 C280,80 320,20 400,30 L400,150 L0,150 Z"
                        fill="url(#vendorGrad)"
                      />
                      <path
                        d="M0,130 C80,90 120,40 200,60 C280,80 320,20 400,30"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Top Listed Products */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">Featured Catalog</h3>
                    <p className="text-xs text-slate-500 mb-4">Latest products from your atelier</p>

                    {topProducts && topProducts.length > 0 ? (
                      <div className="space-y-3.5">
                        {topProducts.slice(0, 5).map((prod, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="min-w-0 pr-2">
                              <p className="font-medium text-slate-800 truncate">{prod.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                Stock: {prod.stock} units
                              </p>
                            </div>
                            <span className="font-semibold text-slate-900 font-mono shrink-0">
                              ${prod.price || '0.00'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 space-y-2">
                        <Boxes size={28} className="mx-auto text-slate-300" />
                        <p className="text-xs text-slate-500">No products uploaded yet.</p>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/vendor/orders"
                    className="mt-5 text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 block"
                  >
                    Manage Store Orders →
                  </Link>
                </div>
              </div>

              {/* BOTTOM SECTION: STORE HEALTH & RECENT ORDERS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Store Health Metrics Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                  <h3 className="text-base font-semibold text-slate-800 mb-4">Store Overview</h3>

                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                        <div>
                          <p className="text-xs text-slate-500">Storefront Status</p>
                          <p className="text-sm font-semibold text-slate-800 capitalize">
                            {store?.status || 'Active'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-600 font-medium">Healthy</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Star size={20} className="text-amber-500 fill-amber-500" />
                        <div>
                          <p className="text-xs text-slate-500">Customer Rating</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {store?.ratingAverage || 5.0} / 5.0
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">
                        {store?.ratingCount || 0} reviews
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Store size={20} className="text-slate-600" />
                        <div>
                          <p className="text-xs text-slate-500">Storefront Link</p>
                          <p className="text-xs font-mono text-slate-700 truncate max-w-35">
                            /store/{store?.slug || 'my-store'}
                          </p>
                        </div>
                      </div>
                      {store?.slug && (
                        <Link
                          to={`/store/${store.slug}`}
                          className="text-xs text-emerald-600 font-medium hover:underline"
                        >
                          Visit
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Orders List Table */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-slate-800">Recent Orders</h3>
                    <Link
                      to="/vendor/orders"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      View All Orders →
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    {recentOrders && recentOrders.length > 0 ? (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-medium">
                            <th className="pb-3">Order ID</th>
                            <th className="pb-3">Customer</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Total</th>
                            <th className="pb-3">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {recentOrders.map((order, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3 font-semibold font-mono text-slate-800">
                                #{order.orderNumber || order._id?.slice(-6) || 'ORDER'}
                              </td>
                              <td className="py-3 font-medium">
                                {order.user?.name || order.shippingAddress?.recipientName || 'Client'}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${getStatusBadge(
                                    order.orderStatus
                                  )}`}
                                >
                                  {order.orderStatus || 'Pending'}
                                </span>
                              </td>
                              <td className="py-3 font-semibold font-mono text-slate-900">
                                ${(order.totalAmount || order.totalPrice || 0).toFixed(2)}
                              </td>
                              <td className="py-3 text-slate-500 font-mono text-[11px]">
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })
                                  : 'Recently'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-10 space-y-2">
                        <ShoppingBag size={28} className="mx-auto text-slate-300" />
                        <p className="text-xs text-slate-500">
                          No recent orders recorded for this atelier.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}