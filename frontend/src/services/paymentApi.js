import api from './api';

/**
 * Stripe Payment API Service
 */
export const paymentApi = {
  // Get public Stripe configuration
  getConfig: async () => {
    return await api.get('/payment/config');
  },

  // Create a Stripe PaymentIntent
  createPaymentIntent: async (payload) => {
    return await api.post('/payment/create-payment-intent', payload);
  },

  // Create a hosted Stripe Checkout Session (for seamless redirect)
  createCheckoutSession: async (payload) => {
    return await api.post('/payment/create-checkout-session', payload);
  },

  // Verify payment status (by orderId, sessionId, or paymentIntentId)
  verifyPayment: async (payload) => {
    return await api.post('/payment/verify-payment', payload);
  }
};

export default paymentApi;
