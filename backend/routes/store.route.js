import { Router } from 'express';
import {
  createStore,
  getMyStore,
  updateMyStore,
  getStoreById,
  updateStoreLogo,
  updateStoreBanner,
  updateStoreSettings,
  getStoreSettings,
  getAllStores,
  getPublicStores,
  getStoreBySlug,
  updateStoreById,
  deleteStoreById,
  updateStoreStatusById,
  toggleStoreVerificationById
} from '../controllers/store.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { uploadAvatar, uploadBanner } from '../middlewares/upload.middleware.js';

const storeRouter = Router();

// Public Storefront Endpoints (Homepage Showcase & Storefronts)
storeRouter.get('/public', getPublicStores);
storeRouter.get('/slug/:slug', getStoreBySlug);

// Public GET /api/stores fallback for storefront; admin gets all
storeRouter.get('/', (req, res, next) => {
  // If authorization header is provided, try protect
  if (req.headers.authorization) {
    return protect(req, res, () => {
      if (req.user?.role === 'admin') {
        return getAllStores(req, res, next);
      }
      return getPublicStores(req, res, next);
    });
  }
  return getPublicStores(req, res, next);
});

// Protected Vendor & Admin Endpoints Below
storeRouter.use(protect);
storeRouter.use(authorize('vendor', 'seller', 'admin', 'customer', 'user'));

// Store Core Endpoints
storeRouter.post('/', createStore);
storeRouter.get('/my-store', getMyStore);
storeRouter.patch('/my-store', updateMyStore);

// Admin Store Management Endpoints
storeRouter.get('/admin/all', authorize('admin'), getAllStores);

// Store Media & Settings
storeRouter.patch('/my-store/logo', (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, updateStoreLogo);

storeRouter.patch('/my-store/banner', uploadBanner, updateStoreBanner);

storeRouter.get('/my-store/settings', getStoreSettings);
storeRouter.patch('/my-store/settings', updateStoreSettings);

// Admin Parameterized Endpoints (placed after specific /my-store routes)
storeRouter.get('/:id', authorize('admin'), getStoreById);
storeRouter.patch('/:id', authorize('admin'), updateStoreById);
storeRouter.delete('/:id', authorize('admin'), deleteStoreById);
storeRouter.patch('/:id/status', authorize('admin'), updateStoreStatusById);
storeRouter.patch('/:id/verification', authorize('admin'), toggleStoreVerificationById);

export default storeRouter;