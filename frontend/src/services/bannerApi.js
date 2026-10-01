import api from './api';

export const bannerApi = {
  // Public: get banners (optional filter by placement)
  async getBanners(params = {}) {
    return api.get('/banners', { params });
  },

  // Public: register click on banner
  async recordClick(id) {
    return api.post(`/banners/${id}/click`);
  },

  // Admin: create banner
  async createBanner(bannerData) {
    return api.post('/admin/banners', bannerData);
  },

  // Admin: update banner
  async updateBanner(id, bannerData) {
    return api.put(`/admin/banners/${id}`, bannerData);
  },

  // Admin: delete banner
  async deleteBanner(id) {
    return api.delete(`/admin/banners/${id}`);
  }
};

export default bannerApi;
