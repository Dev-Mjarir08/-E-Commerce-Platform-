import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

/**
 * Helper: Recalculate cart totals based on items and applied coupon
 */
const recalculateCart = async (cart) => {
  let subtotal = 0;

  for (const item of cart.items) {
    subtotal += item.price * item.quantity;
  }

  let discountAmount = 0;
  if (cart.coupon) {
    const coupon = await Coupon.findById(cart.coupon);
    if (coupon && coupon.isActive && new Date() <= new Date(coupon.expiryDate)) {
      if (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
          }
        } else if (coupon.discountType === 'fixed') {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
      } else {
        // Condition no longer met, remove coupon
        cart.coupon = null;
      }
    } else {
      cart.coupon = null;
    }
  }

  cart.discountAmount = Math.max(0, Math.round(discountAmount * 100) / 100);
  const freeShippingThreshold = 999;
  const shippingCost = subtotal > 0 && subtotal < freeShippingThreshold ? 99 : 0;
  cart.totalAmount = Math.max(0, Math.round((subtotal - cart.discountAmount + shippingCost) * 100) / 100);

  return cart;
};

/**
 * Helper: Find or create cart for user or guest
 */
const getOrCreateCart = async (userId, guestId) => {
  let cart = null;
  if (userId) {
    cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
  } else if (guestId) {
    cart = await Cart.findOne({ guestId });
    if (!cart) {
      cart = await Cart.create({ guestId, items: [] });
    }
  }
  return cart;
};

/**
 * @desc    Get user or guest cart
 * @route   GET /api/cart
 * @access  Public / Protected (supports optional JWT or guestId header/query)
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const guestId = req.headers['x-guest-id'] || req.query.guestId;

    if (!userId && !guestId) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          coupon: null,
          subtotal: 0,
          discountAmount: 0,
          shippingCost: 0,
          totalAmount: 0,
          itemCount: 0
        }
      });
    }

    let cart = await Cart.findOne(userId ? { user: userId } : { guestId })
      .populate({
        path: 'items.product',
        select: 'title slug basePrice discountPrice images stock store category isAvailable'
      })
      .populate('items.store', 'name slug logo')
      .populate('coupon', 'code discountType discountValue minOrderAmount maxDiscountAmount');

    if (!cart) {
      cart = await getOrCreateCart(userId, guestId);
    }

    // Filter out items whose product was removed from the database
    const initialItemLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.product != null);
    if (cart.items.length !== initialItemLength) {
      await recalculateCart(cart);
      await cart.save();
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const freeShippingThreshold = 999;
    const shippingCost = subtotal > 0 && subtotal < freeShippingThreshold ? 99 : 0;
    const totalItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return res.status(200).json({
      success: true,
      data: {
        _id: cart._id,
        items: cart.items,
        coupon: cart.coupon,
        subtotal,
        discountAmount: cart.discountAmount || 0,
        shippingCost,
        totalAmount: cart.totalAmount || (subtotal - (cart.discountAmount || 0) + shippingCost),
        itemCount: totalItemCount
      }
    });
  } catch (error) {
    console.error('Error in getCart:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve shopping cart.',
      error: error.message
    });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Public / Protected
 */
export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const guestId = req.headers['x-guest-id'] || req.body.guestId;
    const { productId, variantId, quantity = 1, size, color } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    if (!product.isAvailable || product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: product.stock < quantity
          ? `Requested quantity exceeds available stock (${product.stock} left).`
          : 'Product is currently unavailable.'
      });
    }

    let cart = await getOrCreateCart(userId, guestId);
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: 'Unable to identify client session or guest id.'
      });
    }

    const itemPrice = product.discountPrice != null && product.discountPrice > 0
      ? product.discountPrice
      : product.basePrice;

    // Check if matching item exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString() &&
        (variantId ? item.variant?.toString() === variantId.toString() : true)
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + Number(quantity);
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Total in cart would exceed available stock (${product.stock}).`
        });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = itemPrice;
    } else {
      cart.items.push({
        product: product._id,
        variant: variantId || null,
        store: product.store,
        quantity: Number(quantity),
        price: itemPrice
      });
    }

    await recalculateCart(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'title slug basePrice discountPrice images stock store category isAvailable'
      })
      .populate('items.store', 'name slug logo')
      .populate('coupon', 'code discountType discountValue');

    return res.status(200).json({
      success: true,
      message: 'Item added to bag successfully.',
      data: populatedCart
    });
  } catch (error) {
    console.error('Error in addItemToCart:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add item to cart.',
      error: error.message
    });
  }
};

/**
 * @desc    Update item quantity in cart
 * @route   PUT /api/cart/items/:itemId
 * @access  Public / Protected
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?._id;
    const guestId = req.headers['x-guest-id'] || req.body.guestId;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1.'
      });
    }

    const cart = await Cart.findOne(userId ? { user: userId } : { guestId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    const product = await Product.findById(item.product);
    if (product && product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock} in stock).`
      });
    }

    item.quantity = Number(quantity);
    if (product) {
      item.price = product.discountPrice != null && product.discountPrice > 0
        ? product.discountPrice
        : product.basePrice;
    }

    await recalculateCart(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'title slug basePrice discountPrice images stock store category isAvailable'
      })
      .populate('items.store', 'name slug logo')
      .populate('coupon', 'code discountType discountValue');

    return res.status(200).json({
      success: true,
      message: 'Bag quantity updated.',
      data: populatedCart
    });
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update item quantity.',
      error: error.message
    });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:itemId
 * @access  Public / Protected
 */
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user?._id;
    const guestId = req.headers['x-guest-id'] || req.query.guestId;
    const { itemId } = req.params;

    const cart = await Cart.findOne(userId ? { user: userId } : { guestId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await recalculateCart(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'title slug basePrice discountPrice images stock store category isAvailable'
      })
      .populate('items.store', 'name slug logo')
      .populate('coupon', 'code discountType discountValue');

    return res.status(200).json({
      success: true,
      message: 'Item removed from bag.',
      data: populatedCart
    });
  } catch (error) {
    console.error('Error in removeCartItem:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart.',
      error: error.message
    });
  }
};

