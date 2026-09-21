import { Router } from 'express';
import {
  getVendorProfile,
  updateVendorProfile,
  changeVendorPassword,
  uploadVendorAvatar,
  getVendorOrders,
  getVendorOrderById,
  updateVendorOrderStatus,
  getVendorCustomers,
  getVendorCustomerById,
  getVendorAnalyticsOverview,
  getVendorAnalyticsRevenue,
  getVendorAnalyticsOrders,
  getVendorAnalyticsProducts,
  getVendorAnalyticsCustomers,
  getVendorAnalyticsSales,
  getVendorReviews,
  getVendorReviewById,
  updateVendorReview,
  deleteVendorReview,
  getVendorNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../controllers/vendor.controller.js';
import { protect, authorize, optionalAuth } from '../middlewares/auth.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';

const vendorRouter = Router();

// Vendor Profile Management & Dashboard Data
vendorRouter.get('/me', optionalAuth, getVendorProfile);

// Authenticated Vendor Endpoints
vendorRouter.use(protect);
vendorRouter.use(authorize('vendor', 'seller', 'admin', 'user', 'customer'));

// Profile Operations
vendorRouter.patch('/me', updateVendorProfile);
vendorRouter.patch('/me/change-password', changeVendorPassword);
vendorRouter.post(
  '/me/avatar',
  (req, res, next) => {
    uploadAvatar(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      next();
    });
  },
  uploadVendorAvatar
);

// Orders Management
vendorRouter.get('/orders', getVendorOrders);
vendorRouter.get('/orders/:id', getVendorOrderById);
vendorRouter.patch('/orders/:id/status', updateVendorOrderStatus);

// Customers Management
vendorRouter.get('/customers', getVendorCustomers);
vendorRouter.get('/customers/:id', getVendorCustomerById);

// Analytics Operations
vendorRouter.get('/analytics/overview', getVendorAnalyticsOverview);
vendorRouter.get('/analytics/revenue', getVendorAnalyticsRevenue);
vendorRouter.get('/analytics/orders', getVendorAnalyticsOrders);
vendorRouter.get('/analytics/products', getVendorAnalyticsProducts);
vendorRouter.get('/analytics/customers', getVendorAnalyticsCustomers);
vendorRouter.get('/analytics/sales', getVendorAnalyticsSales);

// Reviews Management
vendorRouter.get('/reviews', getVendorReviews);
vendorRouter.get('/reviews/:id', getVendorReviewById);
vendorRouter.patch('/reviews/:id', updateVendorReview);
vendorRouter.delete('/reviews/:id', deleteVendorReview);

// Notifications Management
vendorRouter.get('/notifications', getVendorNotifications);
vendorRouter.patch('/notifications/read-all', markAllNotificationsRead);
vendorRouter.patch('/notifications/:id/read', markNotificationRead);

export default vendorRouter;
