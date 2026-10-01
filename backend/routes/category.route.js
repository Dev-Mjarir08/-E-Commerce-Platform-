import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategoryTree,
  getCategoryByIdOrSlug,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
  bulkDeleteCategories,
  bulkCreateCategories,
  seedCategories
} from '../controllers/category.controller.js';
import { uploadCategoryImage } from '../middlewares/upload.middleware.js';

const categoryRouter = Router();

// Hierarchy Tree & Seeding Endpoints (defined before :id to prevent collision)
categoryRouter.get('/tree', getCategoryTree);
categoryRouter.post('/seed', seedCategories);
categoryRouter.post('/bulk', bulkCreateCategories);
categoryRouter.post('/bulk-delete', bulkDeleteCategories);
categoryRouter.delete('/bulk', bulkDeleteCategories);

// Primary CRUD Endpoints
categoryRouter.get('/', getCategories);
categoryRouter.get('/:id', getCategoryByIdOrSlug);
categoryRouter.post('/', uploadCategoryImage, createCategory);
categoryRouter.put('/:id', uploadCategoryImage, updateCategory);
categoryRouter.patch('/:id/status', toggleCategoryStatus);
categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;
