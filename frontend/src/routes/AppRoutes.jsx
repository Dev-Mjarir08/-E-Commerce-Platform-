import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Layouts
import CustomerLayout from "../layouts/CustomerLayout";
import VendorLayout from "../layouts/VendorLayout";
import AdminLayout from "../layouts/AdminLayout";

// Lazy-loaded Public Routes
const Home = lazy(() => import("../pages/public/Home"));
const StoreDetails = lazy(() => import("../pages/public/StoreDetails"));
const Shop = lazy(() => import("../pages/public/Shop"));
const ProductDetails = lazy(() => import("../pages/public/ProductDetails"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

// Lazy-loaded Customer Routes
const Profile = lazy(() => import("../pages/customer/Profile"));
const Cart = lazy(() => import("../pages/customer/Cart"));
const Wishlist = lazy(() => import("../pages/customer/Wishlist"));
const Addresses = lazy(() => import("../pages/customer/Addresses"));
const CustomerOrders = lazy(() => import("../pages/customer/Orders"));
const OrderDetails = lazy(() => import("../pages/customer/OrderDetails"));
const OrderTracking = lazy(() => import("../pages/customer/OrderTracking"));
const ReturnRefund = lazy(() => import("../pages/customer/ReturnRefund"));
const SearchResults = lazy(() => import("../pages/customer/SearchResults"));
const CustomerCategories = lazy(() => import("../pages/customer/Categories"));
const ContactHelp = lazy(() => import("../pages/customer/ContactHelp"));
const Checkout = lazy(() => import("../pages/customer/Checkout"));
const OrderSuccess = lazy(() => import("../pages/customer/OrderSuccess"));
const OrderFailed = lazy(() => import("../pages/customer/OrderFailed"));
const CustomerSettings = lazy(() => import("../pages/customer/Settings"));

// Lazy-loaded Vendor Routes
const VendorDashboard = lazy(() => import("../pages/vendor/Dashboard"));
const VendorOrders = lazy(() => import("../pages/vendor/Orders"));
const VendorOrderDetails = lazy(() => import("../pages/vendor/OrderDetails"));
const VendorProducts = lazy(() => import("../pages/vendor/Products"));
const VendorCreateProduct = lazy(() => import("../pages/vendor/CreateProduct"));
const VendorEditProduct = lazy(() => import("../pages/vendor/EditProduct"));
const VendorInventory = lazy(() => import("../pages/vendor/Inventory"));
const VendorCoupons = lazy(() => import("../pages/vendor/Coupons"));
const VendorCustomers = lazy(() => import("../pages/vendor/Customers"));
const VendorAnalytics = lazy(() => import("../pages/vendor/Analytics"));
const VendorReviews = lazy(() => import("../pages/vendor/Reviews"));
const VendorNotifications = lazy(() => import("../pages/vendor/Notifications"));
const VendorStore = lazy(() => import("../pages/vendor/Store"));
const VendorStoreSettings = lazy(() => import("../pages/vendor/StoreSettings"));
const VendorProfile = lazy(() => import("../pages/vendor/Profile"));

// Lazy-loaded Admin Routes
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Products = lazy(() => import("../pages/admin/Products"));
const AddProduct = lazy(() => import("../pages/admin/products/AddProduct"));
const Categories = lazy(() => import("../pages/admin/Categories"));
const Inventory = lazy(() => import("../pages/admin/products/Inventory"));
const Stores = lazy(() => import("../pages/admin/Stores"));
const AdminStoreDetails = lazy(
  () => import("../pages/admin/stores/StoreDetails"),
);
const Vendors = lazy(() => import("../pages/admin/Vendors"));
const VendorDetails = lazy(
  () => import("../pages/admin/vendors/VendorDetails"),
);
const Coupons = lazy(() => import("../pages/admin/Coupons"));
const OrdersAdmin = lazy(() => import("../pages/admin/Orders"));
const AdminOrderDetails = lazy(
  () => import("../pages/admin/orders/OrderDetails"),
);
const SettingsAdmin = lazy(() => import("../pages/admin/Settings"));
const Customers = lazy(() => import("../pages/admin/Customers"));
const CustomerDetails = lazy(
  () => import("../pages/admin/customers/CustomerDetails"),
);
const Payment = lazy(() => import("../pages/admin/Payment"));
const Analytics = lazy(() => import("../pages/admin/Analytics"));
const Payouts = lazy(() => import("../pages/admin/Payouts"));
const PayoutDetails = lazy(
  () => import("../pages/admin/payouts/PayoutDetails"),
);
const Reviews = lazy(() => import("../pages/admin/Reviews"));
const ReviewDetails = lazy(
  () => import("../pages/admin/reviews/ReviewDetails"),
);
const Refunds = lazy(() => import("../pages/admin/Refunds"));
const RefundDetails = lazy(
  () => import("../pages/admin/refunds/RefundDetails"),
);
const VendorRequests = lazy(() => import("../pages/admin/VendorRequests"));
const Banners = lazy(() => import("../pages/admin/Banners"));
const Brands = lazy(() => import("../pages/admin/Brands"));
const Shipping = lazy(() => import("../pages/admin/Shipping"));
const ShipmentDetails = lazy(
  () => import("../pages/admin/shipping/ShipmentDetails"),
);
const Notifications = lazy(() => import("../pages/admin/Notifications"));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Client Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/customer/cart"
          element={<Navigate to="/cart" replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<ResetPassword />} />
        <Route path="/store/:slug" element={<StoreDetails />} />

        {/* Customer Routes - Protected for authenticated users */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["customer", "seller", "admin"]} />
          }
        >
          <Route element={<CustomerLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/customer/profile"
              element={<Navigate to="/profile" replace />}
            />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route
              path="/customer/wishlist"
              element={<Navigate to="/wishlist" replace />}
            />
            <Route path="/addresses" element={<Addresses />} />
            <Route
              path="/customer/addresses"
              element={<Navigate to="/addresses" replace />}
            />
            <Route path="/orders" element={<CustomerOrders />} />
            <Route
              path="/customer/orders"
              element={<Navigate to="/orders" replace />}
            />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/customer/orders/:id" element={<OrderDetails />} />
            <Route path="/orders/:id/track" element={<OrderTracking />} />
            <Route path="/orders/:id/return" element={<ReturnRefund />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/categories" element={<CustomerCategories />} />
            <Route path="/contact" element={<ContactHelp />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/customer/checkout"
              element={<Navigate to="/checkout" replace />}
            />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order/success/:id" element={<OrderSuccess />} />
            <Route path="/orders/success" element={<OrderSuccess />} />
            <Route
              path="/customer/order-success"
              element={<Navigate to="/order-success" replace />}
            />
            <Route
              path="/customer/orders/success"
              element={<Navigate to="/order-success" replace />}
            />
            <Route path="/order-failed" element={<OrderFailed />} />
            <Route path="/order/failed" element={<OrderFailed />} />
            <Route path="/orders/failed" element={<OrderFailed />} />
            <Route
              path="/customer/order-failed"
              element={<Navigate to="/order-failed" replace />}
            />
            <Route
              path="/customer/orders/failed"
              element={<Navigate to="/order-failed" replace />}
            />
            <Route path="/settings" element={<CustomerSettings />} />
            <Route
              path="/customer/settings"
              element={<Navigate to="/settings" replace />}
            />
          </Route>
        </Route>

        {/* Vendor Operations Suite - Protected for 'vendor', 'seller', 'admin' */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["vendor", "seller", "admin"]} />
          }
        >
          <Route path="/vendor" element={<VendorLayout />}>
            <Route
              index
              element={<Navigate to="/vendor/dashboard" replace />}
            />
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="orders/:id" element={<VendorOrderDetails />} />
            <Route path="products" element={<VendorProducts />} />
            <Route
              path="products/create"
              element={<VendorCreateProduct />}
            />
            <Route
              path="products/edit/:id"
              element={<VendorEditProduct />}
            />
            <Route path="inventory" element={<VendorInventory />} />
            <Route path="coupons" element={<VendorCoupons />} />
            <Route path="customers" element={<VendorCustomers />} />
            <Route path="analytics" element={<VendorAnalytics />} />
            <Route path="reviews" element={<VendorReviews />} />
            <Route path="notifications" element={<VendorNotifications />} />
            <Route path="store" element={<VendorStore />} />
            <Route path="settings" element={<VendorStoreSettings />} />
            <Route path="profile" element={<VendorProfile />} />
          </Route>
        </Route>

        {/* Admin Operations Suite - Protected for 'admin' role only */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />

            {/* Products */}
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/categories" element={<Categories />} />
            <Route path="products/inventory" element={<Inventory />} />

            {/* Stores */}
            <Route path="stores" element={<Stores />} />
            <Route path="stores/:id" element={<AdminStoreDetails />} />

            {/* Vendors */}
            <Route path="vendors" element={<Vendors />} />
            <Route path="vendor-details" element={<VendorDetails />} />

            {/* Coupons */}
            <Route path="coupons" element={<Coupons />} />

            {/* Orders */}
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="orders/:id" element={<AdminOrderDetails />} />

            {/* Payments */}
            <Route path="payments" element={<Payment />} />

            {/* Customers */}
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetails />} />

            {/* Finance */}
            <Route path="payouts" element={<Payouts />} />
            <Route path="payouts/:id" element={<PayoutDetails />} />

            {/* Moderation */}
            <Route path="reviews" element={<Reviews />} />
            <Route path="reviews/:id" element={<ReviewDetails />} />

            {/* Post Order */}
            <Route path="refunds" element={<Refunds />} />
            <Route path="refunds/:id" element={<RefundDetails />} />

            {/* Vendor Requests */}
            <Route path="vendor-requests" element={<VendorRequests />} />

            {/* Banners */}
            <Route path="banners" element={<Banners />} />

            {/* Brands */}
            <Route path="brands" element={<Brands />} />

            {/* Settings */}
            <Route path="settings" element={<SettingsAdmin />} />

            {/* Analytics */}
            <Route path="analytics" element={<Analytics />} />

            {/* Shipping */}
            <Route path="shipping" element={<Shipping />} />
            <Route path="shipping/:id" element={<ShipmentDetails />} />

            {/* Notifications */}
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
