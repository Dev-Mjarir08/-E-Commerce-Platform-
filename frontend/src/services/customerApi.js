import api from './api';

/**
 * Customer Profile & Settings API Service
 */
export const customerApi = {
  // Get customer profile and dashboard summary stats
  getProfile: async () => {
    return await api.get('/customer/profile');
  },

  // Update personal profile information
  updateProfile: async (profileData) => {
    return await api.put('/customer/profile', profileData);
  },

  // Change account password
  changePassword: async (passwordData) => {
    return await api.put('/customer/change-password', passwordData);
  }
};

export default customerApi;
