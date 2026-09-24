import React, { useState } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaShoppingBag,
  FaDollarSign,
  FaSearch,
  FaFilter,
  FaEye,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import VendorSidebar from "./VendorSlideBar";

// ==============================
// CUSTOMER DATA
// ==============================

export const customers = [
  {
    id: "CUST-801",
    name: "Aisha Sharma",
    email: "aisha.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    totalOrders: 14,
    totalSpent: 1240.5,
    lastOrderDate: "2026-03-18",
    status: "Active",
    orders: [
      {
        id: "ORD-9912",
        date: "2026-03-18",
        total: 149.99,
        status: "Delivered",
      },
      {
        id: "ORD-8831",
        date: "2026-02-10",
        total: 289.0,
        status: "Delivered",
      },
      {
        id: "ORD-7710",
        date: "2026-01-05",
        total: 801.51,
        status: "Delivered",
      },
    ],
  },
  {
    id: "CUST-802",
    name: "Liam Chen",
    email: "liam.chen@example.com",
    phone: "+1 415 555 0198",
    location: "San Francisco, USA",
    totalOrders: 6,
    totalSpent: 620.0,
    lastOrderDate: "2026-03-12",
    status: "Active",
    orders: [
      {
        id: "ORD-9844",
        date: "2026-03-12",
        total: 310.0,
        status: "Processing",
      },
      {
        id: "ORD-8201",
        date: "2026-01-22",
        total: 310.0,
        status: "Delivered",
      },
    ],
  },
  {
    id: "CUST-803",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    phone: "+44 20 7946 0912",
    location: "London, UK",
    totalOrders: 1,
    totalSpent: 45.0,
    lastOrderDate: "2025-11-04",
    status: "Inactive",
    orders: [
      {
        id: "ORD-6102",
        date: "2025-11-04",
        total: 45.0,
        status: "Delivered",
      },
    ],
  },
  {
    id: "CUST-804",
    name: "Marcus Vance",
    email: "marcus.v@example.com",
    phone: "+1 212 555 0143",
    location: "New York, USA",
    totalOrders: 22,
    totalSpent: 3410.8,
    lastOrderDate: "2026-03-19",
    status: "VIP",
    orders: [
      {
        id: "ORD-9988",
        date: "2026-03-19",
        total: 450.0,
        status: "Shipped",
      },
      {
        id: "ORD-9511",
        date: "2026-02-28",
        total: 920.8,
        status: "Delivered",
      },
    ],
  },
];

// ==============================
// COMPONENT
// ==============================

