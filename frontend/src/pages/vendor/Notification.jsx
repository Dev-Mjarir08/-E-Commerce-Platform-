import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  Package,
  AlertTriangle,
  CreditCard,
  MessageSquare,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Settings,
  Check,
} from "lucide-react";

export default function Notification() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const [notifications, setNotifications] = useState([
    {
      id: "NOTIF-101",
      title: "New Order Received!",
      description: "Order #ORD-8921 placed for Eco-friendly Bamboo Watch ($89.00).",
      category: "orders",
      type: "success",
      timestamp: "10 mins ago",
      read: false,
      linkText: "View Order",
      actionUrl: "/orders/ORD-8921",
    },
    {
      id: "NOTIF-102",
      title: "Low Stock Alert",
      description: "Craft Resin Desk Organizer is down to 2 units in stock.",
      category: "inventory",
      type: "warning",
      timestamp: "1 hour ago",
      read: false,
      linkText: "Restock Inventory",
      actionUrl: "/inventory",
    },
    {
      id: "NOTIF-103",
      title: "Payout Transferred",
      description: "Weekly payout of $2,450.00 was successfully sent to your bank account.",
      category: "finance",
      type: "info",
      timestamp: "3 hours ago",
      read: true,
      linkText: "Payout Summary",
      actionUrl: "/finance/payouts",
    },
    {
      id: "NOTIF-104",
      title: "New 5-Star Customer Review",
      description: "Sophia M. left a 5-star review on Plant Polisher Spray.",
      category: "reviews",
      type: "success",
      timestamp: "Yesterday",
      read: true,
      linkText: "Read & Respond",
      actionUrl: "/reviews",
    },
    {
      id: "NOTIF-105",
      title: "Product Return Request",
      description: "Customer requested a return for Order #ORD-8802 (Damaged in transit).",
      category: "orders",
      type: "danger",
      timestamp: "2 days ago",
      read: true,
      linkText: "Review Claim",
      actionUrl: "/orders/ORD-8802/return",
    },
  ]);

  // Unread Count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Actions
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Safe navigation back to previous route or fallback dashboard
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  // Filter Logic
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "orders") return n.category === "orders";
    if (activeTab === "inventory") return n.category === "inventory";
    if (activeTab === "finance") return n.category === "finance";
    return true;
  });

  // Category Icon Mapper
  const getCategoryIcon = (category) => {
    switch (category) {
      case "orders":
        return <Package className="text-blue-600" size={18} />;
      case "inventory":
        return <AlertTriangle className="text-amber-600" size={18} />;
      case "finance":
        return <CreditCard className="text-emerald-600" size={18} />;
      case "reviews":
        return <MessageSquare className="text-purple-600" size={18} />;
      default:
        return <Bell className="text-slate-600" size={18} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            className="flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mb-2 transition-colors cursor-pointer"
            onClick={handleBack}
          >
            <ArrowLeft size={12} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Vendor Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="bg-rose-100 text-rose-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {unreadCount} Unread
              </span>
            )}
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Check size={14} className="text-emerald-600" /> Mark All as Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAllNotifications}
              className="flex items-center gap-1.5 bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* ================= MAIN CARD CONTAINER ================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* TAB FILTERS */}
        <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {[
              { id: "all", label: "All Notifications" },
              { id: "unread", label: "Unread" },
              { id: "orders", label: "Orders" },
              { id: "inventory", label: "Inventory" },
              { id: "finance", label: "Finance & Payouts" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            type="button"
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-semibold px-2 cursor-pointer"
          >
            <Settings size={13} /> Preferences
          </button>
        </div>

        {/* ================= NOTIFICATION LIST ================= */}
        <div className="divide-y divide-slate-100">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  !notif.read ? "bg-emerald-50/20" : "hover:bg-slate-50/80"
                }`}
              >
                {/* Left Side: Icon & Content */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-xs sm:text-sm truncate ${
                          !notif.read
                            ? "font-bold text-slate-900"
                            : "font-semibold text-slate-700"
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {notif.description}
                    </p>

                    <div className="flex items-center gap-4 pt-1">
                      <span className="text-[11px] text-slate-400">
                        {notif.timestamp}
                      </span>

                      {notif.linkText && (
                        <Link
                          to={notif.actionUrl}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-0.5"
                        >
                          {notif.linkText} <ChevronRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Quick Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {!notif.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notif.id)}
                      title="Mark as Read"
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteNotification(notif.id)}
                    title="Delete Notification"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Bell size={32} className="mx-auto text-slate-300" />
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                No notifications found
              </p>
              <p className="text-xs text-slate-400">
                You're all caught up! New updates will show up here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}