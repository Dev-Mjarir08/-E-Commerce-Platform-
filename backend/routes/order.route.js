import { Router } from 'express';

import {
  createOrder,
  getMyOrders,
  getAdminOrders,
  updateAdminOrderStatus,
  getOrderById,
  cancelOrder
} from '../controllers/order.controller.js';
import { protect, optionalAuth, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Create order (supports both guest and authenticated customers)
router.post('/', optionalAuth, createOrder);

router.get('/admin', protect, authorize('admin'), getAdminOrders);
router.patch('/admin/:id/status', protect, authorize('admin'), updateAdminOrderStatus);

// Customer orders
router.get('/', protect, getMyOrders);

// Single order (supports viewing with proper authorization checks)
router.get('/:id', optionalAuth, getOrderById);

// Customer cancellation
router.patch('/:id/cancel', protect, cancelOrder);

export default router;