import { Router } from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
  removeCoupon,
  clearCart,
  mergeGuestCart
} from '../controllers/cart.controller.js';
import { protect, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Cart retrieval and item manipulation (supports optional auth / guestId)
router.get('/', optionalAuth, getCart);
router.post('/items', optionalAuth, addItemToCart);
router.put('/items/:itemId', optionalAuth, updateCartItem);
router.delete('/items/:itemId', optionalAuth, removeCartItem);

// Coupon management
router.post('/coupon', optionalAuth, applyCoupon);
router.delete('/coupon', optionalAuth, removeCoupon);

// Clear entire bag
router.delete('/', optionalAuth, clearCart);

// Merge guest bag after login (requires auth)
router.post('/merge', protect, mergeGuestCart);

export default router;
