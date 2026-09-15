import api from './api';

/**
 * Cart API Services for backend integration
 */
export const cartApi = {
  // Fetch current user's cart from backend
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.warn('Backend cart API not active, falling back to local state:', error);
      return null;
    }
  },

  // Add item to backend cart
  addItem: async (itemData) => {
    try {
      const response = await api.post('/cart/items', itemData);
      return response.data;
    } catch (error) {
      console.warn('Backend cart addItem error:', error);
      throw error;
    }
  },

  // Update item quantity in backend cart
  updateItemQuantity: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.warn('Backend cart updateItemQuantity error:', error);
      throw error;
    }
  },

  // Remove item from backend cart
  removeItem: async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.warn('Backend cart removeItem error:', error);
      throw error;
    }
  },

  // Apply promo code via backend
  applyCoupon: async (code) => {
    try {
      const response = await api.post('/cart/coupon', { code });
      return response.data;
    } catch (error) {
      console.warn('Backend cart applyCoupon error:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      console.warn('Backend cart clearCart error:', error);
      throw error;
    }
  }
};

export default cartApi;
