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

  // Admin Registration
  async registerAdmin(adminData) {
    return api.post('/auth/admin/register', adminData);
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
  },

  // Password Recovery - Send OTP & Reset Link
  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  },

  // Verify OTP
  async verifyOtp({ email, otp }) {
    return api.post('/auth/verify-otp', { email, otp });
  },

  // Reset Password with OTP or Token
  async resetPassword({ email, otp, token, newPassword, password }) {
    return api.post('/auth/reset-password', {
      email,
      otp,
      token,
      newPassword: newPassword || password
    });
  }
};

export default authApi;
