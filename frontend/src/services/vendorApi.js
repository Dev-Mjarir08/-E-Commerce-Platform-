import api from './api';

export const vendorApi = {
  // Get Vendor profile and store metrics
  async getProfile() {
    return api.get('/vendors/me');
  },

  // Update Vendor profile & store details
  async updateProfile(profileData) {
    return api.patch('/vendors/me', profileData);
  },

  // Change Vendor password
  async changePassword({ currentPassword, newPassword }) {
    return api.patch('/vendors/me/change-password', { currentPassword, newPassword });
  },

  // Upload Vendor avatar (supports FormData or JSON { avatarUrl })
  async uploadAvatar(data) {
    const isFormData = data instanceof FormData;
    return api.post('/vendors/me/avatar', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  }
};

export default vendorApi;
