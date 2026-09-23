import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/public/Home";
import StoreDetails from "../pages/public/StoreDetails";

// Customer imports
import CustomerLayout from "../layouts/CustomerLayout";
import OrderTracking from "../pages/customer/OrderTracking";
import ReturnRefund from "../pages/customer/ReturnRefund";
import Addresses from "../pages/customer/Addresses";
import Cart from "../pages/customer/Cart";
import CustomerCategories from "../pages/customer/Categories";
import Checkout from "../pages/customer/Checkout";
import ContactHelp from "../pages/customer/ContactHelp";
import OrderDetails from "../pages/customer/OrderDetails";
import OrderFailed from "../pages/customer/OrderFailed";
import CustomerOrders from "../pages/customer/Orders";
import OrderSuccess from "../pages/customer/OrderSuccess";
import Profile from "../pages/customer/Profile";
import SearchResults from "../pages/customer/SearchResults";
import CustomerSettings from "../pages/customer/Settings";
import Wishlist from "../pages/customer/Wishlist";

// Admin imports
import AdminLayout from "../layouts/AdminLayout";
import Categories from "../pages/admin/Categories";
import Coupons from "../pages/admin/Coupons";
import Customers from "../pages/admin/Customers";
import Dashboard from "../pages/admin/Dashboard";
import Orders from "../pages/admin/Orders";
import Products from "../pages/admin/Products";
import AddProduct from "../pages/admin/products/AddProduct";
import Inventory from "../pages/admin/products/Inventory";
import Settings from "../pages/admin/Settings";
import Stores from "../pages/admin/Stores";

// Security & Auth
import ProtectedRoute from "../components/common/ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Client Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/customer/cart"
            element={<Navigate to="/cart" replace />}
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
          <Route path="/orders/:id/track" element={<OrderTracking />} />
          <Route path="/orders/:id/return" element={<ReturnRefund />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/categories" element={<CustomerCategories />} />
          <Route path="/contact" element={<ContactHelp />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/customer/orders/:id" element={<OrderDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/customer/checkout"
            element={<Navigate to="/checkout" replace />}
          />
          <Route path="/order-success" element={<OrderSuccess />} />
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

      {/* Admin Operations Suite - Protected for 'admin' role only */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/categories" element={<Categories />} />
          <Route path="products/inventory" element={<Inventory />} />
          <Route path="stores" element={<Stores />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
