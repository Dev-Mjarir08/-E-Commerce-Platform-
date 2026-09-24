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
  },

  // ==========================================
  // VENDOR PRODUCT MANAGEMENT
  // ==========================================

  // GET /api/products/my-products - Fetch vendor store products
  async getMyProducts(params = {}) {
    return api.get('/products/my-products', { params });
  },

  // POST /api/products - Create new product
  async createProduct(productData) {
    const isFormData = productData instanceof FormData;
    return api.post('/products', productData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },

  // PATCH /api/products/:id - Update product
  async updateProduct(id, productData) {
    const isFormData = productData instanceof FormData;
    return api.patch(`/products/${id}`, productData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },

  // PATCH /api/products/:id/status - Toggle/update product active status
  async updateProductStatus(id, statusData) {
    return api.patch(`/products/${id}/status`, statusData);
  },

  // DELETE /api/products/:id - Delete product
  async deleteProduct(id) {
    return api.delete(`/products/${id}`);
  },

  // POST /api/products/:id/images - Upload/append images to product
  async uploadProductImages(id, imageData) {
    const isFormData = imageData instanceof FormData;
    return api.post(`/products/${id}/images`, imageData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },

  // DELETE /api/products/:id/images/:imageId - Delete image from product
  async deleteProductImage(id, imageId) {
    return api.delete(`/products/${id}/images/${imageId}`);
  },

  // ==========================================
  // PRODUCT VARIANTS MANAGEMENT
  // ==========================================

  // GET /api/products/:productId/variants - Get product variants
  async getProductVariants(productId) {
    return api.get(`/products/${productId}/variants`);
  },

  // POST /api/products/:productId/variants - Create variant
  async createProductVariant(productId, variantData) {
    return api.post(`/products/${productId}/variants`, variantData);
  },

  // PATCH /api/products/:productId/variants/:variantId - Update variant
  async updateProductVariant(productId, variantId, variantData) {
    return api.patch(`/products/${productId}/variants/${variantId}`, variantData);
  },

  // DELETE /api/products/:productId/variants/:variantId - Delete variant
  async deleteProductVariant(productId, variantId) {
    return api.delete(`/products/${productId}/variants/${variantId}`);
  }
};

export default productApi;
