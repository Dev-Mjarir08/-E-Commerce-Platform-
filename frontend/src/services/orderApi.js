import api from "./api";

/**
 * Order API Service
 */
export const orderApi = {
  // Admin: get all marketplace orders
  getAdminOrders: async (params = {}) => {
    return api.get("/orders/admin", {
      params,
    });
  },

  // Place a new order
  createOrder: async (orderPayload) => {
    return api.post("/orders", orderPayload);
  },

  // Get logged-in customer's orders
  getMyOrders: async (params = {}) => {
    return api.get("/orders", {
      params,
    });
  },

  // Get single order details
  // Admin can also access this endpoint
  getOrderById: async (orderId) => {
    return api.get(`/orders/${orderId}`);
  },

  // Cancel customer order
  cancelOrder: async (orderId, reason) => {
    return api.patch(`/orders/${orderId}/cancel`, { reason });
  },
};

export default orderApi;
