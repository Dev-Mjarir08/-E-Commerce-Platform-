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

  // Get real-time verified shipping tracking timeline
  getTracking: async (orderIdOrTracking) => {
    return api.get(`/orders/track/${orderIdOrTracking}`);
  },

  // Update order status by Admin/Vendor
  updateOrderStatus: async (orderId, statusData) => {
    const payload = typeof statusData === 'string' ? { status: statusData } : statusData;
    return api.patch(`/orders/admin/${orderId}/status`, payload);
  },

  // Update order shipping status and tracking
  updateShipping: async (orderId, shippingData) => {
    return api.patch(`/orders/admin/${orderId}/shipping`, shippingData);
  },
};

export default orderApi;
