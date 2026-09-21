import api from './api';

export const vendorApi = {
  // --- Vendor Profile Management ---
  async getProfile() {
    return api.get('/vendors/me');
  },

  async updateProfile(profileData) {
    return api.patch('/vendors/me', profileData);
  },

  async changePassword({ currentPassword, newPassword }) {
    return api.patch('/vendors/me/change-password', { currentPassword, newPassword });
  },

  async uploadAvatar(data) {
    const isFormData = data instanceof FormData;
    return api.post('/vendors/me/avatar', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },

  // --- Vendor Orders ---
  async getOrders(params = {}) {
    return api.get('/vendor/orders', { params });
  },

  async getOrderById(orderId) {
    return api.get(`/vendor/orders/${orderId}`);
  },

  async updateOrderStatus(orderId, status) {
    return api.patch(`/vendor/orders/${orderId}/status`, { status });
  },

  // --- Vendor Customers ---
  async getCustomers(params = {}) {
    return api.get('/vendor/customers', { params });
  },

  async getCustomerById(customerId) {
    return api.get(`/vendor/customers/${customerId}`);
  },

  // --- Vendor Analytics ---
  async getAnalyticsOverview() {
    return api.get('/vendor/analytics/overview');
  },

  async getAnalyticsRevenue(params = {}) {
    return api.get('/vendor/analytics/revenue', { params });
  },

  async getAnalyticsOrders(params = {}) {
    return api.get('/vendor/analytics/orders', { params });
  },

  async getAnalyticsProducts(params = {}) {
    return api.get('/vendor/analytics/products', { params });
  },

  async getAnalyticsCustomers(params = {}) {
    return api.get('/vendor/analytics/customers', { params });
  },

  async getAnalyticsSales(params = {}) {
    return api.get('/vendor/analytics/sales', { params });
  },

  // --- Vendor Reviews ---
  async getReviews(params = {}) {
    return api.get('/vendor/reviews', { params });
  },

  async getReviewById(reviewId) {
    return api.get(`/vendor/reviews/${reviewId}`);
  },

  async updateReview(reviewId, updateData) {
    return api.patch(`/vendor/reviews/${reviewId}`, updateData);
  },

  async deleteReview(reviewId) {
    return api.delete(`/vendor/reviews/${reviewId}`);
  },

  // --- Vendor Notifications ---
  async getNotifications(params = {}) {
    return api.get('/vendor/notifications', { params });
  },

  async markNotificationRead(notificationId) {
    return api.patch(`/vendor/notifications/${notificationId}/read`);
  },

  async markAllNotificationsRead() {
    return api.patch('/vendor/notifications/read-all');
  }
};

export default vendorApi;
