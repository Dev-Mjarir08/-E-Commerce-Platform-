import api from './api';

/**
 * Order API Service for Customer Operations
 */
export const orderApi = {
  // Place a new order
  createOrder: async (orderPayload) => {
    return await api.post('/orders', orderPayload);
  },

  // Get user's orders with optional status & pagination
  getMyOrders: async (params = {}) => {
    return await api.get('/orders', { params });
  },

  // Get single order details by ID or orderNumber
  getOrderById: async (orderId) => {
    return await api.get(`/orders/${orderId}`);
  },

  // Cancel order
  cancelOrder: async (orderId, reason) => {
    return await api.patch(`/orders/${orderId}/cancel`, { reason });
  }
};

export default orderApi;
