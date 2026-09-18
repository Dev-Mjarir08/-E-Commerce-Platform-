import api from './api';

/**
 * Wishlist API Service for Customer Operations
 */
export const wishlistApi = {
  // Get customer wishlist
  getWishlist: async () => {
    return await api.get('/wishlist');
  },

  // Toggle item in wishlist (convenient 1-click toggle)
  toggleItem: async (productId) => {
    return await api.post('/wishlist/toggle', { productId });
  },

  // Add item to wishlist
  addItem: async (productId) => {
    return await api.post('/wishlist/items', { productId });
  },

  // Remove item from wishlist
  removeItem: async (productId) => {
    return await api.delete(`/wishlist/items/${productId}`);
  },

  // Clear entire wishlist
  clearWishlist: async () => {
    return await api.delete('/wishlist');
  }
};

export default wishlistApi;
