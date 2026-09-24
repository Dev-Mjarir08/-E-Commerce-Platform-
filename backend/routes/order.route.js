import { Router } from 'express';

import {
  createOrder,
  getMyOrders,
  getAdminOrders,
  getOrderById,
  cancelOrder
} from '../controllers/order.controller.js';
import { protect, optionalAuth, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Create order (supports both guest and authenticated customers)
router.post('/', optionalAuth, createOrder);

// Admin marketplace orders
router.get('/admin', protect, authorize('admin'), getAdminOrders);

// Customer orders
router.get('/', protect, getMyOrders);

// Single order (supports viewing with proper authorization checks)
router.get('/:id', optionalAuth, getOrderById);

// Customer cancellation
router.patch('/:id/cancel', protect, cancelOrder);

export default router;