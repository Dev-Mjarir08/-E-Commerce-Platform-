import { stores } from '../data/stores';
import { products } from '../data/products';

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
    // For mock demonstration, all products or filtered products are returned
    return Promise.resolve([...products]);
  }
};
