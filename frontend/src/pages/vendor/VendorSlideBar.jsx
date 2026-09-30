import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Icons
import {
  FaBars,
  FaTimes,
  FaPlusCircle,
  FaEdit,
  FaStore,
  FaHistory,
  FaImages,
} from "react-icons/fa";
import { TfiPackage } from "react-icons/tfi";
import { FiFileText, FiLayers } from "react-icons/fi";
import { IoAnalytics } from "react-icons/io5";
import { MdSettingsBackupRestore } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { LuPackageX } from "react-icons/lu";
import { VscStarHalf } from "react-icons/vsc";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MessageSquareText } from 'lucide-react'
import { MdAccountCircle } from "react-icons/md";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  AlertTriangle,
  LogOut,
} from "lucide-react";

export default function VendorSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Navigation Links structure organized into logical categories
  const navigationGroups = [
    {
      title: "Core",
      items: [
        {
          label: "Dashboard",
          path: "/pages/vendor/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Analytics",
          path: "/pages/vendor/analytics",
          icon: IoAnalytics,
        },
      ],
    },
    {
      title: "Catalog",
      items: [
        { label: "Products", path: "/pages/vendor/products", icon: Package },
        {
          label: "Create Product",
          path: "/pages/vendor/create-products",
          icon: FaPlusCircle,
        },
        {
          label: "Edit Product",
          path: "/pages/vendor/edit-products",
          icon: FaEdit,
        },
        {
          label: "Product Variants",
          path: "/pages/vendor/product-variant",
          icon: FiLayers,
        },
        {
          label: "Media Upload",
          path: "/pages/vendor/media-upload",
          icon: FaImages,
        },
      ],
    },
    {
      title: "Sales & Orders",
      items: [
        {
          label: "Orders",
          path: "/pages/vendor/orders",
          icon: ShoppingBag,
          badge: "3",
        },
        {
          label: "Order Details",
          path: "/pages/vendor/order-details",
          icon: FiFileText,
        },
        { label: "Customers", path: "/pages/vendor/customers", icon: Users },
        { label: "Customer Details" , path: "/pages/vendor/customer-details" , icon: MdAccountCircle }
      ],
    },
    {
      title: "Inventory Control",
      items: [
        {
          label: "Inventory",
          path: "/pages/vendor/inventory",
          icon: TfiPackage,
        },
        {
          label: "Inventory History",
          path: "/pages/vendor/inventory-history",
          icon: FaHistory,
        },
        {
          label: "Low Stock",
          path: "/pages/vendor/low-stock",
          icon: AlertTriangle,
        },
        {
          label: "Out Of Stock",
          path: "/pages/vendor/out-of-stock",
          icon: LuPackageX,
        },
      ],
    },
    {
      title: "Store & Engagement",
      items: [
        { label: "Reviews", path: "/pages/vendor/reviews", icon: VscStarHalf },
        {label: "Review Details" , path: "/pages/vendor/review-details/:reviewId" , icon: MessageSquareText},
        {
          label: "Notifications",
          path: "/pages/vendor/notification",
          icon: IoMdNotificationsOutline,
        },
        {
          label: "Store Front",
          path: "/pages/vendor/store",
          icon: FaStore,
        },
        {
          label: "Store Settings",
          path: "/pages/vendor/store-settings",
          icon: MdSettingsBackupRestore,
        },
        {
          label: "Coupons",
          path: "/pages/vendor/coupons",
          icon: RiCoupon3Line,
        },
        {
          label: "Vendor Profile",
          path: "/pages/vendor/profile",
          icon: CgProfile,
        },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 md:hidden bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95"
          aria-label="Open menu"
        >
          <FaBars size={18} />
        </button>
      )}

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          h-screen w-64 shrink-0
          bg-slate-900 text-slate-300
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          border-r border-slate-800 shadow-xl md:shadow-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* Vendor / Store Header */}
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-slate-900 font-bold text-base shadow-sm shrink-0">
                A
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-white truncate leading-tight">
                  E-commerce Platform
                </h2>
                <p className="text-[11px] text-slate-400 truncate">
                  Muhammed Rouhan (Vendor)
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg md:hidden"
              aria-label="Close menu"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Scrollable Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {navigationGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1">
                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {group.title}
                </p>

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold
                        transition-all duration-150 group
                        ${
                          active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          size={16}
                          className={`shrink-0 ${
                            active
                              ? "text-emerald-400"
                              : "text-slate-400 group-hover:text-slate-200"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer Controls */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/50 shrink-0 space-y-1">
            <Link
              to="/pages/vendor/settings"
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors
                ${
                  isActive("/pages/vendor/settings")
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Settings size={16} />
              <span>System Settings</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}