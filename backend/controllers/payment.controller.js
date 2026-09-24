import mongoose from 'mongoose';
import stripe, { getStripePublicKey } from '../config/stripe.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';

/**
 * @desc    Get Stripe Publishable Key for frontend initialization
 * @route   GET /api/payment/config
 * @access  Public
 */
export const getStripeConfig = async (req, res) => {
  try {
    const publishableKey = getStripePublicKey();
    return res.status(200).json({
      success: true,
      publishableKey
    });
  } catch (error) {
    console.error('Error fetching Stripe config:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment configuration.',
      error: error.message
    });
  }
};

/**
 * @desc    Create Stripe PaymentIntent
 * @route   POST /api/payment/create-payment-intent
 * @access  Protected / Optional Auth
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId, amount: manualAmount, currency = 'usd' } = req.body;
    const userId = req.user ? req.user._id : null;

    let finalAmountInCents = 0;
    let orderDoc = null;

    if (orderId) {
      const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
      const query = isMongoId
        ? { _id: orderId }
        : { orderNumber: orderId.toUpperCase().trim() };

      orderDoc = await Order.findOne(query);
      if (!orderDoc) {
        return res.status(404).json({
          success: false,
          message: `Order ${orderId} not found.`
        });
      }

      // If user is authenticated, ensure order belongs to them (or user is admin)
      if (userId && orderDoc.user.toString() !== userId.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to initialize payment for this order.'
        });
      }

      finalAmountInCents = Math.round(orderDoc.totalPrice * 100);
    } else if (manualAmount) {
      finalAmountInCents = Math.round(Number(manualAmount) * 100);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either orderId or amount must be provided.'
      });
    }

    // Stripe requires at least 50 cents
    if (finalAmountInCents < 50) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be at least $0.50.'
      });
    }

    const metadata = {
      orderId: orderDoc ? orderDoc._id.toString() : '',
      orderNumber: orderDoc ? orderDoc.orderNumber : '',
      userId: userId ? userId.toString() : ''
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmountInCents,
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      metadata,
      description: orderDoc ? `Consignment Order ${orderDoc.orderNumber}` : 'Luxury Atelier Purchase'
    });

    if (orderDoc) {
      orderDoc.stripePaymentIntentId = paymentIntent.id;
      await orderDoc.save();
    }

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: finalAmountInCents,
      currency: currency.toLowerCase(),
      orderId: orderDoc?._id || null,
      orderNumber: orderDoc?.orderNumber || null
    });
  } catch (error) {
    console.error('Error in createPaymentIntent:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment intent.',
      error: error.message
    });
  }
};

/**
 * @desc    Create Stripe Hosted Checkout Session (Redirect flow)
 * @route   POST /api/payment/create-checkout-session
 * @access  Protected / Optional Auth
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { orderId, successUrl, cancelUrl } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required to create a checkout session.'
      });
    }

    const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
    const query = isMongoId
      ? { _id: orderId }
      : { orderNumber: orderId.toUpperCase().trim() };

    const orderDoc = await Order.findOne(query);
    if (!orderDoc) {
      return res.status(404).json({
        success: false,
        message: `Order ${orderId} not found.`
      });
    }

    if (userId && orderDoc.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for this order consignment.'
      });
    }

    const orderItems = await OrderItem.find({ order: orderDoc._id }).populate('product');

    // Build line items for Stripe Checkout
    let lineItems = [];

    if (orderItems.length > 0 && orderDoc.discountAmount === 0) {
      // Itemized list if no global coupon discount was applied
      lineItems = orderItems.map((item) => {
        const itemImage = item.image && item.image.startsWith('http') ? [item.image] : [];
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name || 'Consignment Item',
              images: itemImage
            },
            unit_amount: Math.round(item.price * 100)
          },
          quantity: item.quantity
        };
      });

      if (orderDoc.shippingPrice > 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'White-Glove Courier Logistics'
            },
            unit_amount: Math.round(orderDoc.shippingPrice * 100)
          },
          quantity: 1
        });
      }

      if (orderDoc.taxPrice > 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Applicable Duties & Consignment Tax'
            },
            unit_amount: Math.round(orderDoc.taxPrice * 100)
          },
          quantity: 1
        });
      }
    } else {
      // Consolidated order total ensures exact total matching
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Order ${orderDoc.orderNumber} - Atelier Curated Acquisition`,
              description: `Includes ${orderItems.length} consigned item(s), logistics, and applicable taxes.`
            },
            unit_amount: Math.round(orderDoc.totalPrice * 100)
          },
          quantity: 1
        }
      ];
    }

    const clientOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
    const finalSuccessUrl = successUrl || `${clientOrigin}/order/success/${orderDoc.orderNumber || orderDoc._id}?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${clientOrigin}/checkout?cancelled=true&orderId=${orderDoc._id}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      client_reference_id: orderDoc._id.toString(),
      metadata: {
        orderId: orderDoc._id.toString(),
        orderNumber: orderDoc.orderNumber,
        userId: userId ? userId.toString() : ''
      }
    });

    orderDoc.stripeSessionId = session.id;
    await orderDoc.save();

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
      orderId: orderDoc._id,
      orderNumber: orderDoc.orderNumber
    });
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create checkout session.',
      error: error.message
    });
  }
};

/**
 * @desc    Verify Stripe Payment Status (after redirect or client completion)
 * @route   POST /api/payment/verify-payment
 * @access  Protected / Optional Auth
 */
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId, sessionId } = req.body;

    if (!orderId && !paymentIntentId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Must provide orderId, paymentIntentId, or sessionId to verify.'
      });
    }

    let orderDoc = null;
    if (orderId) {
      const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
      const query = isMongoId
        ? { _id: orderId }
        : { orderNumber: orderId.toUpperCase().trim() };
      orderDoc = await Order.findOne(query);
    } else if (sessionId) {
      orderDoc = await Order.findOne({ stripeSessionId: sessionId });
    } else if (paymentIntentId) {
      orderDoc = await Order.findOne({ stripePaymentIntentId: paymentIntentId });
    }

    let isPaid = false;
    let paymentDetails = null;

    // 1. Verify via Stripe Checkout Session
    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === 'paid') {
        isPaid = true;
        paymentDetails = {
          id: session.id,
          status: session.payment_status,
          update_time: new Date().toISOString(),
          email_address: session.customer_details?.email || ''
        };

        if (orderDoc) {
          orderDoc.paymentStatus = 'paid';
          if (session.payment_intent) {
            orderDoc.stripePaymentIntentId = String(session.payment_intent);
          }
          orderDoc.paymentResult = paymentDetails;
          if (orderDoc.orderStatus === 'placed') {
            orderDoc.orderStatus = 'confirmed';
          }
          await orderDoc.save();
        }
      }
    }

    // 2. Verify via Stripe PaymentIntent
    if (!isPaid && (paymentIntentId || orderDoc?.stripePaymentIntentId)) {
      const pId = paymentIntentId || orderDoc.stripePaymentIntentId;
      const paymentIntent = await stripe.paymentIntents.retrieve(pId);

      if (paymentIntent.status === 'succeeded') {
        isPaid = true;
        paymentDetails = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: paymentIntent.receipt_email || ''
        };

        if (orderDoc) {
          orderDoc.paymentStatus = 'paid';
          orderDoc.paymentResult = paymentDetails;
          if (orderDoc.orderStatus === 'placed') {
            orderDoc.orderStatus = 'confirmed';
          }
          await orderDoc.save();
        }
      }
    }

    if (!orderDoc) {
      return res.status(200).json({
        success: true,
        isPaid,
        paymentDetails,
        message: isPaid ? 'Payment confirmed by Stripe.' : 'Payment pending confirmation.'
      });
    }

    return res.status(200).json({
      success: true,
      isPaid: orderDoc.paymentStatus === 'paid',
      message: orderDoc.paymentStatus === 'paid' ? 'Payment confirmed and order verified.' : 'Payment pending confirmation.',
      data: {
        orderId: orderDoc._id,
        orderNumber: orderDoc.orderNumber,
        paymentStatus: orderDoc.paymentStatus,
        orderStatus: orderDoc.orderStatus,
        paymentResult: orderDoc.paymentResult
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify payment status.',
      error: error.message
    });
  }
};

/**
 * @desc    Stripe Webhook Listener
 * @route   POST /api/payment/webhook
 * @access  Public (Stripe signature checked)
 */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // In development or when webhook secret is not set, parse payload directly
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId || session.client_reference_id;
        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'paid',
            orderStatus: 'confirmed',
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent ? String(session.payment_intent) : null,
            paymentResult: {
              id: session.id,
              status: session.payment_status,
              update_time: new Date().toISOString(),
              email_address: session.customer_details?.email || ''
            }
          });
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;
        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'paid',
            orderStatus: 'confirmed',
            stripePaymentIntentId: paymentIntent.id,
            paymentResult: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: new Date().toISOString(),
              email_address: paymentIntent.receipt_email || ''
            }
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;
        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'failed'
          });
        }
        break;
      }

      default:
        // Other event types
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling Stripe webhook event:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
