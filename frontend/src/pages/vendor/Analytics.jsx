import React, { useState, useEffect } from "react";
import vendorApi from "../../services/vendorApi";
import {
  FaChartLine,
  FaDollarSign,
  FaShoppingBag,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaCrown,
  FaExchangeAlt,
} from "react-icons/fa";

// Sample Analytics Data
const topProducts = [
  { id: 1, name: "Wireless Noise-Canceling Headphones", sales: 142, revenue: 21298.58, growth: "+12.4%" },
  { id: 2, name: "Ergonomic Leather Office Chair", sales: 89, revenue: 25721.00, growth: "+8.1%" },
  { id: 3, name: "Stainless Steel Water Bottle (1L)", sales: 310, revenue: 7746.90, growth: "+18.6%" },
  { id: 4, name: "Smart Fitness Watch V2", sales: 64, revenue: 6368.00, growth: "-3.2%" },
];

const trafficSources = [
  { name: "Direct Search / Marketplace", percentage: 58, color: "bg-teal-700" },
  { name: "Social Media Campaign", percentage: 24, color: "bg-emerald-500" },
  { name: "Email Marketing", percentage: 12, color: "bg-amber-500" },
  { name: "Referral Links", percentage: 6, color: "bg-purple-500" },
];

export default function VendorAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [stats, setStats] = useState({
    grossRevenue: 61134.48,
    totalOrders: 605,
    conversionRate: 3.42,
    storeVisits: 17690,
  });

  useEffect(() => {
    vendorApi.getAnalyticsOverview().then((res) => {
      const data = res?.data?.overview || res?.overview || res?.data;
      if (data) {
        setStats({
          grossRevenue: data.totalSales || data.revenue || 61134.48,
          totalOrders: data.totalOrders || data.orders || 605,
          conversionRate: data.conversionRate || 3.42,
          storeVisits: data.totalVisits || data.visits || 17690,
        });
      }
    }).catch((err) => console.warn('Analytics fetch fallback:', err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Store Analytics & Reports
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Monitor key performance metrics, conversion funnels, and revenue trends.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm self-start sm:self-auto">
            <FaCalendarAlt className="text-slate-400 ml-2 text-sm" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 pr-2 focus:outline-none cursor-pointer"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">This Year</option>
            </select>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Revenue</span>
              <div className="p-2.5 bg-teal-50 text-teal-800 rounded-xl">
                <FaDollarSign className="text-base" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">${stats.grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
                <FaArrowUp className="text-[10px]" /> +14.2% <span className="text-slate-400 font-normal">vs last period</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</span>
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                <FaShoppingBag className="text-base" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{stats.totalOrders}</h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
                <FaArrowUp className="text-[10px]" /> +8.7% <span className="text-slate-400 font-normal">vs last period</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversion Rate</span>
              <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
                <FaExchangeAlt className="text-base" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{stats.conversionRate}%</h3>
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-1">
                <FaArrowDown className="text-[10px]" /> -0.5% <span className="text-slate-400 font-normal">vs last period</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Store Visits</span>
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                <FaUsers className="text-base" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{stats.storeVisits.toLocaleString()}</h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
                <FaArrowUp className="text-[10px]" /> +22.1% <span className="text-slate-400 font-normal">vs last period</span>
              </div>
            </div>
          </div>

        </div>

        {/* VISUAL CHART SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Trend Area Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FaChartLine className="text-teal-700" /> Revenue Growth Trend
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Estimated gross revenue progression over time.</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                +14.2% Growth
              </span>
            </div>

            {/* SVG Visual Chart Illustration */}
            <div className="h-60 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Background Grid Lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />

                {/* Fill Area under Curve */}
                <path
                  d="M0,130 Q70,90 140,110 T280,50 T420,70 T500,20 L500,150 L0,150 Z"
                  fill="url(#chartGradient)"
                />

                {/* Main Trend Line */}
                <path
                  d="M0,130 Q70,90 140,110 T280,50 T420,70 T500,20"
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* High Value Points */}
                <circle cx="280" cy="50" r="4" className="fill-teal-800 stroke-white stroke-2" />
                <circle cx="500" cy="20" r="4" className="fill-teal-800 stroke-white stroke-2" />
              </svg>
            </div>

            <div className="flex justify-between text-xs text-slate-400 font-mono border-t border-slate-100 pt-3">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>

          {/* Traffic Channels Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Traffic Sources</h3>
              <p className="text-xs text-slate-400 mt-0.5">Customer referral origins.</p>
            </div>

            <div className="space-y-4">
              {trafficSources.map((source, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{source.name}</span>
                    <span className="font-mono text-slate-900">{source.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${source.color}`}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
              <strong>Optimization Tip:</strong> Direct search generates 58% of conversions. Optimize product keywords to boost organic discoverability.
            </div>
          </div>

        </div>

        {/* TOP PERFORMING PRODUCTS TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FaCrown className="text-amber-500" /> Best Selling Products
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Top products driving sales volume in this period.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Rank & Product</th>
                  <th className="py-3.5 px-5">Units Sold</th>
                  <th className="py-3.5 px-5">Gross Earnings</th>
                  <th className="py-3.5 px-5 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {topProducts.map((prod, index) => (
                  <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                          #{index + 1}
                        </span>
                        <span className="font-semibold text-slate-900">{prod.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 font-semibold text-slate-800">
                      {prod.sales} units
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-900">
                      ${prod.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-5 text-right font-mono font-semibold text-xs">
                      <span className={prod.growth.startsWith("+") ? "text-emerald-600" : "text-rose-600"}>
                        {prod.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}