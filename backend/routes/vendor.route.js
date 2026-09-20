import { Router } from 'express';
import {
  getVendorProfile,
  updateVendorProfile,
  changeVendorPassword,
  uploadVendorAvatar
} from '../controllers/vendor.controller.js';
import { protect, authorize, optionalAuth } from '../middlewares/auth.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';

const vendorRouter = Router();

// Vendor Profile Management & Dashboard Data
// GET /me uses optionalAuth: loads authenticated vendor's store or active flagship store
vendorRouter.get('/me', optionalAuth, getVendorProfile);

// Mutating routes require authentication and proper role
vendorRouter.use(protect);
vendorRouter.use(authorize('vendor', 'seller', 'admin', 'user', 'customer'));
vendorRouter.patch('/me', updateVendorProfile);
vendorRouter.patch('/me/change-password', changeVendorPassword);

// Avatar Upload
vendorRouter.post('/me/avatar', (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, uploadVendorAvatar);

export default vendorRouter;
