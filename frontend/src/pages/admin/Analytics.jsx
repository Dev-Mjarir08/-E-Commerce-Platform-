import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, ShoppingBag } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Marketplace Analytics</h2>
        <p className="text-xs text-slate-500 mt-1">Platform gross merchandise volume, average order values, and tenant sales velocity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Order Value</span>
          <p className="text-2xl font-black text-slate-900 mt-2">₹44,200</p>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-2 inline-block">
            +12.4% vs benchmark
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cart Conversion Rate</span>
          <p className="text-2xl font-black text-slate-900 mt-2">3.82%</p>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-2 inline-block">
            Top tier luxury index
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Repeat Customer Rate</span>
          <p className="text-2xl font-black text-slate-900 mt-2">41.6%</p>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 mt-2 inline-block">
            High retention
          </span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
