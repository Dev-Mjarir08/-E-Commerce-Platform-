import api from './api';

/**
 * Customer & Admin Customer Management API Service
 * Note: api.js response interceptor already returns response.data
 */
export const customerApi = {
  // --- Admin Customer APIs ---

  /**
   * Get all customers with search, tier, status & pagination
   * @param {Object} params - { search, tier, status, page, limit }
   */
  getAllCustomers: async (params = {}) => {
    return api.get('/admin/customers', { params });
  },

  /**
   * Get customer details by ID with order history & addresses
   * @param {string} id - Customer MongoDB ObjectId
   */
  getCustomerById: async (id) => {
    return api.get(`/admin/customers/${id}`);
  },

  /**
   * Update customer status (active, suspended, etc.)
   * @param {string} id - Customer ID
   * @param {string} status - New status
   */
  updateCustomerStatus: async (id, status) => {
    return api.put(`/admin/customers/${id}/status`, { status });
  },

  /**
   * Delete customer account
   * @param {string} id - Customer ID
   */
  deleteCustomer: async (id) => {
    return api.delete(`/admin/customers/${id}`);
  },

  // --- Customer Self-Service Profile APIs ---

  /**
   * Get logged-in customer's profile & stats
   */
  getProfile: async () => {
    return api.get('/customer/profile');
  },

  /**
   * Update personal profile information
   * @param {Object} profileData - { name, phone, avatar, coverImage }
   */
  updateProfile: async (profileData) => {
    return api.put('/customer/profile', profileData);
  },

  /**
   * Upload customer avatar image
   * @param {FormData} formData - Multipart data containing 'avatar'
   */
  uploadAvatar: async (formData) => {
    return api.post('/customer/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Upload customer cover banner image
   * @param {FormData} formData - Multipart data containing 'cover' or 'image'
   */
  uploadCover: async (formData) => {
    return api.post('/customer/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Change account password
   * @param {Object} passwordData - { currentPassword, newPassword }
   */
  changePassword: async (passwordData) => {
    return api.put('/customer/change-password', passwordData);
  }
};

export default customerApi;