/**
 * @desc    Apply coupon to cart
 * @route   POST /api/cart/coupon
 * @access  Public / Protected
 */
export const applyCoupon = async (req, res) => {
  try {
    const userId = req.user?._id;
    const guestId = req.headers['x-guest-id'] || req.body.guestId;
    const { code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid coupon code.'
      });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code.'
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is no longer active.'
      });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired.'
      });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has reached its maximum redemption limit.'
      });
    }

    const cart = await Cart.findOne(userId ? { user: userId } : { guestId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your bag is empty.'
      });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Order subtotal must be at least $${coupon.minOrderAmount} to redeem this coupon.`
      });
    }

    cart.coupon = coupon._id;
    await recalculateCart(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'title slug basePrice discountPrice images stock store category isAvailable'
      })
      .populate('items.store', 'name slug logo')
      .populate('coupon', 'code discountType discountValue minOrderAmount maxDiscountAmount');

    return res.status(200).json({
      success: true,
      message: `Coupon "${coupon.code}" applied successfully!`,
      data: populatedCart
    });
  } catch (error) {
    console.error('Error in applyCoupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to apply coupon.',
      error: error.message
    });
  }
};

/**
 * @desc    Remove coupon from cart
 * @route   DELETE /api/cart/coupon
 * @access  Public / Protected
 */
export const removeCoupon = async (req, res) => {
  try {
    const userId = req.user?._id;
    const guestId = req.headers['x-guest-id'] || req.query.guestId;

    const cart = await Cart.findOne(userId ? { user: userId } : { guestId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    cart.coupon = null;
    cart.discountAmount = 0;
    await recalculateCart(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'title slug basePrice discountPrice images stock store category isAvailable'
      })
      .populate('items.store', 'name slug logo');

    return res.status(200).json({
      success: true,
      message: 'Coupon removed.',
      data: populatedCart
    });
  } catch (error) {
    console.error('Error in removeCoupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove coupon.',
      error: error.message
    });
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart
 * @access  Public / Protected
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const guestId = req.headers['x-guest-id'] || req.query.guestId;

    const cart = await Cart.findOne(userId ? { user: userId } : { guestId });
    if (cart) {
      cart.items = [];
      cart.coupon = null;
      cart.discountAmount = 0;
      cart.totalAmount = 0;
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Shopping bag cleared successfully.',
      data: {
        items: [],
        coupon: null,
        subtotal: 0,
        discountAmount: 0,
        totalAmount: 0
      }
    });
  } catch (error) {
    console.error('Error in clearCart:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear cart.',
      error: error.message
    });
  }
};

/**
 * @desc    Merge guest cart into user cart upon login
 * @route   POST /api/cart/merge
 * @access  Protected
 */
export const mergeGuestCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({ success: false, message: 'Guest ID is required to merge.' });
    }

    const guestCart = await Cart.findOne({ guestId });
    if (!guestCart || guestCart.items.length === 0) {
      const userCart = await Cart.findOne({ user: userId });
      return res.status(200).json({ success: true, data: userCart });
    }

    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      userCart = await Cart.create({ user: userId, items: [] });
    }

    // Merge items from guestCart into userCart
    for (const gItem of guestCart.items) {
      const existing = userCart.items.find(
        (uItem) => uItem.product.toString() === gItem.product.toString()
      );
      if (existing) {
        existing.quantity += gItem.quantity;
      } else {
        userCart.items.push(gItem);
      }
    }

    if (!userCart.coupon && guestCart.coupon) {
      userCart.coupon = guestCart.coupon;
    }

    await recalculateCart(userCart);
    await userCart.save();

    // Delete the temporary guest cart
    await Cart.deleteOne({ _id: guestCart._id });

    const populatedCart = await Cart.findById(userCart._id)
      .populate({
        path: 'items.product',
        select: 'title slug basePrice discountPrice images stock store category isAvailable'
      })
      .populate('items.store', 'name slug logo')
      .populate('coupon', 'code discountType discountValue');

    return res.status(200).json({
      success: true,
      message: 'Guest bag merged successfully.',
      data: populatedCart
    });
  } catch (error) {
    console.error('Error in mergeGuestCart:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to merge guest bag.',
      error: error.message
    });
  }
};
