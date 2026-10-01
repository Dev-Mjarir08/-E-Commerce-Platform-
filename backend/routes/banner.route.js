import { Router } from 'express';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  recordBannerClick
} from '../controllers/banner.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Public: view published banners and register clicks
router.get('/', getBanners);
router.post('/:id/click', recordBannerClick);

// Admin: full CRUD
router.post('/', protect, authorize('admin'), createBanner);
router.put('/:id', protect, authorize('admin'), updateBanner);
router.delete('/:id', protect, authorize('admin'), deleteBanner);

export default router;