export default function VendorCustomers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // Filter customers
  const filteredCustomers = customers.filter((cust) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      cust.name.toLowerCase().includes(search) ||
      cust.email.toLowerCase().includes(search) ||
      cust.id.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || cust.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalCustomers = customers.length;

  const vipCount = customers.filter(
    (customer) => customer.status === "VIP"
  ).length;

  const totalRevenue = customers.reduce(
    (total, customer) => total + customer.totalSpent,
    0
  );

  const totalOrdersSum = customers.reduce(
    (total, customer) => total + customer.totalOrders,
    0
  );

  const avgOrderValue =
    totalOrdersSum > 0 ? totalRevenue / totalOrdersSum : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64
          bg-white
          border-r border-slate-200
          transform
          transition-transform
          duration-300
          ease-in-out
          md:static
          md:translate-x-0
          ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex flex-col h-full w-full">
          {/* Mobile Sidebar Header */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <span className="font-semibold text-slate-900">
              Vendor Menu
            </span>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Close Sidebar"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <VendorSidebar />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="shrink-0 p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              aria-label="Open Sidebar"
            >
              <FaBars className="text-lg" />
            </button>

            <span className="font-bold text-slate-900 text-sm sm:text-base truncate">
              Vendor Dashboard
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 h-full overflow-y-auto p-3 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Customer Insights
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  View purchasing behavior, order histories, and customer relationships.
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Total Buyers */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Buyers
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {totalCustomers}
                  </h3>
                </div>

                <div className="p-2.5 sm:p-3 bg-teal-50 text-teal-800 rounded-lg sm:rounded-xl">
                  <FaUsers className="text-lg sm:text-xl" />
                </div>
              </div>

              {/* VIP Clients */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    VIP Clients
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-purple-700 mt-1">
                    {vipCount}
                  </h3>
                </div>

                <div className="p-2.5 sm:p-3 bg-purple-50 text-purple-700 rounded-lg sm:rounded-xl">
                  <FaUserCheck className="text-lg sm:text-xl" />
                </div>
              </div>

              {/* Lifetime Value */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Lifetime Value
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 truncate">
                    $
                    {totalRevenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </h3>
                </div>

                <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-700 rounded-lg sm:rounded-xl shrink-0">
                  <FaDollarSign className="text-lg sm:text-xl" />
                </div>
              </div>

              {/* Average Order Value */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Avg. Order Value
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    ${avgOrderValue.toFixed(2)}
                  </h3>
                </div>

                <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-700 rounded-lg sm:rounded-xl">
                  <FaShoppingBag className="text-lg sm:text-xl" />
                </div>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search name, email, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg sm:rounded-xl border border-slate-200 pl-9 sm:pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition"
                />

                <FaSearch className="absolute left-3 top-2.5 sm:top-3 text-slate-400 text-xs sm:text-sm" />
              </div>

              {/* Filter */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <FaFilter />
                  Tier:
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg sm:rounded-xl border border-slate-200 px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 transition"
                >
                  <option value="All">All Tiers</option>
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Customer Table */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-3 sm:px-5">Customer Profile</th>
                      <th className="py-3 px-3 sm:px-5">Location</th>
                      <th className="py-3 px-3 sm:px-5">Orders</th>
                      <th className="py-3 px-3 sm:px-5">Total Spent</th>
                      <th className="py-3 px-3 sm:px-5 hidden md:table-cell">Last Active</th>
                      <th className="py-3 px-3 sm:px-5">Segment</th>
                      <th className="py-3 px-3 sm:px-5 text-right">Details</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((cust) => (
                        <tr
                          key={cust.id}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          {/* Customer */}
                          <td className="py-3 sm:py-4 px-3 sm:px-5">
                            <div className="flex items-center gap-2.5 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-800 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm shrink-0">
                                {cust.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate">
                                  {cust.name}
                                </p>

                                <span className="text-[10px] sm:text-xs text-slate-400 block truncate">
                                  {cust.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-3 sm:py-4 px-3 sm:px-5 font-medium text-slate-600">
                            {cust.location}
                          </td>

                          {/* Orders */}
                          <td className="py-3 sm:py-4 px-3 sm:px-5 font-semibold text-slate-800">
                            {cust.totalOrders}
                          </td>

                          {/* Total Spent */}
                          <td className="py-3 sm:py-4 px-3 sm:px-5 font-bold text-slate-900">
                            ${cust.totalSpent.toFixed(2)}
                          </td>

                          {/* Last Active */}
                          <td className="py-3 sm:py-4 px-3 sm:px-5 text-[11px] sm:text-xs text-slate-500 font-mono hidden md:table-cell">
                            {cust.lastOrderDate}
                          </td>

                          {/* Segment */}
                          <td className="py-3 sm:py-4 px-3 sm:px-5">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border ${
                                cust.status === "VIP"
                                  ? "bg-purple-50 text-purple-800 border-purple-200"
                                  : cust.status === "Active"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {cust.status}
                            </span>
                          </td>

                          {/* Details Button */}
                          <td className="py-3 sm:py-4 px-3 sm:px-5 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/pages/vendor/customer-details/${cust.id}`, {
                                  state: { customer: cust },
                                })
                              }
                              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition cursor-pointer"
                            >
                              <FaEye className="text-[10px] sm:text-xs" />
                              <span className="hidden sm:inline">
                                View Details
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-10 text-center text-slate-400 text-xs sm:text-sm"
                        >
                          No matching customer records found.
                        </td>
                      </tr>
                    )}
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