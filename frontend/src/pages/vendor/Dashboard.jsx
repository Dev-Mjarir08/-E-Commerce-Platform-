
import React, { useState } from "react";




import {
    Star,
    Bell,
    ChevronDown,
    TrendingUp,
    ArrowUpRight,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    ShoppingCart,
    Boxes,
} from "lucide-react";

import VendorSidebar from "./VendorSlideBar";

export default function VendorDashboard() {
    const stats = [
        {
            title: "TOTAL SALES",
            value: "$14,567.89",
            change: "+12.3%",
            subtext: "vs last month",
            icon: DollarSign,
            iconColor: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            title: "NEW ORDERS",
            value: "89",
            change: "+5.1%",
            subtext: "vs last week",
            icon: ShoppingCart,
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "AVERAGE ORDER VALUE",
            value: "$163.68",
            change: "+3.9%",
            subtext: "vs last month",
            icon: TrendingUp,
            iconColor: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "ACTIVE PRODUCTS",
            value: "156",
            change: "2 pending review",
            subtext: "",
            icon: Boxes,
            iconColor: "text-amber-600",
            bgColor: "bg-amber-50",
        },
    ];

    const topProducts = [
        {
            name: "Eco-friendly Bamboo Watch",
            units: 45,
            progress: "w-3/4",
            color: "bg-emerald-600",
        },
        {
            name: "Craft Resin Watch",
            units: 32,
            progress: "w-3/5",
            color: "bg-teal-600",
        },
        {
            name: "Wooden Desk Organizer",
            units: 22,
            progress: "w-2/5",
            color: "bg-emerald-500",
        },
        {
            name: "Plant Polisher Spray",
            units: 12,
            progress: "w-1/4",
            color: "bg-green-400",
        },
        {
            name: "Handmade Leather Wallet",
            units: 8,
            progress: "w-1/6",
            color: "bg-emerald-300",
        },
    ];

    const recentOrders = [
        {
            id: "#8901",
            customer: "M. Smith",
            status: "Delivered",
            statusBg: "bg-emerald-100 text-emerald-700",
            total: "$163.68",
            date: "Apr 13, 2026",
        },
        {
            id: "#8902",
            customer: "M. Smith",
            status: "Processing",
            statusBg: "bg-blue-100 text-blue-700",
            total: "$12.00",
            date: "Apr 12, 2026",
        },
        {
            id: "#8903",
            customer: "J. Smith",
            status: "Shipped",
            statusBg: "bg-amber-100 text-amber-700",
            total: "$12.90",
            date: "Apr 13, 2026",
        },
        {
            id: "#8904",
            customer: "H. Karen",
            status: "Delivered",
            statusBg: "bg-emerald-100 text-emerald-700",
            total: "$19.00",
            date: "Apr 10, 2026",
        },
    ];


    return (
        <div className="flex h-screen w-full min-w-0 overflow-hidden bg-slate-100 text-slate-800 font-sans">

            {/* ========= vendor slidebar====== */}

            <VendorSidebar />


            {/* ================= MAIN CONTENT ================= */}
            <div
                className="
          flex-1
          min-w-0
          flex
          flex-col
          overflow-y-auto
          overflow-x-hidden
        "
            >

                {/* ================= HEADER ================= */}
                <header
                    className="
            bg-white
            border-b
            border-slate-200
            px-4
            sm:px-6
            lg:px-8
            py-3
            sm:py-4
            flex
            items-center
            justify-between
            gap-2
            sticky
            top-0
            z-10
            min-w-0
          "
                >
                    {/* Page title */}
                    <h1
                        className="
              ml-12
              md:ml-2
              min-w-0
              truncate
              text-sm
              sm:text-xl
              md:text-2xl
              lg:text-3xl
              font-bold
              text-slate-800
            "
                    >
                        Dashboard Overview
                    </h1>

                    {/* Header Right */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">

                        {/* Notification */}
                        <button
                            className="
                p-2
                text-slate-500
                hover:bg-slate-100
                rounded-full
                transition-colors
                relative
              "
                            aria-label="Notifications"
                        >
                            <Bell size={20} />

                            <span
                                className="
                  absolute
                  top-1.5
                  right-1.5
                  w-2
                  h-2
                  bg-emerald-500
                  rounded-full
                "
                            />
                        </button>

                        {/* Profile */}
                        <div
                            className="
                flex
                items-center
                gap-2
                sm:gap-3
                pl-2
                border-l
                border-slate-200
              "
                        >
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                                alt="Profile Avatar"
                                className="
                  w-8
                  h-8
                  sm:w-9
                  sm:h-9
                  rounded-full
                  object-cover
                "
                            />

                            <ChevronDown
                                size={16}
                                className="text-slate-500"
                            />
                        </div>
                    </div>
                </header>

                {/* ================= DASHBOARD CONTENT ================= */}
                <main
                    className="
            w-full
            min-w-0
            p-4
            sm:p-6
            lg:p-8
            space-y-6
          "
                >

                    {/* ================= TOP METRICS ================= */}
                    <div
                        className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-4
              gap-4
              sm:gap-5
              min-w-0
            "
                    >
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={idx}
                                    className="
                    min-w-0
                    bg-white
                    p-4
                    sm:p-5
                    rounded-xl
                    border
                    border-slate-200
                    shadow-sm
                    flex
                    flex-col
                    justify-between
                  "
                                >
                                    <div className="flex items-center justify-between gap-2 min-w-0">

                                        <span
                                            className="
                        min-w-0
                        truncate
                        text-[11px]
                        sm:text-xs
                        font-semibold
                        text-slate-400
                        uppercase
                        tracking-wider
                      "
                                        >
                                            {stat.title}
                                        </span>

                                        <div
                                            className={`
                        shrink-0
                        p-2
                        rounded-lg
                        ${stat.bgColor}
                      `}
                                        >
                                            <Icon
                                                className={`
                          w-5
                          h-5
                          ${stat.iconColor}
                        `}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 min-w-0">

                                        <div
                                            className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        text-slate-900
                        truncate
                      "
                                        >
                                            {stat.value}
                                        </div>

                                        <div
                                            className="
                        flex
                        flex-wrap
                        items-center
                        gap-1
                        mt-1
                        text-xs
                      "
                                        >
                                            {stat.change.includes("+") ? (
                                                <span
                                                    className="
                            text-emerald-600
                            font-semibold
                            flex
                            items-center
                          "
                                                >
                                                    <ArrowUpRight size={14} />
                                                    {stat.change}
                                                </span>
                                            ) : (
                                                <span className="text-slate-500 font-medium">
                                                    {stat.change}
                                                </span>
                                            )}

                                            <span className="text-slate-400">
                                                {stat.subtext}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ================= MIDDLE SECTION ================= */}
                    <div
                        className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-4
              sm:gap-6
              min-w-0
            "
                    >

                        {/* ================= SALES TREND ================= */}
                        <div
                            className="
                min-w-0
                lg:col-span-2
                bg-white
                p-4
                sm:p-6
                rounded-xl
                border
                border-slate-200
                shadow-sm
              "
                        >
                            <div
                                className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-3
                  mb-6
                "
                            >
                                <div className="min-w-0">
                                    <h3 className="text-base font-semibold text-slate-800">
                                        Sales Trend
                                    </h3>

                                    <p className="text-xs text-slate-500 truncate">
                                        Gross revenue performance this month
                                    </p>
                                </div>

                                <select
                                    className="
                    shrink-0
                    border
                    border-slate-200
                    rounded-lg
                    px-3
                    py-1.5
                    text-xs
                    text-slate-600
                    bg-white
                    focus:outline-none
                  "
                                >
                                    <option>This Month</option>
                                    <option>Last Quarter</option>
                                    <option>This Year</option>
                                </select>
                            </div>

                            {/* Chart */}
                            <div
                                className="
                  h-60
                  w-full
                  min-w-0
                  relative
                  flex
                  flex-col
                  justify-between
                  pt-4
                  overflow-hidden
                "
                            >
                                <div className="border-b border-slate-100 text-xs text-slate-400 pb-1">
                                    $400K
                                </div>

                                <div className="border-b border-slate-100 text-xs text-slate-400 pb-1">
                                    $300K
                                </div>

                                <div className="border-b border-slate-100 text-xs text-slate-400 pb-1">
                                    $200K
                                </div>

                                <div className="border-b border-slate-100 text-xs text-slate-400 pb-1">
                                    $100K
                                </div>

                                <div className="border-b border-slate-200 text-xs text-slate-400 pb-1">
                                    0
                                </div>

                                <svg
                                    className="
                    absolute
                    inset-x-0
                    bottom-6
                    w-full
                    h-44
                    overflow-visible
                  "
                                    viewBox="0 0 500 150"
                                    preserveAspectRatio="none"
                                >
                                    <defs>
                                        <linearGradient
                                            id="chartGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#10b981"
                                                stopOpacity="0.25"
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor="#10b981"
                                                stopOpacity="0.0"
                                            />
                                        </linearGradient>
                                    </defs>

                                    <path
                                        d="M 0 120 Q 75 80 150 90 T 300 40 T 450 60 T 500 20"
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="3"
                                    />

                                    <path
                                        d="M 0 120 Q 75 80 150 90 T 300 40 T 450 60 T 500 20 V 150 H 0 Z"
                                        fill="url(#chartGradient)"
                                    />
                                </svg>

                                {/* X Axis */}
                                <div
                                    className="
                    flex
                    justify-between
                    gap-2
                    text-xs
                    text-slate-400
                    pt-2
                    border-t
                    border-slate-100
                  "
                                >
                                    <span>Day 3</span>
                                    <span>Day 8</span>
                                    <span>Day 13</span>
                                    <span>Day 18</span>
                                    <span>Day 23</span>
                                    <span>Day 28</span>
                                </div>
                            </div>
                        </div>

                        {/* ================= TOP PRODUCTS ================= */}
                        <div
                            className="
                min-w-0
                bg-white
                p-4
                sm:p-6
                rounded-xl
                border
                border-slate-200
                shadow-sm
                flex
                flex-col
                justify-between
              "
                        >
                            <div className="min-w-0">

                                <h3 className="text-base font-semibold text-slate-800 mb-1">
                                    Top Selling Products
                                </h3>

                                <p className="text-xs text-slate-500 mb-5">
                                    By units sold this month
                                </p>

                                <div className="space-y-4">
                                    {topProducts.map((prod, idx) => (
                                        <div key={idx} className="min-w-0">

                                            <div
                                                className="
                          flex
                          items-center
                          justify-between
                          gap-2
                          text-xs
                          font-medium
                          text-slate-700
                          mb-1.5
                        "
                                            >
                                                <span
                                                    className="
                            min-w-0
                            truncate
                            max-w-32.5
                            sm:max-w-45
                          "
                                                >
                                                    {prod.name}
                                                </span>

                                                <span className="shrink-0 text-slate-500">
                                                    {prod.units} units
                                                </span>
                                            </div>

                                            <div
                                                className="
                          w-full
                          bg-slate-100
                          h-2
                          rounded-full
                          overflow-hidden
                        "
                                            >
                                                <div
                                                    className={`
                            h-full
                            ${prod.color}
                            ${prod.progress}
                            rounded-full
                          `}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <a
                                href="#"
                                className="
                  mt-4
                  inline-block
                  text-center
                  text-xs
                  font-semibold
                  text-emerald-600
                  hover:text-emerald-700
                "
                            >
                                View Full Product Report →
                            </a>
                        </div>
                    </div>

                    {/* ================= BOTTOM SECTION ================= */}
                    <div
                        className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-4
              sm:gap-6
              min-w-0
            "
                    >

                        {/* ================= STORE HEALTH ================= */}
                        <div
                            className="
                min-w-0
                bg-white
                p-4
                sm:p-6
                rounded-xl
                border
                border-slate-200
                shadow-sm
              "
                        >
                            <h3 className="text-base font-semibold text-slate-800 mb-4">
                                Store Health
                            </h3>

                            <div className="space-y-4">

                                {/* Fulfillment */}
                                <div
                                    className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    p-3
                    bg-slate-50
                    rounded-lg
                  "
                                >
                                    <div className="flex items-center gap-3 min-w-0">

                                        <CheckCircle2
                                            size={20}
                                            className="text-emerald-500 shrink-0"
                                        />

                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-500">
                                                Fulfillment Rate
                                            </p>

                                            <p className="text-sm font-semibold text-slate-800">
                                                98.5%
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-xs text-emerald-600 font-medium shrink-0">
                                        Optimal
                                    </span>
                                </div>

                                {/* Rating */}
                                <div
                                    className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    p-3
                    bg-slate-50
                    rounded-lg
                  "
                                >
                                    <div className="flex items-center gap-3 min-w-0">

                                        <Star
                                            size={20}
                                            className="
                        text-amber-500
                        fill-amber-500
                        shrink-0
                      "
                                        />

                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-500">
                                                Customer Rating
                                            </p>

                                            <p className="text-sm font-semibold text-slate-800">
                                                4.7 / 5.0
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-xs text-slate-500 shrink-0">
                                        128 reviews
                                    </span>
                                </div>

                                {/* Inventory */}
                                <div
                                    className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    p-3
                    bg-slate-50
                    rounded-lg
                  "
                                >
                                    <div className="flex items-center gap-3 min-w-0">

                                        <AlertCircle
                                            size={20}
                                            className="text-rose-500 shrink-0"
                                        />

                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-500">
                                                Inventory Alerts
                                            </p>

                                            <p className="text-sm font-semibold text-slate-800">
                                                5 items low
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        className="
                      text-xs
                      text-rose-600
                      font-medium
                      underline
                      shrink-0
                    "
                                    >
                                        Restock
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ================= RECENT ORDERS ================= */}
                        <div
                            className="
                min-w-0
                lg:col-span-2
                bg-white
                p-4
                sm:p-6
                rounded-xl
                border
                border-slate-200
                shadow-sm
              "
                        >
                            <div
                                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  mb-4
                "
                            >
                                <h3 className="text-base font-semibold text-slate-800">
                                    Recent Orders
                                </h3>

                                <a
                                    href="#"
                                    className="
                    shrink-0
                    text-xs
                    font-semibold
                    text-emerald-600
                    hover:text-emerald-700
                  "
                                >
                                    View All Orders
                                </a>
                            </div>

                            {/* Table Scroll Container */}
                            <div className="w-full overflow-x-auto">

                                <table
                                    className="
                    w-full
                    min-w-130
                    text-left
                    text-xs
                    border-collapse
                  "
                                >
                                    <thead>
                                        <tr
                                            className="
                        border-b
                        border-slate-200
                        text-slate-400
                        font-medium
                      "
                                        >
                                            <th className="pb-3 whitespace-nowrap">
                                                Order ID
                                            </th>

                                            <th className="pb-3 whitespace-nowrap">
                                                Customer
                                            </th>

                                            <th className="pb-3 whitespace-nowrap">
                                                Status
                                            </th>

                                            <th className="pb-3 whitespace-nowrap">
                                                Total
                                            </th>

                                            <th className="pb-3 whitespace-nowrap">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody
                                        className="
                      divide-y
                      divide-slate-100
                      text-slate-700
                    "
                                    >
                                        {recentOrders.map((order, idx) => (
                                            <tr
                                                key={idx}
                                                className="hover:bg-slate-50/60 transition-colors"
                                            >
                                                <td
                                                    className="
                            py-3
                            font-semibold
                            text-slate-800
                            whitespace-nowrap
                          "
                                                >
                                                    {order.id}
                                                </td>

                                                <td className="py-3 whitespace-nowrap">
                                                    {order.customer}
                                                </td>

                                                <td className="py-3 whitespace-nowrap">
                                                    <span
                                                        className={`
                              px-2.5
                              py-0.5
                              rounded-full
                              text-[11px]
                              font-semibold
                              ${order.statusBg}
                            `}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>

                                                <td
                                                    className="
                            py-3
                            font-medium
                            text-slate-800
                            whitespace-nowrap
                          "
                                                >
                                                    {order.total}
                                                </td>

                                                <td
                                                    className="
                            py-3
                            text-slate-500
                            whitespace-nowrap
                          "
                                                >
                                                    {order.date}
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
