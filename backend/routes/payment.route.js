import { Router } from 'express';
import express from 'express';
import {
  getStripeConfig,
  createPaymentIntent,
  createCheckoutSession,
  verifyPayment,
  stripeWebhook,
  getPaymentTransactions
} from '../controllers/payment.controller.js';
import { protect, optionalAuth, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Public: Get Stripe publishable key
router.get('/config', getStripeConfig);

// Admin: Get all transaction history and financial analytics
router.get('/transactions', protect, authorize('admin'), getPaymentTransactions);

// Create Payment Intent (protected with optionalAuth fallback so guest or user can pay)
router.post('/create-payment-intent', optionalAuth, createPaymentIntent);

// Create Hosted Checkout Session
router.post('/create-checkout-session', optionalAuth, createCheckoutSession);

// Verify Payment after checkout / redirect
router.post('/verify-payment', optionalAuth, verifyPayment);

// Stripe Webhook Endpoint (uses raw body parser for signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
