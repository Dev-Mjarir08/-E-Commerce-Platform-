import React, { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaDollarSign,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaShippingFast,
  FaBars,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";
import VendorSidebar from "./VendorSlideBar";

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 1. Check state passed via navigate(), or 2. Safely fallback to null if direct access
  const customer = location.state?.customer || null;

  // Fallback UI if no matching customer is found
  if (!customer) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-900">Customer Not Found</h2>
          <p className="text-sm text-slate-500">
            No record matching the ID <span className="font-mono text-slate-800">{id}</span> could be located.
          </p>
          <button
            onClick={() => navigate("/vendor/customers")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-sm font-semibold transition"
          >
            <FaArrowLeft /> Back to Customers
          </button>
        </div>
      </div>
    );
  }

  // Helper for rendering badge dynamic styles
  const getStatusBadge = (status) => {
    switch (status) {
      case "VIP":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "Active":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FaCheckCircle className="text-emerald-500" />;
      case "Shipped":
        return <FaShippingFast className="text-blue-500" />;
      default:
        return <FaClock className="text-amber-500" />;
    }
  };

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
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full w-full">
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <span className="font-semibold text-slate-900">Vendor Menu</span>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <VendorSidebar />
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="shrink-0 p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              <FaBars className="text-lg" />
            </button>
            <span className="font-bold text-slate-900 text-sm sm:text-base truncate">
              Customer Details
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 h-full overflow-y-auto p-3 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Top Navigation & Actions */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-medium shadow-sm transition"
              >
                <FaArrowLeft className="text-xs" />
                Back
              </button>

              <span className="text-xs font-mono text-slate-400">
                ID: {customer.id}
              </span>
            </div>

            {/* Profile Summary Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-4">
                  {/* Initials Avatar */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-800 text-white font-bold text-lg sm:text-xl flex items-center justify-center shadow-md shrink-0">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {customer.name}
                      </h1>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                          customer.status
                        )}`}
                      >
                        {customer.status}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-slate-400" />
                      {customer.location}
                    </p>
                  </div>
                </div>

                {/* Contact Quick Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                    <FaEnvelope className="text-slate-400 text-sm" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                      <a
                        href={`mailto:${customer.email}`}
                        className="text-xs sm:text-sm font-medium text-slate-800 hover:text-teal-700 truncate block"
                      >
                        {customer.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                    <FaPhone className="text-slate-400 text-sm" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Phone</p>
                      <p className="text-xs sm:text-sm font-medium text-slate-800">
                        {customer.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Lifetime Spend
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1">
                    ${customer.totalSpent.toFixed(2)}
                  </h3>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                  <FaDollarSign className="text-xl" />
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Placed Orders
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {customer.totalOrders}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                  <FaShoppingBag className="text-xl" />
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Last Order Date
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {customer.lastOrderDate}
                  </h3>
                </div>
                <div className="p-3 bg-teal-50 text-teal-800 rounded-xl">
                  <FaCalendarAlt className="text-xl" />
                </div>
              </div>
            </div>

            {/* Recent Orders History Table */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-4 py-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Purchase History & Orders
                </h3>
                <span className="text-xs text-slate-400">
                  Showing {customer.orders ? customer.orders.length : 0} recent items
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4 sm:px-6">Order Reference</th>
                      <th className="py-3 px-4 sm:px-6">Date</th>
                      <th className="py-3 px-4 sm:px-6">Status</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                    {customer.orders && customer.orders.length > 0 ? (
                      customer.orders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="py-3 sm:py-4 px-4 sm:px-6 font-mono font-semibold text-teal-800">
                            {order.id}
                          </td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6 text-slate-500">
                            {order.date}
                          </td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6">
                            <span className="inline-flex items-center gap-1.5 font-medium">
                              {getOrderStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6 text-right font-bold text-slate-900">
                            ${order.total.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-8 text-center text-slate-400 text-xs sm:text-sm"
                        >
                          No order history available for this customer.
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