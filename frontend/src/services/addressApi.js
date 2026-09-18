import api from './api';

/**
 * Address API Service for Customer Operations
 */
export const addressApi = {
  // Get all addresses for logged-in user
  getAddresses: async () => {
    return await api.get('/addresses');
  },

  // Get single address
  getAddressById: async (id) => {
    return await api.get(`/addresses/${id}`);
  },

  // Create new address
  createAddress: async (addressData) => {
    return await api.post('/addresses', addressData);
  },

  // Update existing address
  updateAddress: async (id, addressData) => {
    return await api.put(`/addresses/${id}`, addressData);
  },

  // Delete address
  deleteAddress: async (id) => {
    return await api.delete(`/addresses/${id}`);
  },

  // Set default shipping or billing
  setDefaultAddress: async (id, type = 'shipping') => {
    return await api.patch(`/addresses/${id}/default`, { type });
  }
};

export default addressApi;
