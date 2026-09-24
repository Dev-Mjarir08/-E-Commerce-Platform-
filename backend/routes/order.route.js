import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
} from '../controllers/order.controller.js';
import { protect, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', optionalAuth, getOrderById);
router.patch('/:id/cancel', protect, cancelOrder);

export default router;
