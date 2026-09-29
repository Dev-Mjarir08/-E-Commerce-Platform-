import React, { useState } from "react";
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
  FaBars,
  FaTimes,
} from "react-icons/fa";
import VendorSidebar from "./VendorSlideBar";

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50/50">
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR DRAWER CONTAINER */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 h-full bg-slate-900 text-white shrink-0 transform transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full w-full relative">
          {/* Close button for Mobile Drawer */}
          <div className="lg:hidden flex items-center justify-between p-3 border-b border-slate-800">
            <span className="font-bold text-xs text-slate-200">Navigation</span>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg focus:outline-none"
              aria-label="Close Sidebar"
            >
              <FaTimes className="text-base" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <VendorSidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT WRAPPER */}
      <div className="flex-1 flex flex-col h-full w-full min-w-0 overflow-hidden">
        
        {/* MOBILE HEADER BAR */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <FaBars className="text-base" />
            </button>
            <span className="font-bold text-slate-900 text-sm sm:text-base">Store Analytics</span>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Store Analytics & Reports
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Monitor key performance metrics, conversion funnels, and revenue trends.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm self-start sm:self-auto">
                <FaCalendarAlt className="text-slate-400 ml-2 text-sm" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 pr-2 focus:outline-none cursor-pointer"
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
                  <h3 className="text-2xl font-bold text-slate-900">$61,134.48</h3>
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
                  <h3 className="text-2xl font-bold text-slate-900">605</h3>
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
                  <h3 className="text-2xl font-bold text-slate-900">3.42%</h3>
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
                  <h3 className="text-2xl font-bold text-slate-900">17,690</h3>
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

                <div className="h-60 w-full pt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0f766e" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0f766e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />

                    <path
                      d="M0,130 Q70,90 140,110 T280,50 T420,70 T500,20 L500,150 L0,150 Z"
                      fill="url(#chartGradient)"
                    />

                    <path
                      d="M0,130 Q70,90 140,110 T280,50 T420,70 T500,20"
                      fill="none"
                      stroke="#0f766e"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

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
                <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-0">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Rank & Product</th>
                      <th className="py-3.5 px-5">Units Sold</th>
                      <th className="py-3.5 px-5">Gross Earnings</th>
                      <th className="py-3.5 px-5 text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                    {topProducts.map((prod, index) => (
                      <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                              #{index + 1}
                            </span>
                            <span className="font-semibold text-slate-900 truncate">{prod.name}</span>
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
        </main>
      </div>
    </div>
  );
}