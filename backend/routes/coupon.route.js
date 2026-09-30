import { Router } from 'express';
import {
  createCoupon,
  getCoupons,
  getCouponById,
  validateCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/coupon.controller.js';
import { protect, authorize, optionalAuth } from '../middlewares/auth.middleware.js';

const couponRouter = Router();

// Public / Client coupon lookup & validation
couponRouter.get('/', optionalAuth, getCoupons);
couponRouter.post('/validate', optionalAuth, validateCoupon);
couponRouter.get('/:id', getCouponById);

// Vendor & Admin Coupon Management
couponRouter.use(protect);
couponRouter.use(authorize('vendor', 'seller', 'admin'));

couponRouter.post('/', createCoupon);
couponRouter.patch('/:id', updateCoupon);
couponRouter.delete('/:id', deleteCoupon);

export default couponRouter;
