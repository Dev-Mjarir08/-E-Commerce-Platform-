import api from './api';
import { products as fallbackProducts } from '../data/products';

export const productApi = {
  /**
   * Get public products catalog
   * @param {Object} params - { search, category, store, sort, page, limit }
   */
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.warn('Backend product API fetch fallback:', error);
      // Fallback to local products dataset if backend error
      let filtered = [...fallbackProducts];
      if (params.category && params.category !== 'all') {
        filtered = filtered.filter((p) => p.category?.toLowerCase() === params.category.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.fabric?.toLowerCase().includes(q)
        );
      }
      return { success: true, count: filtered.length, data: filtered, products: filtered };
    }
  },

  /**
   * Get single product by ID or Slug
   */
  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Backend product single fetch fallback:', error);
      const found = fallbackProducts.find((p) => p.id === id || p._id === id || p.slug === id);
      return { success: true, data: found, product: found };
    }
  }
};

export default productApi;
