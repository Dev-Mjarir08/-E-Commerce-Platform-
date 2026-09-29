import api from "./api";

export const adminApi = {
  /**
   * Create / Register a new Admin account
   * @param {Object} adminData - { name, email, password, phone, secretKey }
   */
  async createAdmin(adminData) {
    return api.post("/admin/create", adminData);
  },

  /**
   * Get all registered administrators (Requires admin token)
   */
  async getAllAdmins() {
    return api.get("/admin");
  },

  /**
   * Get real-time dynamic dashboard metrics and recent products
   */
  async getDashboardStats() {
    return api.get("/admin/stats");
  },

  /**
   * Get all marketplace orders for admin shipping/order management
   * @param {Object} params - { search, status, page, limit }
   */
  async getAdminOrders(params = {}) {
    return api.get("/orders/admin", { params });
  },

  /**
   * Update order status by Admin
   * @param {string} id - Order ID or orderNumber
   * @param {Object} statusData - { status: 'processing' | 'shipped' | 'delivered' | 'cancelled', reason?: string }
   */
  async updateOrderStatus(id, statusData) {
    return api.patch(`/orders/admin/${id}/status`, statusData);
  },

  /**
   * Get order details by ID or orderNumber
   * @param {string} id
   */
  async getOrderById(id) {
    return api.get(`/orders/${id}`);
  },

  /**
   * Get all live vendors from MongoDB
   * @param {Object} params - { search, status, page, limit }
   */
  async getAllVendors(params = {}) {
    return api.get("/admin/vendors", { params });
  },

  /**
   * Get single vendor details by ID
   */
  async getVendorById(id) {
    return api.get(`/admin/vendors/${id}`);
  },

  /**
   * Update vendor/store status (active, pending, suspended)
   */
  async updateVendorStatus(id, statusData) {
    return api.put(`/admin/vendors/${id}/status`, statusData);
  },

  /**
   * Deactivate/delete vendor
   */
  async deleteVendor(id) {
    return api.delete(`/admin/vendors/${id}`);
  },

  /**
   * Get all products for admin table
   * @param {Object} params - { search, category, store, sort, page, limit }
   */
  async getProducts(params = {}) {
    return api.get("/admin/products", { params });
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
    return api.post(
      "/admin/products",
      productData,
      isFormData
        ? {
            headers: { "Content-Type": "multipart/form-data" },
          }
        : {},
    );
  },

  /**
   * Update product (Supports FormData with Multer or JSON)
   */
  async updateProduct(id, productData) {
    const isFormData = productData instanceof FormData;
    return api.put(
      `/admin/products/${id}`,
      productData,
      isFormData
        ? {
            headers: { "Content-Type": "multipart/form-data" },
          }
        : {},
    );
  },

  /**
   * Remove specific image from product & delete from DB and storage
   */
  async deleteProductImage(productId, { imageUrl, imageId } = {}) {
    return api.delete(`/admin/products/${productId}/images`, {
      data: { imageUrl, imageId },
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
    return api.post("/admin/products/bulk", payload);
  },

  /**
   * Bulk create multiple categories at once
   * @param {Array|Object} categories - Array of category objects or { categories: [...] }
   */
  async createBulkCategories(categories) {
    const payload = Array.isArray(categories) ? { categories } : categories;
    return api.post("/categories/bulk", payload);
  },

  /**
   * One-click seed 50+ high-end luxury products into MongoDB
   */
  async seedFiftyProducts() {
    return api.post("/admin/products/seed-50");
  },

  /**
   * Delete multiple selected products at once (with disk media cleanup)
   * @param {Array<string>} ids - Array of product ObjectIds or slugs
   */
  async deleteMultipleProducts(ids) {
    return api.post("/admin/products/delete-many", { ids });
  },

  /**
   * Purge / clear all products from the catalog in database
   */
  async clearAllProducts() {
    return api.delete("/admin/products/clear-all");
  },

  /**
   * Get all notifications for admin
   */
  async getNotifications() {
    return api.get("/admin/notifications");
  },

  /**
   * Mark notification as read
   */
  async markNotificationRead(id) {
    return api.patch(`/admin/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead() {
    return api.patch("/admin/notifications/read-all");
  },

  /**
   * Delete notification
   */
  async deleteNotification(id) {
    return api.delete(`/admin/notifications/${id}`);
  },

  /**
   * Get all reviews for admin moderation
   * @param {Object} params - { search, status, rating, page, limit }
   */
  async getAdminReviews(params = {}) {
    return api.get("/reviews/admin", { params });
  },

  /**
   * Get single review details for admin
   */
  async getAdminReviewById(id) {
    return api.get(`/reviews/admin/${id}`);
  },

  /**
   * Update review moderation status
   * @param {string} id
   * @param {Object} statusData - { status }
   */
  async updateReviewStatus(id, statusData) {
    return api.patch(`/reviews/admin/${id}/status`, statusData);
  },
};

export default adminApi;