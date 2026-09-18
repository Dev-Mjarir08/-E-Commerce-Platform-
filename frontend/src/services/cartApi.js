import api from './api';

// Helper to get or generate persistent guest ID for unauthenticated visitors
const getGuestId = () => {
  try {
    let guestId = localStorage.getItem('atelier_guest_id');
    if (!guestId) {
      guestId = 'guest_' + Math.random().toString(36).substring(2, 11) + Date.now();
      localStorage.setItem('atelier_guest_id', guestId);
    }
    return guestId;
  } catch {
    return null;
  }
};

/**
 * Cart API Services for backend integration
 */
export const cartApi = {
  // Fetch current user's or guest's cart from backend
  getCart: async () => {
    try {
      const guestId = getGuestId();
      const response = await api.get('/cart', {
        headers: guestId ? { 'x-guest-id': guestId } : {}
      });
      return response.data;
    } catch (error) {
      console.warn('Backend cart API error:', error);
      return null;
    }
  },

  // Add item to backend cart
  addItem: async (itemData) => {
    const guestId = getGuestId();
    const response = await api.post('/cart/items', itemData, {
      headers: guestId ? { 'x-guest-id': guestId } : {}
    });
    return response;
  },

  // Update item quantity in backend cart
  updateItemQuantity: async (itemId, quantity) => {
    const guestId = getGuestId();
    const response = await api.put(`/cart/items/${itemId}`, { quantity }, {
      headers: guestId ? { 'x-guest-id': guestId } : {}
    });
    return response;
  },

  // Remove item from backend cart
  removeItem: async (itemId) => {
    const guestId = getGuestId();
    const response = await api.delete(`/cart/items/${itemId}`, {
      headers: guestId ? { 'x-guest-id': guestId } : {}
    });
    return response;
  },

  // Apply promo code via backend
  applyCoupon: async (code) => {
    const guestId = getGuestId();
    const response = await api.post('/cart/coupon', { code }, {
      headers: guestId ? { 'x-guest-id': guestId } : {}
    });
    return response;
  },

  // Remove applied promo code
  removeCoupon: async () => {
    const guestId = getGuestId();
    const response = await api.delete('/cart/coupon', {
      headers: guestId ? { 'x-guest-id': guestId } : {}
    });
    return response;
  },

  // Clear entire cart
  clearCart: async () => {
    const guestId = getGuestId();
    const response = await api.delete('/cart', {
      headers: guestId ? { 'x-guest-id': guestId } : {}
    });
    return response;
  },

  // Merge guest cart into user account upon sign-in
  mergeGuestCart: async () => {
    try {
      const guestId = localStorage.getItem('atelier_guest_id');
      if (!guestId) return null;
      const response = await api.post('/cart/merge', { guestId });
      localStorage.removeItem('atelier_guest_id');
      return response;
    } catch (error) {
      console.warn('Failed to merge guest bag:', error);
      return null;
    }
  }
};

export default cartApi;
