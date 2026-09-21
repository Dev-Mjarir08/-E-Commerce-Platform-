import { Router } from 'express';
import {
  getInventory,
  getLowStockInventory,
  getOutOfStockInventory,
  getProductInventory,
  updateProductStock,
  restockProduct,
  getProductInventoryHistory,
  updateVariantStock,
  restockVariant
} from '../controllers/inventory.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const inventoryRouter = Router();

inventoryRouter.use(protect);
inventoryRouter.use(authorize('vendor', 'seller', 'admin'));

// Summary & Status Queries (Must be declared before `/:productId`)
inventoryRouter.get('/', getInventory);
inventoryRouter.get('/low-stock', getLowStockInventory);
inventoryRouter.get('/out-of-stock', getOutOfStockInventory);

// Product Stock & History Operations
inventoryRouter.get('/:productId', getProductInventory);
inventoryRouter.patch('/:productId', updateProductStock);
inventoryRouter.post('/:productId/restock', restockProduct);
inventoryRouter.get('/:productId/history', getProductInventoryHistory);

// Variant-specific Stock Operations
inventoryRouter.patch('/:productId/variants/:variantId', updateVariantStock);
inventoryRouter.post('/:productId/variants/:variantId/restock', restockVariant);

export default inventoryRouter;
