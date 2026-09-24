import api from './api';

export const inventoryApi = {
  // GET /api/inventory - Product stock list with overview metrics
  async getInventory(params = {}) {
    return api.get('/inventory', { params });
  },

  // GET /api/inventory/low-stock - Products with low stock
  async getLowStock(params = {}) {
    return api.get('/inventory/low-stock', { params });
  },

  // GET /api/inventory/out-of-stock - Products out of stock
  async getOutOfStock(params = {}) {
    return api.get('/inventory/out-of-stock', { params });
  },

  // GET /api/inventory/:productId - Single product stock & variants
  async getProductInventory(productId) {
    return api.get(`/inventory/${productId}`);
  },

  // PATCH /api/inventory/:productId - Update product stock count
  async updateProductStock(productId, { stock, reason }) {
    return api.patch(`/inventory/${productId}`, { stock, reason });
  },

  // POST /api/inventory/:productId/restock - Restock product (+ quantity)
  async restockProduct(productId, { quantity, reason }) {
    return api.post(`/inventory/${productId}/restock`, { quantity, reason });
  },

  // GET /api/inventory/:productId/history - Inventory movement audit log
  async getInventoryHistory(productId) {
    return api.get(`/inventory/${productId}/history`);
  },

  // PATCH /api/inventory/:productId/variants/:variantId - Update variant stock count
  async updateVariantStock(productId, variantId, { stock, reason }) {
    return api.patch(`/inventory/${productId}/variants/${variantId}`, { stock, reason });
  },

  // POST /api/inventory/:productId/variants/:variantId/restock - Restock variant quantity
  async restockVariant(productId, variantId, { quantity, reason }) {
    return api.post(`/inventory/${productId}/variants/${variantId}/restock`, { quantity, reason });
  }
};

export default inventoryApi;
