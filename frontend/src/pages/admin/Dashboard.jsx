import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Store,
  TicketPercent,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Layers,
  Star,
  Plus
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import { updateProduct as updateProductRedux } from '../../redux/slices/productSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.stores?.items || []);
  const coupons = useSelector((state) => state.coupons?.items || []);
  const reduxProducts = useSelector((state) => state.products?.items || []);

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStockCount: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalStores: 0,
    totalCategories: 0,
    totalInventoryValue: 0,
    recentProducts: []
  });

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const statsRes = await adminApi.getDashboardStats();
      const statsData = statsRes?.data || statsRes;

      if (statsData && typeof statsData.totalProducts === 'number') {
        setStats({
          totalProducts: statsData.totalProducts,
          inStockCount: statsData.inStockCount ?? 0,
          lowStockCount: statsData.lowStockCount ?? 0,
          outOfStockCount: statsData.outOfStockCount ?? 0,
          totalStores: statsData.totalStores ?? stores.length,
          totalCategories: statsData.totalCategories ?? 6,
          totalInventoryValue: statsData.totalInventoryValue ?? 0,
          recentProducts: Array.isArray(statsData.recentProducts) ? statsData.recentProducts : []
        });
      }

      // Sync Redux cache with latest items
      const prodRes = await adminApi.getProducts({ limit: 100 });
      const items = Array.isArray(prodRes?.data)
        ? prodRes.data
        : Array.isArray(prodRes?.data?.data)
        ? prodRes.data.data
        : Array.isArray(prodRes)
        ? prodRes
        : [];

      if (items.length > 0) {
        items.forEach((p) => dispatch(updateProductRedux(p)));
      }

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Dashboard fetch notice:', err.message);
      // Fallback calculation from Redux state
      const total = reduxProducts.length;
      const inStock = reduxProducts.filter((p) => (Number(p.stock ?? p.stockCount) || 0) > 8).length;
      const lowStock = reduxProducts.filter((p) => {
        const s = Number(p.stock ?? p.stockCount) || 0;
        return s > 0 && s <= 8;
      }).length;
      const totalVal = reduxProducts.reduce((acc, p) => {
        const s = Number(p.stock ?? p.stockCount) || 0;
        const pr = Number(p.basePrice ?? p.price) || 0;
        return acc + s * pr;
      }, 0);

      setStats({
        totalProducts: total,
        inStockCount: inStock,
        lowStockCount: lowStock,
        outOfStockCount: reduxProducts.filter((p) => (Number(p.stock ?? p.stockCount) || 0) === 0).length,
        totalStores: stores.length,
        totalCategories: 6,
        totalInventoryValue: totalVal,
        recentProducts: reduxProducts.slice(0, 6)
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Admin Overview</h2>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Database Connected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time catalog analytics, stock monitoring, and operations control center.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {lastUpdated && (
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              Updated: {lastUpdated}
            </span>
          )}

          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={isLoading}
            title="Refresh Live Metrics from MongoDB"
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-indigo-600' : ''} />
            <span>Refresh</span>
          </button>

          <Link
            to="/admin/products"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus size={14} />
            <span>Manage Catalog</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Products</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Package size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalProducts}
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              In Catalog
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span>Live products stored in MongoDB</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inventory Valuation</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700 tracking-tight">
              ₹{stats.totalInventoryValue.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Assets
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Sum of (basePrice &times; stock)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Healthy Stock</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-700 tracking-tight">
              {stats.inStockCount}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              &gt; 8 units
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Active inventory available to ship</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Stock Attention</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-600 tracking-tight">
              {stats.lowStockCount + stats.outOfStockCount}
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              {stats.outOfStockCount} Out of Stock
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">{stats.lowStockCount} items low stock (&le;8)</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
              <Store size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Flagship Boutiques</span>
              <span className="text-[11px] text-slate-400">{stats.totalStores} active boutique stores</span>
            </div>
          </div>
          <span className="text-xl font-black text-slate-900">{stats.totalStores}</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Catalog Categories</span>
              <span className="text-[11px] text-slate-400">{stats.totalCategories} active departments</span>
            </div>
          </div>
          <span className="text-xl font-black text-slate-900">{stats.totalCategories}</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
              <TicketPercent size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Active Promos &amp; Coupons</span>
              <span className="text-[11px] text-slate-400">{coupons.length} promotional vouchers</span>
            </div>
          </div>
          <span className="text-xl font-black text-slate-900">{coupons.length}</span>
        </div>
      </div>

      {/* Recent Catalog Additions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Catalog Additions</h3>
            <p className="text-xs text-slate-400">Latest products registered in the MongoDB database.</p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <span>View All ({stats.totalProducts})</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Item Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Store</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No products added yet. Click &quot;Manage Catalog&quot; to seed or create products.
                  </td>
                </tr>
              ) : (
                stats.recentProducts.map((p) => {
                  const id = p._id || p.id;
                  let imgUrl =
                    Array.isArray(p.images) && p.images.length > 0
                      ? typeof p.images[0] === 'string'
                        ? p.images[0]
                        : p.images[0].url
                      : p.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80';

                  if (imgUrl && imgUrl.startsWith('/uploads/')) {
                    imgUrl = `http://localhost:8081${imgUrl}`;
                  }

                  return (
                    <tr key={id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={imgUrl}
                            alt={p.title}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-xs">
                              {p.title || p.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {p.sku || id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {p.category?.name || p.categoryName || p.category || 'General'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        {p.store?.name || p.store || 'Atelier Flagship'}
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        ₹{Number(p.basePrice ?? p.price ?? 0).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            (p.stock ?? 0) === 0
                              ? 'text-rose-600'
                              : (p.stock ?? 0) <= 8
                              ? 'text-amber-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {p.stock ?? 0} units
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {p.isActive !== false ? 'Active' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
