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
  }
};

export default storeApi;
