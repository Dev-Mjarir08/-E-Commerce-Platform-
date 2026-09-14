import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  createBulkProducts,
  seedFiftyProducts,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
  clearAllProducts,
  deleteProductImage
} from '../controllers/product.controller.js';
import { uploadProductMedia } from '../middlewares/upload.middleware.js';

const productRouter = Router();

// Bulk & Maintenance Endpoints
productRouter.post('/bulk', createBulkProducts);
productRouter.post('/seed-50', seedFiftyProducts);
productRouter.post('/delete-many', deleteMultipleProducts);
productRouter.delete('/bulk', deleteMultipleProducts);
productRouter.delete('/clear-all', clearAllProducts);

// Public / Client & Admin Endpoints
productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', uploadProductMedia, createProduct);
productRouter.put('/:id', uploadProductMedia, updateProduct);
productRouter.delete('/:id/images', deleteProductImage);
productRouter.delete('/:id', deleteProduct);

export default productRouter;
