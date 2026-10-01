import api from './api';

export const brandApi = {
  // Public / Admin: get brands list
  async getBrands(params = {}) {
    return api.get('/brands', { params });
  },

  // Admin: create brand
  async createBrand(brandData) {
    return api.post('/admin/brands', brandData);
  },

  // Admin: update brand
  async updateBrand(id, brandData) {
    return api.put(`/admin/brands/${id}`, brandData);
  },

  // Admin: delete brand
  async deleteBrand(id) {
    return api.delete(`/admin/brands/${id}`);
  }
};

export default brandApi;
