import { Router } from 'express';

import {
  createOrder,
  getMyOrders,
  getAdminOrders,
  getOrderById,
  cancelOrder
} from '../controllers/order.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

router.post('/', createOrder);

// Admin marketplace orders
router.get('/admin', getAdminOrders);

// Customer orders
router.get('/', getMyOrders);

// Single order
router.get('/:id', getOrderById);

// Customer cancellation
router.patch('/:id/cancel', cancelOrder);

export default router;