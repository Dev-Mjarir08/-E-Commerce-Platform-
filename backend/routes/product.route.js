import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  createBulkProducts,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
  clearAllProducts,
  deleteProductImage,
  getMyProducts,
  updateProductStatus,
  addProductImages,
  deleteProductImageById,
  createProductVariant,
  getProductVariants,
  getProductVariantById,
  updateProductVariant,
  deleteProductVariant
} from '../controllers/product.controller.js';
import { protect, authorize, optionalAuth } from '../middlewares/auth.middleware.js';
import { uploadProductMedia } from '../middlewares/upload.middleware.js';

const productRouter = Router();

// Bulk & Maintenance Endpoints
productRouter.post('/bulk', optionalAuth, createBulkProducts);
productRouter.post('/delete-many', optionalAuth, deleteMultipleProducts);
productRouter.delete('/bulk', optionalAuth, deleteMultipleProducts);
productRouter.delete('/clear-all', protect, authorize('admin'), clearAllProducts);

// Vendor-specific Products Endpoint (Must be declared before `/:id`)
productRouter.get('/my-products', protect, authorize('vendor', 'seller', 'admin'), getMyProducts);

// Product Variants Endpoints
productRouter.post(
  '/:productId/variants',
  protect,
  authorize('vendor', 'seller', 'admin'),
  createProductVariant
);
productRouter.get('/:productId/variants', getProductVariants);
productRouter.get('/:productId/variants/:variantId', getProductVariantById);
productRouter.patch(
  '/:productId/variants/:variantId',
  protect,
  authorize('vendor', 'seller', 'admin'),
  updateProductVariant
);
productRouter.delete(
  '/:productId/variants/:variantId',
  protect,
  authorize('vendor', 'seller', 'admin'),
  deleteProductVariant
);

// Product Image Management
productRouter.post(
  '/:id/images',
  protect,
  authorize('vendor', 'seller', 'admin'),
  uploadProductMedia,
  addProductImages
);
productRouter.delete(
  '/:id/images/:imageId',
  protect,
  authorize('vendor', 'seller', 'admin'),
  deleteProductImageById
);
productRouter.delete('/:id/images', deleteProductImage);

// Product Status Management
productRouter.patch(
  '/:id/status',
  protect,
  authorize('vendor', 'seller', 'admin'),
  updateProductStatus
);

// Public / Client & Admin Endpoints
productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', optionalAuth, uploadProductMedia, createProduct);
productRouter.put('/:id', protect, authorize('vendor', 'seller', 'admin'), uploadProductMedia, updateProduct);
productRouter.patch('/:id', protect, authorize('vendor', 'seller', 'admin'), uploadProductMedia, updateProduct);
productRouter.delete('/:id', protect, authorize('vendor', 'seller', 'admin'), deleteProduct);

export default productRouter;
