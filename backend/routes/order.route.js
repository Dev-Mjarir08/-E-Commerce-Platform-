import { Router } from 'express';

import {
  createOrder,
  getMyOrders,
  getAdminOrders,
  updateAdminOrderStatus,
  getOrderById,
  cancelOrder,
  getShippingTracking,
  updateShippingTracking
} from '../controllers/order.controller.js';
import { protect, optionalAuth, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Create order (supports both guest and authenticated customers)
router.post('/', optionalAuth, createOrder);

router.get('/admin', protect, authorize('admin'), getAdminOrders);
router.patch('/admin/:id/status', protect, authorize('admin', 'seller', 'vendor'), updateAdminOrderStatus);
router.patch('/admin/:id/shipping', protect, authorize('admin', 'vendor'), updateShippingTracking);

// Tracking verification (public with optionalAuth)
router.get('/track/:id', optionalAuth, getShippingTracking);
router.get('/:id/tracking', optionalAuth, getShippingTracking);

// Customer orders
router.get('/', protect, getMyOrders);

// Single order (supports viewing with proper authorization checks)
router.get('/:id', optionalAuth, getOrderById);

// Customer cancellation
router.patch('/:id/cancel', protect, cancelOrder);

export default router;