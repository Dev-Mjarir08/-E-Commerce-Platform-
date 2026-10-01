import { Router } from 'express';
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand
} from '../controllers/brand.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Public: list brands
router.get('/', getBrands);

// Admin: brand management
router.post('/', protect, authorize('admin'), createBrand);
router.put('/:id', protect, authorize('admin'), updateBrand);
router.delete('/:id', protect, authorize('admin'), deleteBrand);

export default router;
