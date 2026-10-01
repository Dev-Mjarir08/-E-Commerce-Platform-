import { Router } from 'express';
import {
  getCustomerProfile,
  updateCustomerProfile,
  uploadCustomerAvatar,
  uploadCustomerCover,
  changePassword
} from '../controllers/customer.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadAvatar, uploadCategoryImage } from '../middlewares/upload.middleware.js';

const router = Router();

// Protect all customer routes
router.use(protect);

// Customer Profile Endpoints
router.get('/profile', getCustomerProfile);
router.put('/profile', updateCustomerProfile);

// Customer Avatar Upload
router.post(
  '/avatar',
  (req, res, next) => {
    uploadAvatar(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      next();
    });
  },
  uploadCustomerAvatar
);

// Customer Cover Photo Upload
router.post(
  '/cover',
  (req, res, next) => {
    uploadCategoryImage(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      next();
    });
  },
  uploadCustomerCover
);

// Change Password
router.put('/change-password', changePassword);

export default router;
