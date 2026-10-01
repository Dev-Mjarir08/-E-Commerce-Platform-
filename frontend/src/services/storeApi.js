import api from './api';

export const storeApi = {
  // POST /api/stores - Create vendor store
  async createStore(storeData) {
    return api.post('/stores', storeData);
  },

  // GET /api/stores/my-store - Get current vendor store
  async getMyStore() {
    return api.get('/stores/my-store');
  },

  // PATCH /api/stores/my-store - Update current vendor store
  async updateMyStore(storeData) {
    return api.patch('/stores/my-store', storeData);
  },

  // PATCH /api/stores/my-store/logo - Upload/update store logo
  async updateStoreLogo(data) {
    const isFormData = data instanceof FormData;
    return api.patch('/stores/my-store/logo', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },

  // PATCH /api/stores/my-store/banner - Upload/update store banner
  async updateStoreBanner(data) {
    const isFormData = data instanceof FormData;
    return api.patch('/stores/my-store/banner', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },

  // GET /api/stores/my-store/settings - Get operational settings
  async getStoreSettings() {
    return api.get('/stores/my-store/settings');
  },

  // PATCH /api/stores/my-store/settings - Update operational settings
  async updateStoreSettings(settingsData) {
    return api.patch('/stores/my-store/settings', settingsData);
  },

  // GET /api/stores - Admin: Get all stores
  async getAllStores() {
    return api.get('/stores');
  },

  // GET /api/stores/:id - Admin: Get single store
  async getStoreById(id) {
    return api.get(`/stores/${id}`);
  },

  // PATCH /api/stores/:id - Admin: Update store
  async updateStore(id, storeData) {
    return api.patch(`/stores/${id}`, storeData);
  },

  // DELETE /api/stores/:id - Admin: Delete store
  async deleteStore(id) {
    return api.delete(`/stores/${id}`);
  },

  // PATCH /api/stores/:id/status - Admin: Update store status
  async updateStoreStatus(id, status) {
    return api.patch(`/stores/${id}/status`, { status });
  },

  // PATCH /api/stores/:id/verification - Admin: Update store verification
  async updateStoreVerification(id, isVerified) {
    return api.patch(`/stores/${id}/verification`, { isVerified });
  },

  // Public: Get stores with optional query params
  async getStores(params = {}) {
    try {
      const res = await api.get('/stores', { params });
      return res.data?.data || res.data?.stores || res.data || (Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn('getStores error:', err);
      return [];
    }
  },

  // Public: Get store by slug
  async getStoreBySlug(slug) {
    try {
      const res = await api.get(`/stores/slug/${slug}`);
      return res.data?.data || res.data?.store || res.data || null;
    } catch {
      return null;
    }
  },

  // Public: Get products for a store by slug
  async getStoreProducts(slug) {
    try {
      const res = await api.get('/products', { params: { store: slug } });
      return res.data?.data || res.data?.products || (Array.isArray(res) ? res : []);
    } catch {
      return [];
    }
  }
};

export default storeApi;