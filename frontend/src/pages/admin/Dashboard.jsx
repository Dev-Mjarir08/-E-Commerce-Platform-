import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Plus,
  Users,
  UserCheck,
  ShoppingBag,
  Eye
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import { updateProduct as updateProductRedux } from '../../redux/slices/productSlice';

const Dashboard = () => {
  const navigate = useNavigate();
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
    totalCustomers: 0,
    activeCustomers: 0,
    totalOrders: 0,
    totalOrderRevenue: 0,
    totalInventoryValue: 0,
    recentProducts: [],
    recentCustomers: []
  });

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const statsRes = await adminApi.getDashboardStats();
      const statsData = statsRes?.data || statsRes;

      if (statsData) {
        setStats({
          totalProducts: statsData.totalProducts ?? 0,
          inStockCount: statsData.inStockCount ?? 0,
          lowStockCount: statsData.lowStockCount ?? 0,
          outOfStockCount: statsData.outOfStockCount ?? 0,
          totalStores: statsData.totalStores ?? stores.length,
          totalCategories: statsData.totalCategories ?? 0,
          totalCustomers: statsData.totalCustomers ?? 0,
          activeCustomers: statsData.activeCustomers ?? 0,
          totalOrders: statsData.totalOrders ?? 0,
          totalOrderRevenue: statsData.totalOrderRevenue ?? 0,
          totalInventoryValue: statsData.totalInventoryValue ?? 0,
          recentProducts: Array.isArray(statsData.recentProducts) ? statsData.recentProducts : [],
          recentCustomers: Array.isArray(statsData.recentCustomers) ? statsData.recentCustomers : []
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

      setStats((prev) => ({
        ...prev,
        totalProducts: total,
        inStockCount: inStock,
        lowStockCount: lowStock,
        outOfStockCount: reduxProducts.filter((p) => (Number(p.stock ?? p.stockCount) || 0) === 0).length,
        totalStores: stores.length,
        totalInventoryValue: totalVal,
        recentProducts: reduxProducts.slice(0, 6)
      }));
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
              Live MongoDB Connected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time customer registration monitoring, catalog analytics, and live store metrics.
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
            to="/admin/customers"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Users size={14} />
            <span>View Customers ({stats.totalCustomers})</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards (Customers, Products, Valuation, Orders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Live Registered Customers */}
        <Link
          to="/admin/customers"
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Clients</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalCustomers}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
              <UserCheck size={12} />
              {stats.activeCustomers} Active
            </span>
          </div>
          <p className="text-[11px] text-indigo-600 font-medium mt-2 flex items-center gap-1 group-hover:underline">
            <span>Manage customer database</span>
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </p>
        </Link>

        {/* Card 2: Total Products */}
        <Link
          to="/admin/products"
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Products</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
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
          <p className="text-[11px] text-slate-400 mt-2">Live luxury inventory items in MongoDB</p>
        </Link>

        {/* Card 3: Inventory Valuation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inventory Valuation</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700 tracking-tight font-mono">
              ₹{stats.totalInventoryValue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Stock Assets
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Sum of (basePrice &times; stock)</p>
        </div>

        {/* Card 4: Orders & Platform Revenue */}
        <Link
          to="/admin/orders"
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Orders &amp; Volume</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalOrders}
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 font-mono">
              ₹{stats.totalOrderRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-indigo-600 font-medium mt-2 flex items-center gap-1 group-hover:underline">
            <span>Inspect client orders</span>
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </p>
        </Link>
      </div>

      {/* Secondary Stock & Boutique Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Healthy Stock</span>
              <span className="text-[11px] text-slate-400">&gt; 8 units available</span>
            </div>
          </div>
          <span className="text-lg font-black text-emerald-700">{stats.inStockCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Low / Out Stock</span>
              <span className="text-[11px] text-slate-400">{stats.outOfStockCount} zero units</span>
            </div>
          </div>
          <span className="text-lg font-black text-amber-600">{stats.lowStockCount + stats.outOfStockCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Store size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Boutique Stores</span>
              <span className="text-[11px] text-slate-400">Independent vendors</span>
            </div>
          </div>
          <span className="text-lg font-black text-slate-900">{stats.totalStores}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Categories</span>
              <span className="text-[11px] text-slate-400">Marketplace departments</span>
            </div>
          </div>
          <span className="text-lg font-black text-slate-900">{stats.totalCategories}</span>
        </div>
      </div>

      {/* Split Section: Recent Registered Clients (Left) & Recent Catalog Pieces (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Registered Clients Showcase (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Users size={17} className="text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recently Registered Clients</h3>
                <p className="text-[11px] text-slate-400">Real-time accounts registered on the platform</p>
              </div>
            </div>

            <Link
              to="/admin/customers"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>View All ({stats.totalCustomers})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-4 flex-1 divide-y divide-slate-100">
            {stats.recentCustomers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600">No Customers Registered Yet</p>
                <p className="text-[11px] text-slate-400 mt-1">When users create accounts, they will appear here in real-time.</p>
              </div>
            ) : (
              stats.recentCustomers.map((cust) => {
                const id = cust._id || cust.id;
                return (
                  <div
                    key={id}
                    onClick={() => navigate(`/admin/customers/${id}`)}
                    className="py-3 px-2 flex items-center justify-between hover:bg-slate-50/80 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cust.avatar?.url || 'https://placehold.co/150'}
                        alt={cust.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-slate-100 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900 hover:text-indigo-600 transition-colors">
                          {cust.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[170px] sm:max-w-[220px]">
                          {cust.email}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          cust.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {cust.status || 'active'}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(cust.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              to="/admin/customers"
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center justify-center gap-1"
            >
              <span>Manage all {stats.totalCustomers} customer profiles</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right Column: Recent Catalog Additions (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Catalog Additions</h3>
              <p className="text-[11px] text-slate-400">Latest products registered in the MongoDB database</p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>View All ({stats.totalProducts})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Item Details</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
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
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={imgUrl}
                              alt={p.title}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block truncate max-w-[150px] sm:max-w-[200px]">
                                {p.title || p.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {p.sku || id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {p.category?.name || p.categoryName || p.category || 'General'}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900 font-mono">
                          ₹{Number(p.basePrice ?? p.price ?? 0).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-semibold ${
                              (p.stock ?? 0) === 0
                                ? 'text-rose-600'
                                : (p.stock ?? 0) <= 8
                                ? 'text-amber-600'
                                : 'text-slate-700'
                            }`}
                          >
                            {p.stock ?? 0}
                          </span>
                        </td>
                        <td className="p-3.5">
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
    </div>
  );
};

export default Dashboard;
