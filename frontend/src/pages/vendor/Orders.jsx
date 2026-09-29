import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Star,
    BarChart3,
    Settings,
    Search,
    Download,
    Eye,
    Truck,
    MessageSquare,
    Bell,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
} from "lucide-react";
import VendorSidebar from "./VendorSlideBar";

export default function VendorOrdersPage() {
    const [activeTab, setActiveTab] = useState("All");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const orders = [
        {
            id: "#10042",
            date: "Sept 15, 2026",
            customer: "John Wick",
            items: "2 items",
            total: "$125.00",
            status: "Shipped",
            statusBg: "bg-blue-100 text-blue-700",
            actions: ["view"],
        },
        {
            id: "#10041",
            date: "Sept 15, 2026",
            customer: "Sarah J.",
            items: "1 item",
            total: "$89.00",
            status: "Delivered",
            statusBg: "bg-emerald-100 text-emerald-700",
            actions: ["view", "ship"],
        },
        {
            id: "#10040",
            date: "Sept 14, 2026",
            customer: "Mike R.",
            items: "1 item",
            total: "$45.00",
            status: "Pending",
            statusBg: "bg-amber-100 text-amber-700",
            actions: ["view", "message"],
        },
        {
            id: "#10039",
            date: "Sept 13, 2026",
            customer: "Liam N.",
            items: "2 items",
            total: "$190.00",
            status: "Canceled",
            statusBg: "bg-rose-100 text-rose-700",
            actions: ["view", "message"],
        },
    ];

    // STATUS + SEARCH FILTER
    const filteredOrders = orders.filter((order) => {
        const matchesStatus =
            activeTab === "All" || order.status === activeTab;

        const search = searchTerm.toLowerCase();

        const matchesSearch =
            order.id.toLowerCase().includes(search) ||
            order.customer.toLowerCase().includes(search);

        return matchesStatus && matchesSearch;
    });

    return (
        <div className="flex h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">

            {/* ================= vendor slidebar ================= */}
            <VendorSidebar />


            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 flex flex-col overflow-y-auto min-w-0">

                {/* ================= HEADER ================= */}
                <header
                    className="bg-white border-b border-slate-200
                    px-4 sm:px-6 md:px-8 py-3
                    flex items-center justify-between
                    sticky top-0 z-30"
                >

                    {/* BREADCRUMB */}
                    <div className="text-xs text-slate-400 truncate ml-12 md:ml-0">
                        craftsman.com / Vendor Portal /
                        <span className="text-slate-600 font-medium">
                            {" "}Orders
                        </span>
                    </div>

                    {/* RIGHT HEADER */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* NOTIFICATION */}
                        <button
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
                            aria-label="Notifications"
                        >
                            <Bell size={20} />

                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
                        </button>

                        {/* PROFILE */}
                        <div className="flex items-center gap-2 cursor-pointer pl-1 sm:pl-2">

                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full object-cover"
                            />

                            <ChevronDown
                                size={16}
                                className="text-slate-500 hidden sm:block"
                            />
                        </div>
                    </div>
                </header>

                {/* ================= BODY ================= */}
                <main className="p-4 sm:p-6 md:p-8 space-y-6">

                    {/* TITLE + EXPORT */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                Orders
                            </h1>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-slate-600">

                                <span>
                                    Last 30 Days:
                                    {" "}
                                    <strong className="text-slate-800">
                                        48 Orders
                                    </strong>
                                </span>

                                <span className="text-slate-300 hidden sm:block">
                                    |
                                </span>

                                <span>
                                    Total Revenue:
                                    {" "}
                                    <strong className="text-slate-800">
                                        $18,450.00
                                    </strong>
                                </span>
                            </div>
                        </div>

                        {/* EXPORT BUTTON */}
                        <button
                            className="inline-flex items-center justify-center gap-2
                            bg-emerald-700 hover:bg-emerald-800
                            text-white text-sm font-medium
                            px-4 py-2.5 rounded-lg shadow-sm
                            transition-colors w-full md:w-auto"
                        >
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>

                    {/* ================= ORDERS CARD ================= */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                        {/* ================= FILTER TOOLBAR ================= */}
                        <div className="p-4 border-b border-slate-200 space-y-4">

                            {/* SEARCH */}
                            <div className="relative w-full">

                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={18}
                                />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    placeholder="Search by order ID, customer name..."
                                    className="w-full pl-10 pr-4 py-2
                                    border border-slate-200 rounded-lg
                                    text-slate-800 text-sm
                                    bg-slate-50
                                    placeholder:text-slate-400
                                    focus:bg-white
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-emerald-500/20
                                    focus:border-emerald-500
                                    transition-all"
                                />
                            </div>

                            {/* FILTERS */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">

                                {/* STATUS */}
                                <div className="flex items-center bg-slate-100 p-1 rounded-lg text-sm overflow-x-auto">

                                    <span className="px-3 py-1 text-slate-500 font-medium whitespace-nowrap">
                                        Status
                                    </span>

                                    {[
                                        "All",
                                        "Pending",
                                        "Shipped",
                                        "Delivered",
                                        "Canceled",
                                    ].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setActiveTab(status)}
                                            className={`
                                                px-3 py-1 rounded-md
                                                text-xs font-medium
                                                transition-all whitespace-nowrap
                                                ${activeTab === status
                                                    ? "bg-white text-slate-800 shadow-sm"
                                                    : "text-slate-600 hover:text-slate-900"
                                                }
                                            `}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>

                                {/* OTHER FILTERS */}
                                <div className="flex flex-wrap items-center gap-3">

                                    {/* DATE */}
                                    <select
                                        className="border border-slate-200
                                        rounded-lg px-3 py-2
                                        text-sm text-slate-600
                                        bg-white focus:outline-none"
                                    >
                                        <option>Date Range</option>
                                        <option>Last 7 Days</option>
                                        <option>Last 30 Days</option>
                                        <option>This Month</option>
                                    </select>

                                    {/* SHOW */}
                                    <div className="flex items-center gap-2
                                        text-sm text-slate-600
                                        border border-slate-200
                                        rounded-lg px-3 py-2 bg-white"
                                    >
                                        <span>Show</span>

                                        <select
                                            className="font-semibold text-slate-800 focus:outline-none bg-transparent"
                                        >
                                            <option>10</option>
                                            <option>25</option>
                                            <option>50</option>
                                            <option>100</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ================= TABLE ================= */}
                        <div className="overflow-x-auto">

                            <table className="w-full text-left text-sm border-collapse min-w-225">

                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-700 font-semibold">

                                        <th className="py-3.5 px-6">
                                            Order ID
                                        </th>

                                        <th className="py-3.5 px-6">
                                            Date
                                        </th>

                                        <th className="py-3.5 px-6">
                                            Customer
                                        </th>

                                        <th className="py-3.5 px-6">
                                            Product(s)
                                        </th>

                                        <th className="py-3.5 px-6">
                                            Total
                                        </th>

                                        <th className="py-3.5 px-6">
                                            Status
                                        </th>

                                        <th className="py-3.5 px-6">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200 text-slate-700">

                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order, idx) => (

                                            <tr
                                                key={idx}
                                                className="hover:bg-slate-50/70 transition-colors"
                                            >

                                                <td className="py-4 px-6 font-medium text-slate-900">
                                                    {order.id}
                                                </td>

                                                <td className="py-4 px-6 text-slate-600">
                                                    {order.date}
                                                </td>

                                                <td className="py-4 px-6 font-medium text-slate-800">
                                                    {order.customer}
                                                </td>

                                                <td className="py-4 px-6 text-slate-600">
                                                    {order.items}
                                                </td>

                                                <td className="py-4 px-6 font-semibold text-slate-900">
                                                    {order.total}
                                                </td>

                                                <td className="py-4 px-6">

                                                    <span
                                                        className={`
                                                            inline-block px-3 py-1
                                                            rounded-full text-xs
                                                            font-semibold
                                                            ${order.statusBg}
                                                        `}
                                                    >
                                                        {order.status}
                                                    </span>

                                                </td>

                                                <td className="py-4 px-6">

                                                    <div className="flex items-center gap-2">

                                                        {/* VIEW */}
                                                        {order.actions.includes("view") && (
                                                            <button
                                                                className="inline-flex items-center gap-1.5
                                                                px-3 py-1.5
                                                                border border-slate-200
                                                                rounded-lg text-xs font-medium
                                                                text-slate-700
                                                                hover:bg-slate-100
                                                                transition-colors"
                                                            >
                                                                <Eye size={14} />
                                                                View
                                                            </button>
                                                        )}

                                                        {/* SHIP */}
                                                        {order.actions.includes("ship") && (
                                                            <button
                                                                className="inline-flex items-center gap-1.5
                                                                px-3 py-1.5
                                                                border border-slate-200
                                                                rounded-lg text-xs font-medium
                                                                text-slate-700
                                                                hover:bg-slate-100
                                                                transition-colors"
                                                            >
                                                                <Truck size={14} />
                                                                Ship Order
                                                            </button>
                                                        )}

                                                        {/* MESSAGE */}
                                                        {order.actions.includes("message") && (
                                                            <button
                                                                className="inline-flex items-center gap-1.5
                                                                px-3 py-1.5
                                                                border border-slate-200
                                                                rounded-lg text-xs font-medium
                                                                text-slate-700
                                                                hover:bg-slate-100
                                                                transition-colors"
                                                            >
                                                                <MessageSquare size={14} />
                                                                Message
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="py-10 text-center text-slate-500"
                                            >
                                                No orders found.
                                            </td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
                        </div>

                        {/* ================= PAGINATION ================= */}
                        <div className="p-4 border-t border-slate-200 flex items-center justify-center gap-4 text-xs text-slate-500">

                            <button
                                className="p-1 rounded hover:bg-slate-100
                                text-slate-400 hover:text-slate-600
                                transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="flex items-center gap-2">

                                <span
                                    className="w-7 h-7 bg-slate-200
                                    font-semibold text-slate-800
                                    rounded flex items-center justify-center"
                                >
                                    1
                                </span>

                                <span>
                                    1 of 5
                                </span>
                            </div>

                            <button
                                className="p-1 rounded hover:bg-slate-100
                                text-slate-600 transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
