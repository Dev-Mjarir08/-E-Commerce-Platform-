import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.stripe_secret_key;
const stripePublicKey = process.env.STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLIC_KEY || process.env.strip_public_key;

if (!stripeSecretKey) {
  console.warn('⚠️ Stripe secret key not found in environment variables (STRIPE_SECRET_KEY or stripe_secret_key)');
}

export const stripe = new Stripe(stripeSecretKey || '');

export const getStripePublicKey = () => stripePublicKey || '';

export default stripe;
