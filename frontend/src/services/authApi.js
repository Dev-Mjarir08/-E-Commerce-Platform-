import api from './api';

export const authApi = {
  // Login (returns { success, message, data: { user, accessToken, refreshToken } })
  async login({ email, password }) {
    return api.post('/auth/login', { email, password });
  },

  // Customer Registration
  async register({ name, email, password, phone }) {
    return api.post('/auth/register', { name, email, password, phone });
  },

  // Vendor Registration
  async registerVendor(vendorData) {
    return api.post('/auth/vendor/register', vendorData);
  },

  // Get Current Authenticated Profile via JWT
  async getMe() {
    return api.get('/auth/me');
  },

  // Logout
  async logout() {
    try {
      return await api.post('/auth/logout');
    } catch {
      // Even if backend logout fails, client will clear local session
      return { success: true };
    }
  },

  // Refresh Token
  async refreshToken(refreshToken) {
    return api.post('/auth/refresh-token', { refreshToken });
  }
};

export default authApi;
