import React, { useState } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaShoppingBag,
  FaDollarSign,
  FaSearch,
  FaFilter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEye,
  FaTimes,
  FaClock,
} from "react-icons/fa";

// Sample Initial Vendor Customers Data
const initialCustomers = [
  {
    id: "CUST-801",
    name: "Aisha Sharma",
    email: "aisha.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    totalOrders: 14,
    totalSpent: 1240.50,
    lastOrderDate: "2026-03-18",
    status: "Active",
    orders: [
      { id: "ORD-9912", date: "2026-03-18", total: 149.99, status: "Delivered" },
      { id: "ORD-8831", date: "2026-02-10", total: 289.00, status: "Delivered" },
      { id: "ORD-7710", date: "2026-01-05", total: 801.51, status: "Delivered" },
    ],
  },
  {
    id: "CUST-802",
    name: "Liam Chen",
    email: "liam.chen@example.com",
    phone: "+1 415 555 0198",
    location: "San Francisco, USA",
    totalOrders: 6,
    totalSpent: 620.00,
    lastOrderDate: "2026-03-12",
    status: "Active",
    orders: [
      { id: "ORD-9844", date: "2026-03-12", total: 310.00, status: "Processing" },
      { id: "ORD-8201", date: "2026-01-22", total: 310.00, status: "Delivered" },
    ],
  },
  {
    id: "CUST-803",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    phone: "+44 20 7946 0912",
    location: "London, UK",
    totalOrders: 1,
    totalSpent: 45.00,
    lastOrderDate: "2025-11-04",
    status: "Inactive",
    orders: [
      { id: "ORD-6102", date: "2025-11-04", total: 45.00, status: "Delivered" },
    ],
  },
  {
    id: "CUST-804",
    name: "Marcus Vance",
    email: "marcus.v@example.com",
    phone: "+1 212 555 0143",
    location: "New York, USA",
    totalOrders: 22,
    totalSpent: 3410.80,
    lastOrderDate: "2026-03-19",
    status: "VIP",
    orders: [
      { id: "ORD-9988", date: "2026-03-19", total: 450.00, status: "Shipped" },
      { id: "ORD-9511", date: "2026-02-28", total: 920.80, status: "Delivered" },
    ],
  },
];

export default function VendorCustomers() {
  const [customers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filter Logic
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || cust.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalCustomers = customers.length;
  const vipCount = customers.filter((c) => c.status === "VIP").length;
  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customers.reduce((acc, c) => acc + c.totalOrders, 0);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Customer Insights
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              View purchasing behavior, order histories, and customer relationships.
            </p>
          </div>
        </div>

        {/* METRICS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Buyers
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalCustomers}</h3>
            </div>
            <div className="p-3 bg-teal-50 text-teal-800 rounded-xl">
              <FaUsers className="text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                VIP Clients
              </p>
              <h3 className="text-2xl font-bold text-purple-700 mt-1">{vipCount}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
              <FaUserCheck className="text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Lifetime Value (LTV)
              </p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <FaDollarSign className="text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Avg. Order Value
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ${avgOrderValue.toFixed(2)}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <FaShoppingBag className="text-xl" />
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <FaFilter /> Tier:
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 transition"
            >
              <option value="All">All Tiers</option>
              <option value="Active">Active</option>
              <option value="VIP">VIP</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* CUSTOMERS TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Customer Profile</th>
                  <th className="py-3.5 px-5">Location</th>
                  <th className="py-3.5 px-5">Orders</th>
                  <th className="py-3.5 px-5">Total Spent</th>
                  <th className="py-3.5 px-5">Last Active</th>
                  <th className="py-3.5 px-5">Segment</th>
                  <th className="py-3.5 px-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-800 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                            {cust.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{cust.name}</p>
                            <span className="text-xs text-slate-400">{cust.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-medium text-slate-600">
                        {cust.location}
                      </td>
                      <td className="py-4 px-5 font-semibold text-slate-800">
                        {cust.totalOrders}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-900">
                        ${cust.totalSpent.toFixed(2)}
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-500 font-mono">
                        {cust.lastOrderDate}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
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
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition"
                        >
                          <FaEye className="text-xs" /> View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-slate-400">
                      No matching customer records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CUSTOMER DETAILS MODAL */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white font-bold flex items-center justify-center text-xl shadow-md">
                    {selectedCustomer.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedCustomer.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">ID: {selectedCustomer.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-slate-400 hover:text-slate-600 p-2 rounded-lg transition"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-600">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-teal-700" />
                  <span className="truncate">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-teal-700" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-teal-700" />
                  <span>{selectedCustomer.location}</span>
                </div>
              </div>

              {/* Purchase Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total Revenue</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">
                    ${selectedCustomer.totalSpent.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total Orders</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">
                    {selectedCustomer.totalOrders}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-white col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Last Purchased</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5 font-mono text-sm">
                    {selectedCustomer.lastOrderDate}
                  </p>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FaClock className="text-slate-400" /> Order Activity
                </h4>
                <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-500 uppercase">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {selectedCustomer.orders.map((ord) => (
                        <tr key={ord.id}>
                          <td className="p-3 font-mono font-semibold text-teal-800">{ord.id}</td>
                          <td className="p-3 font-mono">{ord.date}</td>
                          <td className="p-3 font-bold">${ord.total.toFixed(2)}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                >
                  Close Window
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}