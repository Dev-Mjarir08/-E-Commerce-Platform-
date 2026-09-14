import api from './api';

export const adminApi = {
  /**
   * Create / Register a new Admin account
   * @param {Object} adminData - { name, email, password, phone, secretKey }
   */
  async createAdmin(adminData) {
    return api.post('/admin/create', adminData);
  },

  /**
   * Get all registered administrators (Requires admin token)
   */
  async getAllAdmins() {
    return api.get('/admin');
  },

  /**
   * Get real-time dynamic dashboard metrics and recent products
   */
  async getDashboardStats() {
    return api.get('/admin/stats');
  },

  /**
   * Get all products for admin table
   * @param {Object} params - { search, category, store, sort, page, limit }
   */
  async getProducts(params = {}) {
    return api.get('/admin/products', { params });
  },

  /**
   * Get single product by ID or Slug
   */
  async getProductById(id) {
    return api.get(`/admin/products/${id}`);
  },

  /**
   * Create new product (Supports FormData with Multer file uploads or JSON)
   */
  async createProduct(productData) {
    const isFormData = productData instanceof FormData;
    return api.post('/admin/products', productData, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {});
  },

  /**
   * Update product (Supports FormData with Multer or JSON)
   */
  async updateProduct(id, productData) {
    const isFormData = productData instanceof FormData;
    return api.put(`/admin/products/${id}`, productData, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {});
  },

  /**
   * Remove specific image from product & delete from DB and storage
   */
  async deleteProductImage(productId, { imageUrl, imageId } = {}) {
    return api.delete(`/admin/products/${productId}/images`, {
      data: { imageUrl, imageId }
    });
  },

  /**
   * Delete product permanently and clean up all associated media
   */
  async deleteProduct(id) {
    return api.delete(`/admin/products/${id}`);
  },

  /**
   * Bulk create multiple products at once (supports 50+ products)
   * @param {Array|Object} products - Array of product objects or { products: [...] }
   */
  async createBulkProducts(products) {
    const payload = Array.isArray(products) ? { products } : products;
    return api.post('/admin/products/bulk', payload);
  },

  /**
   * One-click seed 50+ high-end luxury products into MongoDB
   */
  async seedFiftyProducts() {
    return api.post('/admin/products/seed-50');
  },

  /**
   * Delete multiple selected products at once (with disk media cleanup)
   * @param {Array<string>} ids - Array of product ObjectIds or slugs
   */
  async deleteMultipleProducts(ids) {
    return api.post('/admin/products/delete-many', { ids });
  },

  /**
   * Purge / clear all products from the catalog in database
   */
  async clearAllProducts() {
    return api.delete('/admin/products/clear-all');
  }
};

export default adminApi;

