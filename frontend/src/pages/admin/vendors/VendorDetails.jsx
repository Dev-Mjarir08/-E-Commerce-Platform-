import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Store,
  Mail,
  Phone,
  MapPin,
  Package,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  Ban,
  User,
  Globe,
  Calendar,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Truck,
  Bell,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import adminApi from '../../../services/adminApi';

const VendorDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendorDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.getVendorById(id);
      const resData = response?.data || response;
      if (resData && (resData.user || resData.store)) {
        setData(resData);
      } else {
        setError('Vendor record could not be loaded from database.');
      }
    } catch (err) {
      console.error('Error fetching vendor details:', err);
      setError(err?.message || 'Failed to load vendor details from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVendorDetails();
    }
  }, [id]);

  const getStatusBadge = (status) => {
    const s = String(status || 'active').toLowerCase();
    switch (s) {
      case 'active':
        return {
          label: 'Active',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle2
        };
      case 'pending':
        return {
          label: 'Pending Review',
          className: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Clock3
        };
      case 'suspended':
        return {
          label: 'Suspended',
          className: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: Ban
        };
      default:
        return {
          label: status || 'Unknown',
          className: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: Store
        };
    }
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return 'N/A';
    try {
      return new Date(dateVal).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/admin/vendors" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Vendors
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <h3 className="text-base font-bold text-slate-800">Loading Vendor Information</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Retrieving live seller records, storefront profile, metrics, and catalog counts from MongoDB...
          </p>
        </div>
      </div>
    );
  }

  // Error / Not Found State
  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/admin/vendors" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Vendors
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Vendor Not Found</h3>
          <p className="text-xs text-slate-500 mt-2">
            {error || `Unable to find vendor with identifier "${id}". The seller may have been deleted or the ID is invalid.`}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/admin/vendors"
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Return to Vendor List
            </Link>
            <button
              type="button"
              onClick={fetchVendorDetails}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              <span>Retry Query</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { user, store, products = [], productsCount = 0, ordersCount = 0, salesVolume = '₹0' } = data;
  const storeStatusConfig = getStatusBadge(store?.status || user?.status);
  const StoreStatusIcon = storeStatusConfig.icon;
  const isVerifiedSeller = Boolean(user?.isVerified || store?.isVerified);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/vendors"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Vendors</span>
        </Link>

        <button
          type="button"
          onClick={fetchVendorDetails}
          title="Refresh vendor details from database"
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw size={13} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Main Header Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner Graphic if available */}
        {store?.banner?.url ? (
          <div className="h-44 w-full bg-slate-100 overflow-hidden relative border-b border-slate-200">
            <img
              src={store.banner.url}
              alt={store.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="h-28 w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800" />
        )}

        <div className="p-6 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Logo / Avatar */}
            <div className="-mt-14 sm:-mt-16 w-24 h-24 rounded-2xl bg-white p-1 border-2 border-white shadow-lg overflow-hidden shrink-0">
              <img
                src={
                  store?.logo?.url ||
                  user?.avatar?.url ||
                  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80'
                }
                alt={store?.name || user?.name || 'Vendor Logo'}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {store?.name || user?.name || 'Boutique Store'}
                </h1>

                {isVerifiedSeller && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                    Verified Seller
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                {store?.slug && (
                  <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    /store/{store.slug}
                  </span>
                )}
                {store?.category && <span>Category: <strong className="text-slate-700">{store.category}</strong></span>}
                <span>Member since {formatDate(user?.createdAt || store?.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${storeStatusConfig.className}`}
            >
              <StoreStatusIcon size={14} />
              <span>{storeStatusConfig.label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* KPI Counters (Products, Orders, Sales, Rating) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Catalog Products</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{productsCount}</span>
            <span className="text-[11px] font-semibold text-slate-400">Live in catalog</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{ordersCount}</span>
            <span className="text-[11px] font-semibold text-slate-400">Tenant volume</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{salesVolume}</span>
            <span className="text-[11px] font-semibold text-slate-400">Gross volume</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Store Rating</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {store?.ratingAverage ? store.ratingAverage.toFixed(1) : '5.0'}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {store?.ratingCount ? `(${store.ratingCount} reviews)` : 'Default rating'}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Storefront & Catalog Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Storefront Overview */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Store size={18} className="text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Storefront Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">Store Name</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {store?.name || 'Not configured'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block">Storefront Slug</span>
                <span className="font-mono text-indigo-600 font-semibold mt-0.5 block">
                  {store?.slug ? `/store/${store.slug}` : 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block">Specialty Category</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {store?.category || 'Atelier General'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block">Website</span>
                {store?.website ? (
                  <a
                    href={store.website.startsWith('http') ? store.website : `https://${store.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-indigo-600 hover:underline mt-0.5 inline-flex items-center gap-1"
                  >
                    <Globe size={12} />
                    <span>{store.website}</span>
                  </a>
                ) : (
                  <span className="text-slate-400 italic mt-0.5 block">Not provided</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold text-xs block">Description / Editorial Tagline</span>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1 leading-relaxed">
                {store?.description || 'No store description provided by vendor.'}
              </p>
            </div>
          </div>

          {/* Store Location & Business Address */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin size={18} className="text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Store Location & Business Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">Street Address</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {store?.address?.street || 'Not provided'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block">City & State</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {[store?.address?.city, store?.address?.state].filter(Boolean).join(', ') || 'Global'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block">Postal / ZIP Code</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {store?.address?.postalCode || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block">Country</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {store?.address?.country || 'International'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block">Store Public Email</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {store?.email || user?.email || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block">Store Contact Phone</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {store?.phone || user?.phone || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Operational Settings & Policies if available */}
          {store?.settings && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Truck size={18} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Store Operations & Compliance
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Business Entity</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {store.settings.businessType || 'LLC'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block">Tax ID / GST</span>
                  <span className="font-mono text-slate-800 mt-0.5 block">
                    {store.settings.taxId || 'Registered Standard'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block">Default Tax Rate</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {store.settings.defaultTaxRate ? `${store.settings.defaultTaxRate}%` : 'Standard'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block">Processing Time</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {store.settings.processingTime || '1-2 Business Days'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block">Free Shipping Above</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    ₹{store.settings.freeShippingThreshold || '75.00'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block">Local Pickup</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {store.settings.enableLocalPickup ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Catalog Products Preview */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Associated Products ({productsCount})
                </h2>
              </div>

              {productsCount > 0 && (
                <Link
                  to={`/admin/products?store=${store?._id || store?.slug || ''}`}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View All in Products Table &rarr;
                </Link>
              )}
            </div>

            {products.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No products have been uploaded by this boutique vendor yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <div key={prod._id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80'}
                        alt={prod.title}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{prod.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono">SKU: {prod.sku || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div>
                        <p className="font-bold text-slate-900">₹{prod.basePrice?.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-500">Stock: {prod.stock ?? 'N/A'}</p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {prod.isActive ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Vendor Identity, Banking & Notifications */}
        <div className="space-y-6">
          {/* Vendor Owner Identity Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User size={18} className="text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Seller Account Information
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'VN'}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{user?.name || 'Administrator Tenant'}</p>
                  <p className="text-[11px] text-slate-400 capitalize">Role: {user?.role || 'Seller / Vendor'}</p>
                </div>
              </div>

              <div className="pt-2 space-y-2.5 border-t border-slate-100">
                <div className="flex items-start gap-2.5">
                  <Mail size={14} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Owner Email</span>
                    <span className="font-medium text-slate-800 break-all">{user?.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone size={14} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Phone</span>
                    <span className="font-medium text-slate-800">{user?.phone || 'Not registered'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar size={14} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Account Created</span>
                    <span className="font-medium text-slate-800">{formatDate(user?.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck size={14} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Verification Status</span>
                    <span
                      className={`font-bold ${
                        isVerifiedSeller ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {isVerifiedSeller ? 'Identity Verified & Approved' : 'Unverified / Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payout & Banking Preferences */}
          {store?.settings && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <CreditCard size={18} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Payout & Banking
                </h2>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Disbursement Method</span>
                  <span className="font-bold text-slate-800 uppercase mt-0.5 block">
                    {store.settings.payoutMethod || 'Direct Bank Transfer'}
                  </span>
                </div>

                {store.settings.bankName && (
                  <div>
                    <span className="text-slate-400 text-[11px] block">Bank Name</span>
                    <span className="font-medium text-slate-800 mt-0.5 block">{store.settings.bankName}</span>
                  </div>
                )}

                {store.settings.accountHolder && (
                  <div>
                    <span className="text-slate-400 text-[11px] block">Account Holder</span>
                    <span className="font-medium text-slate-800 mt-0.5 block">{store.settings.accountHolder}</span>
                  </div>
                )}

                {store.settings.accountNumber && (
                  <div>
                    <span className="text-slate-400 text-[11px] block">Bank Account (Masked)</span>
                    <span className="font-mono text-slate-800 mt-0.5 block">{store.settings.accountNumber}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 text-[11px] block">Payout Schedule</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {store.settings.payoutSchedule || 'Weekly Automated'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Store Notification Settings */}
          {store?.settings && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Bell size={18} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Notification Alerts
                </h2>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Order Email Alerts</span>
                  <span className={`font-bold ${store.settings.orderEmailAlerts ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {store.settings.orderEmailAlerts ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Low Stock Warnings</span>
                  <span className={`font-bold ${store.settings.lowStockAlerts ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {store.settings.lowStockAlerts ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Customer SMS Alerts</span>
                  <span className={`font-bold ${store.settings.customerSmsAlerts ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {store.settings.customerSmsAlerts ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;