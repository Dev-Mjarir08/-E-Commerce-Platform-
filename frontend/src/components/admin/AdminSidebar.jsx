import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  Store,
  BriefcaseBusiness,
  TicketPercent,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  ShoppingBag,
  Users,
  CreditCard,
  BarChart3,
  Wallet,
  RotateCcw,
  Star,
  Image,
  Tags,
  Truck,
  Bell,
  ExternalLink,
  FolderTree,
} from "lucide-react";
import adminApi from "../../services/adminApi";

const AdminSidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const user = useSelector((state) => state.auth?.user);
  const totalProducts = useSelector((state) => state.products?.items?.length || 0);
  const totalCategoriesRedux = useSelector((state) => state.categories?.items?.length || 0);
  const totalStores = useSelector((state) => state.stores?.items?.length || 0);
  const totalCoupons = useSelector((state) => state.coupons?.items?.length || 0);
  const totalOrdersRedux = useSelector((state) => state.orders?.items?.length || 0);
  const totalCustomersRedux = useSelector((state) => state.customers?.items?.length || 0);

  const [productsOpen, setProductsOpen] = useState(false);
  const [vendorsOpen, setVendorsOpen] = useState(false);

  // Live real-time statistics fetched from MongoDB
  const [liveStats, setLiveStats] = useState({
    totalProducts: 0,
    totalStores: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalVendors: 0,
    totalCoupons: 0,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchLiveStats = async () => {
      try {
        const res = await adminApi.getDashboardStats();
        const data = res?.data || res;
        if (isMounted && data) {
          setLiveStats({
            totalProducts: Number(data.totalProducts ?? 0),
            totalStores: Number(data.totalStores ?? 0),
            totalOrders: Number(data.totalOrders ?? 0),
            totalCustomers: Number(data.totalCustomers ?? 0),
            totalVendors: Number(data.totalVendors ?? 0),
            totalCoupons: Number(data.totalCoupons ?? 0),
          });
        }
      } catch (err) {
        console.warn("Admin sidebar live stats sync:", err);
      }
    };

    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Compute highest accurate count between Redux cache and MongoDB live query
  const displayProducts = Math.max(liveStats.totalProducts, totalProducts);
  const displayStores = Math.max(liveStats.totalStores, totalStores);
  const displayOrders = Math.max(liveStats.totalOrders, totalOrdersRedux);
  const displayCustomers = Math.max(liveStats.totalCustomers, totalCustomersRedux);
  const displayVendors = liveStats.totalVendors;
  const displayCoupons = Math.max(liveStats.totalCoupons, totalCoupons);

  const mainNavItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: FolderTree,
      badge: `${totalCategoriesRedux || 0}`,
    },
    {
      name: "Stores",
      path: "/admin/stores",
      icon: Store,
      badge: `${displayStores}`,
    },
    {
      name: "Coupons",
      path: "/admin/coupons",
      icon: TicketPercent,
      badge: `${displayCoupons}`,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
      badge: `${displayOrders}`,
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: CreditCard,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: Users,
      badge: `${displayCustomers}`,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Payouts",
      path: "/admin/payouts",
      icon: Wallet,
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: Star,
    },
    {
      name: "Refunds",
      path: "/admin/refunds",
      icon: RotateCcw,
    },
    {
      name: "Vendor KYC",
      path: "/admin/vendor-requests",
      icon: ShieldCheck,
    },
    {
      name: "Banners & Sliders",
      path: "/admin/banners",
      icon: Image,
    },
    {
      name: "Brands",
      path: "/admin/brands",
      icon: Tags,
    },
    {
      name: "Shipping",
      path: "/admin/shipping",
      icon: Truck,
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
            OK
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white tracking-wide text-sm truncate">
                OMNIKART
              </span>
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                Admin Suite
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle on desktop */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Admin Profile Mini Card */}
      {!isCollapsed && (
        <div className="p-4 mx-3 my-3 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white truncate">
                {user?.name || "Administrator"}
              </span>
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            </div>
            <span className="text-[11px] text-slate-400 block truncate">
              {user?.email || "admin@domain.com"}
            </span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 font-sans">
        <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {!isCollapsed ? "Menu" : "•••"}
        </div>

        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? "bg-indigo-600 text-white shadow-sm font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`
          }
          title={isCollapsed ? "Dashboard" : undefined}
        >
          <LayoutDashboard size={18} className="shrink-0" />

          {!isCollapsed && <span className="truncate flex-1">Dashboard</span>}
        </NavLink>

        {/* PRODUCTS DROPDOWN */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setProductsOpen((prev) => !prev)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
             text-xs font-medium leading-4 font-inherit
             text-slate-300 hover:bg-slate-800 hover:text-white
             transition-colors appearance-none border-0"
            title={isCollapsed ? "Products" : undefined}
          >
            <Package size={18} className="shrink-0" />

            {!isCollapsed && (
              <>
                <span className="truncate flex-1 text-left text-xs font-medium leading-4">
                  Products
                </span>

                <span className="shrink-0 px-2 py-0.5 text-[10px] leading-3 font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {displayProducts}
                </span>

                <ChevronDown
                  size={15}
                  strokeWidth={2}
                  className={`shrink-0 transition-transform duration-200 ${
                    productsOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {/* Product Submenu */}
          {!isCollapsed && productsOpen && (
            <div className="ml-8 space-y-1">
              <NavLink
                to="/admin/products"
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 font-semibold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                All Products
              </NavLink>

              <NavLink
                to="/admin/products/add"
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 font-semibold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                Add Product
              </NavLink>

              <NavLink
                to="/admin/categories"
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 font-semibold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                Categories
              </NavLink>

              <NavLink
                to="/admin/products/inventory"
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 font-semibold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                Inventory
              </NavLink>
            </div>
          )}
        </div>

        {/* Vendors Dropdown */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setVendorsOpen((prev) => !prev)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
             text-xs font-medium leading-4 font-inherit
             text-slate-300 hover:bg-slate-800 hover:text-white
             transition-colors appearance-none border-0"
            title={isCollapsed ? "Vendors" : undefined}
          >
            <BriefcaseBusiness size={18} className="shrink-0" />

            {!isCollapsed && (
              <>
                <span className="truncate flex-1 text-left text-xs font-medium leading-4">
                  Vendors
                </span>

                <span className="shrink-0 px-2 py-0.5 text-[10px] leading-3 font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {displayVendors}
                </span>

                <ChevronDown
                  size={15}
                  strokeWidth={2}
                  className={`shrink-0 transition-transform duration-200 ${
                    vendorsOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {/* Vendor Submenu */}
          {!isCollapsed && vendorsOpen && (
            <div className="ml-8 space-y-1">
              <NavLink
                to="/admin/vendors"
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 font-semibold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                All Vendors
              </NavLink>
            </div>
          )}
        </div>

        {/* Other Navigation Items */}
        {mainNavItems
          .filter((item) => item.name !== "Dashboard")
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm font-semibold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
                title={isCollapsed ? item.name : undefined}
              >
                <Icon size={18} className="shrink-0" />

                {!isCollapsed && (
                  <span className="truncate flex-1">{item.name}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        {/* Go to Customer Page Link */}
        <div className="pt-2 mt-2 border-t border-slate-850">
          <NavLink
            to="/"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/40 transition-all shadow-xs group"
            title={isCollapsed ? "Customer Page" : undefined}
          >
            <ShoppingBag size={18} className="text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="truncate">Customer Page</span>
                <ExternalLink size={12} className="text-indigo-400 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
              </div>
            )}
          </NavLink>
        </div>
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800">
          <div className="px-3 text-[10px] text-slate-500 flex items-center justify-between">
            <span>v2.4.0</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div
          className={`fixed top-0 bottom-0 left-0 z-30 ${isCollapsed ? "w-20" : "w-64"}`}
        >
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
