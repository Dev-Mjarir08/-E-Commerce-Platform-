import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Eye,
  Search,
  Filter,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import VendorSidebar from "./VendorSlideBar";

const reviews = [
  {
    id: "REV-1001",
    customerName: "John Wick",
    customerAvatar: "https://i.pravatar.cc/100?img=12",
    date: "Sep 20, 2026",
    rating: 5,
    productName: "Premium Leather Wallet",
    title: "Excellent Quality",
    comment:
      "The wallet quality is really good. The leather feels premium and the delivery was fast.",
    status: "Replied",
  },
  {
    id: "REV-1002",
    customerName: "Sarah Johnson",
    customerAvatar: "https://i.pravatar.cc/100?img=32",
    date: "Sep 19, 2026",
    rating: 4,
    productName: "Classic Wrist Watch",
    title: "Good Product",
    comment:
      "The watch looks great and works perfectly. Packaging could be improved.",
    status: "Pending",
  },
  {
    id: "REV-1003",
    customerName: "Ahmed Khan",
    customerAvatar: "https://i.pravatar.cc/100?img=11",
    date: "Sep 18, 2026",
    rating: 5,
    productName: "Men's Casual Shoes",
    title: "Very Comfortable",
    comment:
      "Very comfortable shoes. I used them for a full day and had no problems.",
    status: "Replied",
  },
  {
    id: "REV-1004",
    customerName: "Michael Smith",
    customerAvatar: "https://i.pravatar.cc/100?img=15",
    date: "Sep 17, 2026",
    rating: 3,
    productName: "Cotton T-Shirt",
    title: "Average Product",
    comment:
      "The material is okay but the fitting was slightly different from the description.",
    status: "Pending",
  },
];

export default function Reviews() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}


      {/* =====================================================
          DESKTOP SIDEBAR
          Fixed - DOES NOT SCROLL WITH CONTENT
      ====================================================== */}
      <aside className="fixed left-0 top-0 z-50 hidden md:block w-64 h-screen bg-white border-r border-slate-200">

        <div className="h-full w-full ">
          <VendorSidebar />
        </div>

      </aside>


      {/* =====================================================
          MOBILE SIDEBAR
          Fixed Drawer
      ====================================================== */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Mobile Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">

          <span className="font-semibold text-slate-800">
            Vendor Menu
          </span>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>

        </div>


        {/* Mobile Sidebar Content */}
        <div className="h-[calc(100vh-64px)] ">
          <VendorSidebar />
        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
      ====================================================== */}
      <div className="min-h-screen md:ml-64">

        {/* ===================================================
            MOBILE HEADER
        ==================================================== */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200">

          <div className="h-16 px-4 flex items-center gap-3">

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h2 className="font-bold text-slate-800 truncate">
                Vendor Dashboard
              </h2>
            </div>

          </div>

        </header>


        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}
        <main className="p-4 sm:p-6 lg:p-8">

          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                Customer Reviews
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage and respond to customer reviews.
              </p>
            </div>

          </div>


          {/* =================================================
              SEARCH & FILTER
          ================================================== */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">

            <div className="flex flex-col sm:flex-row gap-3">

              {/* SEARCH */}
              <div className="relative flex-1">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search reviews..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />

              </div>


              {/* FILTER */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                <Filter size={16} />
                Filter
              </button>

            </div>

          </div>


          {/* =================================================
              REVIEWS CONTAINER
          ================================================== */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

            {/* =================================================
                DESKTOP TABLE
            ================================================== */}
            <div className="hidden md:block overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                      Customer
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                      Product
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                      Rating
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                      Status
                    </th>

                    <th className="text-right px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {reviews.map((review) => (

                    <tr
                      key={review.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >

                      {/* CUSTOMER */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <img
                            src={review.customerAvatar}
                            alt={review.customerName}
                            className="w-9 h-9 rounded-full object-cover"
                          />

                          <div>

                            <p className="font-semibold text-sm text-slate-800">
                              {review.customerName}
                            </p>

                            <p className="text-xs text-slate-400">
                              {review.date}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* PRODUCT */}
                      <td className="px-5 py-4">

                        <p className="text-sm font-medium text-slate-700">
                          {review.productName}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {review.title}
                        </p>

                      </td>


                      {/* RATING */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1">

                          {[...Array(5)].map((_, i) => (

                            <Star
                              key={i}
                              size={14}
                              fill={
                                i < review.rating
                                  ? "currentColor"
                                  : "none"
                              }
                              className={
                                i < review.rating
                                  ? "text-amber-400"
                                  : "text-slate-200"
                              }
                            />

                          ))}

                        </div>

                      </td>


                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            review.status === "Replied"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {review.status}
                        </span>

                      </td>


                      {/* ACTION */}
                      <td className="px-5 py-4 text-right">

                        <Link
                          to={`/pages/vendor/review-details/${review.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          <Eye size={14} />
                          View Details
                        </Link>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            {/* =================================================
                MOBILE CARDS
            ================================================== */}
            <div className="md:hidden divide-y divide-slate-100">

              {reviews.map((review) => (

                <div
                  key={review.id}
                  className="p-4"
                >

                  {/* CUSTOMER */}
                  <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">

                      <img
                        src={review.customerAvatar}
                        alt={review.customerName}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />

                      <div className="min-w-0">

                        <p className="font-semibold text-sm text-slate-800 truncate">
                          {review.customerName}
                        </p>

                        <p className="text-xs text-slate-400">
                          {review.date}
                        </p>

                      </div>

                    </div>


                    {/* STATUS */}
                    <span
                      className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold ${
                        review.status === "Replied"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {review.status}
                    </span>

                  </div>


                  {/* PRODUCT */}
                  <div className="mt-4">

                    <p className="text-xs text-slate-400">
                      Product
                    </p>

                    <p className="font-semibold text-sm text-slate-700">
                      {review.productName}
                    </p>

                  </div>


                  {/* RATING */}
                  <div className="flex items-center gap-1 mt-3">

                    {[...Array(5)].map((_, i) => (

                      <Star
                        key={i}
                        size={14}
                        fill={
                          i < review.rating
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          i < review.rating
                            ? "text-amber-400"
                            : "text-slate-200"
                        }
                      />

                    ))}

                    <span className="text-xs text-slate-400 ml-1">
                      {review.rating}/5
                    </span>

                  </div>


                  {/* COMMENT */}
                  <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                    {review.comment}
                  </p>


                  {/* BUTTON */}
                  <Link
                    to={`/pages/vendor/review-details/${review.id}`}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                  >
                    <MessageSquare size={14} />
                    View Review Details
                  </Link>

                </div>

              ))}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}