import React from 'react'
import VendorAnalytics from '../pages/vendor/Analytics'
import { Routes, Route } from "react-router-dom";
import VendorCoupons from '../pages/vendor/Coupons';
import CreateProduct from '../pages/vendor/CreateProduct';
import VendorCustomers from '../pages/vendor/Customers';
import VendorDashboard from '../pages/vendor/Dashboard';
import EditProduct from '../pages/vendor/EditProduct';
import VendorInventory from '../pages/vendor/Inventory';
import OrderDetails from '../pages/vendor/OrderDetails';
import VendorOrdersPage from '../pages/vendor/Orders';
import VendorProducts from '../pages/vendor/Products';
import Profile from '../pages/vendor/Profile.jsx';
import VendorStore from '../pages/vendor/Store';
import StoreSettings from '../pages/vendor/StoreSettings.jsx';
import CustomerDetails from '../pages/vendor/CustomerDetails.jsx';
import LowStock from '../pages/vendor/LowStock.jsx';
import InventoryHistory from '../pages/vendor/InventoryHistory.jsx';
import OutOfStock from '../pages/vendor/OutOfStock.jsx';
import ProductVariants from '../pages/vendor/ProductVariant.jsx';
import MediaUpload from '../pages/vendor/MediaUpload.jsx';
import Reviews from '../pages/vendor/Reviews.jsx';
import ReviewDetails from '../pages/vendor/ReviewDetails.jsx';
import Notification from '../pages/vendor/Notification.jsx';
import VendorSettings from '../pages/vendor/SystemSetting.jsx';


const AppRoutes = () => {
    return (

        <Routes>
            <Route path="/pages/vendor/analytics" element={<VendorAnalytics />} />
            <Route path="/pages/vendor/coupons" element={<VendorCoupons />} />
            <Route path="/pages/vendor/create-products" element={<CreateProduct />} />
            <Route path="/pages/vendor/customers" element={<VendorCustomers />} />
            <Route path="/pages/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/pages/vendor/edit-products" element={<EditProduct />} />
            <Route path="/pages/vendor/inventory" element={<VendorInventory />} />
            <Route path="/pages/vendor/order-details" element={<OrderDetails />} />
            <Route path="/pages/vendor/orders" element={<VendorOrdersPage/>} />
            <Route path="/pages/vendor/products" element={<VendorProducts />} />
            <Route path="/pages/vendor/profile" element={<Profile/>} />
            <Route path="/pages/vendor/store" element={<VendorStore />} />
            <Route path="/pages/vendor/store-settings" element={<StoreSettings />} />
            <Route path="/pages/vendor/customer-details/:id" element={<CustomerDetails />} />
            <Route path="/pages/vendor/low-stock" element={<LowStock />} />
            <Route path="/pages/vendor/inventory-history" element={<InventoryHistory />} />
            <Route path="/pages/vendor/out-of-stock" element={<OutOfStock />} />
            <Route path="/pages/vendor/product-variant" element={<ProductVariants />} />
            <Route path="/pages/vendor/media-upload" element={<MediaUpload />} />
            <Route path="/pages/vendor/reviews" element={<Reviews />} />
            <Route path="/pages/vendor/review-details/:reviewId" element={<ReviewDetails/>} />
            <Route path="/pages/vendor/notification" element={<Notification/>} />
            <Route path="/pages/vendor/settings" element={<VendorSettings/>} />

        </Routes>


    )
}

export default AppRoutes
