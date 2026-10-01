import { Router } from 'express';
import { createAdmin, getAllAdmins, getDashboardStats } from '../controllers/admin.controller.js';
import {
  getProducts,
  getProductById,
  createProduct,
  createBulkProducts,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
  clearAllProducts,
  deleteProductImage
} from '../controllers/product.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { uploadProductMedia } from '../middlewares/upload.middleware.js';

import {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  deleteCustomer
} from '../controllers/adminCustomer.controller.js';

import {
  getAllVendors,
  getVendorById,
  updateVendorStatus,
  deleteVendor
} from '../controllers/adminVendor.controller.js';

const adminRouter = Router();

// Live MongoDB Statistics
adminRouter.get('/stats', getDashboardStats);
adminRouter.get('/dashboard', getDashboardStats);

// Customer Management
adminRouter.get('/customers', getAllCustomers);
adminRouter.get('/customers/:id', getCustomerById);
adminRouter.put('/customers/:id/status', updateCustomerStatus);
adminRouter.delete('/customers/:id', deleteCustomer);

// Vendor & Tenant Management (Live MongoDB Data)
adminRouter.get('/vendors', getAllVendors);
adminRouter.get('/vendors/:id', getVendorById);
adminRouter.put('/vendors/:id/status', updateVendorStatus);
adminRouter.delete('/vendors/:id', deleteVendor);

// Bulk Operations (Batch Import, Multi-Delete, Clear-All)
adminRouter.post('/products/bulk', createBulkProducts);
adminRouter.post('/products/delete-many', deleteMultipleProducts);
adminRouter.delete('/products/bulk', deleteMultipleProducts);
adminRouter.delete('/products/clear-all', clearAllProducts);

// Admin Account Management
adminRouter.post('/create', createAdmin);
adminRouter.get('/', protect, authorize('admin'), getAllAdmins);

// Admin Product Catalog CRUD
adminRouter.get('/products', getProducts);
adminRouter.get('/products/:id', getProductById);
adminRouter.post('/products', uploadProductMedia, createProduct);
adminRouter.put('/products/:id', uploadProductMedia, updateProduct);
adminRouter.delete('/products/:id/images', deleteProductImage);
adminRouter.delete('/products/:id', deleteProduct);

export default adminRouter;
