import React from 'react';
import { useSelector } from 'react-redux';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

const Dashboard = () => {
  // Real dynamic products from Redux store (persisted in localStorage)
  const products = useSelector((state) => state.products.items);

  // Real metrics calculated from actual store products
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => (p.stockCount ?? 0) > 8);
  const lowStockProducts = products.filter((p) => (p.stockCount ?? 0) > 0 && (p.stockCount ?? 0) <= 8);

  // Total inventory valuation calculated strictly from real product price and stock
  const totalInventoryValue = products.reduce((acc, p) => {
    const stock = Number(p.stockCount) || 0;
    const price = Number(p.price) || 0;
    return acc + (price * stock);
  }, 0);

  // Real distinct categories derived from actual products
  const uniqueCategories = Array.from(
    new Set(products.map((p) => p.categoryName || p.category).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Admin Overview</h2>
        <p className="text-xs text-slate-500 mt-1">
          Real-time catalog analytics and inventory status for your store.
        </p>
      </div>

      {/* Real Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Products</span>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold">
              <Package size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{totalProducts}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
              Active Catalog
            </span>
            <span className="text-slate-500">{totalProducts === 1 ? '1 item' : `${totalProducts} items`}</span>
          </div>
        </div>

        {/* In Stock */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">In Stock</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{inStockProducts.length}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Healthy
            </span>
            <span className="text-slate-500">&gt; 8 units</span>
          </div>
        </div>

        {/* Low Stock Attention */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Low Stock Attention</span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{lowStockProducts.length}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Needs Restock
            </span>
            <span className="text-slate-500">&le; 8 units</span>
          </div>
        </div>

        {/* Total Inventory Valuation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inventory Valuation</span>
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">
              ₹{totalInventoryValue.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
              {uniqueCategories.length} Categories
            </span>
            <span className="text-slate-500">in catalog</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
