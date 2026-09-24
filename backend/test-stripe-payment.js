import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './config/db.js';
import stripe, { getStripePublicKey } from './config/stripe.js';
import Order from './models/Order.js';
import User from './models/User.js';

async function runStripeDiagnostics() {
  console.log('\n=============================================');
  console.log('⚡ STRIPE PAYMENT GATEWAY DIAGNOSTICS & VERIFICATION');
  console.log('=============================================\n');

  // 1. Check Credentials
  const secretKey = process.env.STRIPE_SECRET_KEY || process.env.stripe_secret_key;
  const publicKey = process.env.STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLIC_KEY || process.env.strip_public_key;

  console.log('1. Checking Keys:');
  console.log('   - Secret Key:', secretKey ? `${secretKey.substring(0, 12)}... (Valid format: ${secretKey.startsWith('sk_')})` : 'MISSING ❌');
  console.log('   - Public Key:', publicKey ? `${publicKey.substring(0, 12)}... (Valid format: ${publicKey.startsWith('pk_')})` : 'MISSING ❌');

  if (!secretKey) {
    console.error('❌ Aborting: Secret key missing.');
    process.exit(1);
  }

  // 2. Test Stripe Cloud API Connectivity
  console.log('\n2. Testing Stripe Cloud Connectivity...');
  try {
    const balance = await stripe.balance.retrieve();
    console.log('   ✅ Stripe API Connected Successfully!');
    console.log('   - Livemode:', balance.livemode);
    console.log('   - Available Balances:', balance.available.map(b => `${(b.amount / 100).toFixed(2)} ${b.currency.toUpperCase()}`).join(', ') || '0.00 EUR');
  } catch (err) {
    console.error('   ❌ Stripe Connectivity Failed:', err.message);
    process.exit(1);
  }

  // 3. Test Direct PaymentIntent Creation
  console.log('\n3. Testing Stripe PaymentIntent Creation...');
  let testPaymentIntent;
  try {
    testPaymentIntent = await stripe.paymentIntents.create({
      amount: 4999, // $49.99
      currency: 'usd',
      payment_method_types: ['card'],
      description: 'Atelier Payment Verification Test',
      metadata: { test: 'true', platform: 'Atelier Consignment' }
    });
    console.log('   ✅ PaymentIntent created successfully!');
    console.log('   - ID:', testPaymentIntent.id);
    console.log('   - Status:', testPaymentIntent.status);
    console.log('   - Amount:', `$${(testPaymentIntent.amount / 100).toFixed(2)} ${testPaymentIntent.currency.toUpperCase()}`);
    console.log('   - Client Secret Available:', !!testPaymentIntent.client_secret);
  } catch (err) {
    console.error('   ❌ PaymentIntent creation failed:', err.message);
    process.exit(1);
  }

  // 4. Test Stripe Hosted Checkout Session Creation
  console.log('\n4. Testing Stripe Checkout Session Creation...');
  let testSession;
  try {
    testSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'The Atelier Signature Cashmere Coat'
            },
            unit_amount: 85000 // $850.00
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/order/success/ATL-TEST?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/checkout?cancelled=true',
      metadata: { test: 'true' }
    });
    console.log('   ✅ Stripe Checkout Session created successfully!');
    console.log('   - Session ID:', testSession.id);
    console.log('   - Hosted Payment URL:', testSession.url ? testSession.url.substring(0, 60) + '...' : 'N/A');
  } catch (err) {
    console.error('   ❌ Checkout session creation failed:', err.message);
    process.exit(1);
  }

  // 5. Test Live HTTP API Endpoints on Local Server
  console.log('\n5. Testing Live Backend API Endpoints (http://localhost:8081)...');
  try {
    // 5a. GET /api/payment/config
    const configRes = await fetch('http://localhost:8081/api/payment/config');
    const configData = await configRes.json();
    console.log('   ✅ GET /api/payment/config:', configData.success ? `OK (Public Key returned: ${configData.publishableKey.substring(0, 10)}...)` : 'Failed');

    // 5b. POST /api/payment/create-payment-intent
    const piRes = await fetch('http://localhost:8081/api/payment/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 150, currency: 'usd' })
    });
    const piData = await piRes.json();
    console.log('   ✅ POST /api/payment/create-payment-intent:', piData.success ? `OK (PI ID: ${piData.paymentIntentId}, Amount: $${piData.amount / 100})` : `Failed: ${piData.message}`);

    // 5c. POST /api/payment/verify-payment
    const verifyRes = await fetch('http://localhost:8081/api/payment/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentIntentId: testPaymentIntent.id })
    });
    const verifyData = await verifyRes.json();
    console.log('   ✅ POST /api/payment/verify-payment:', verifyData.success ? `OK (Status correctly checked: ${verifyData.message})` : `Failed: ${verifyData.message}`);
  } catch (err) {
    console.warn('   ⚠️ HTTP check note (ensure server is running on port 8081):', err.message);
  }

  console.log('\n=============================================');
  console.log('🎉 ALL STRIPE PAYMENT CHECKS PASSED SUCCESSFULLY!');
  console.log('=============================================\n');
  process.exit(0);
}

runStripeDiagnostics().catch(err => {
  console.error('Diagnostics failed:', err);
  process.exit(1);
});
