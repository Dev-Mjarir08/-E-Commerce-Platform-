import api from './api';

/**
 * Store Service for Multi-Tenant E-Commerce SaaS
 */
export const storeService = {
  // GET /api/stores
  async getStores(params = {}) {
    try {
      const res = await api.get('/stores', { params });
      return res.data?.data || res.data?.stores || (Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn('getStores error:', err);
      return [];
    }
  },

  // GET /api/stores/:slug
  async getStoreBySlug(slug) {
    try {
      const res = await api.get(`/stores/slug/${slug}`);
      return res.data?.data || res.data?.store || res.data || null;
    } catch {
      return null;
    }
  },

  // GET /api/stores/:slug/products
  async getStoreProducts(slug) {
    try {
      const res = await api.get('/products', { params: { store: slug } });
      return res.data?.data || res.data?.products || [];
    } catch {
      return [];
    }
  }
};

export default storeService;
