import { stores } from '../data/stores';
import api from './api';

/**
 * Store Service for Multi-Tenant E-Commerce SaaS
 * Ready for GET /api/stores integration
 */
export const storeService = {
  // GET /api/stores
  async getStores() {
    return Promise.resolve([...stores]);
  },

  // GET /api/stores/:slug
  async getStoreBySlug(slug) {
    const store = stores.find(s => s.slug === slug);
    return Promise.resolve(store || null);
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
