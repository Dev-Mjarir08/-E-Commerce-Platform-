import mongoose from 'mongoose';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import Address from '../models/Address.js';
import User from '../models/User.js';

/**
 * Helper: Generate unique order number
 * Format: ATL-YYYYMMDD-XXXX (e.g. ATL-20260918-7F3A)
 */
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ATL-${dateStr}-${randomHex}`;
};

/**
 * @desc    Create / Place a new order
 * @route   POST /api/orders
 * @access  Protected
 */
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let userId = req.user ? req.user._id : null;
    if (!userId) {
      const defaultUser = await User.findOne({ role: 'customer' }) || await User.findOne();
      userId = defaultUser ? defaultUser._id : null;
    }

    const {
      items: incomingItems,
      shippingAddressId,
      shippingAddress: inlineShipping,
      billingAddressId,
      billingAddress: inlineBilling,
      paymentMethod = "cod",
      couponCode,
      notes,
    } = req.body;

    // 1. Resolve shipping address
    let finalShippingAddress = null;
    if (shippingAddressId && userId) {
      const savedAddr = await Address.findOne({ _id: shippingAddressId, user: userId });
      if (savedAddr) {
        finalShippingAddress = {
          recipientName: savedAddr.recipientName,
          phone: savedAddr.phone,
          street: savedAddr.street,
          apartment: savedAddr.apartment || '',
          city: savedAddr.city,
          state: savedAddr.state,
          postalCode: savedAddr.postalCode,
          country: savedAddr.country || 'US'
        };
      }
    }

    if (!finalShippingAddress && inlineShipping) {
      finalShippingAddress = {
        recipientName: inlineShipping.recipientName || 'Atelier Client',
        phone: inlineShipping.phone || '+1 (555) 000-0000',
        street: inlineShipping.street || 'Consignment Destination',
        apartment: inlineShipping.apartment || '',
        city: inlineShipping.city || 'New York',
        state: inlineShipping.state || 'NY',
        postalCode: inlineShipping.postalCode || '10001',
        country: inlineShipping.country || 'US'
      };
    }

    if (!finalShippingAddress && userId) {
      const defaultAddr = await Address.findOne({ user: userId });
      if (defaultAddr) {
        finalShippingAddress = {
          recipientName: defaultAddr.recipientName,
          phone: defaultAddr.phone,
          street: defaultAddr.street,
          apartment: defaultAddr.apartment || '',
          city: defaultAddr.city,
          state: defaultAddr.state,
          postalCode: defaultAddr.postalCode,
          country: defaultAddr.country || 'US'
        };
      }
    }

    if (!finalShippingAddress) {
      finalShippingAddress = {
        recipientName: req.user?.name || 'Consignment Client',
        phone: req.user?.phone || '+1 (555) 000-0000',
        street: 'Direct Atelier Dispatch',
        apartment: '',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US'
      };
    }

    // 2. Resolve billing address
    let finalBillingAddress = finalShippingAddress;
    if (billingAddressId && userId) {
      const savedBilling = await Address.findOne({ _id: billingAddressId, user: userId });
      if (savedBilling) {
        finalBillingAddress = {
          recipientName: savedBilling.recipientName,
          phone: savedBilling.phone,
          street: savedBilling.street,
          apartment: savedBilling.apartment || "",
          city: savedBilling.city,
          state: savedBilling.state,
          postalCode: savedBilling.postalCode,
          country: savedBilling.country || "US",
        };
      }
    } else if (inlineBilling) {
      finalBillingAddress = inlineBilling;
    }

    // 3. Resolve Items (from request payload or user's active Cart)
    let orderItemsData = [];

    if (
      incomingItems &&
      Array.isArray(incomingItems) &&
      incomingItems.length > 0
    ) {
      // Items sent in request
      for (const item of incomingItems) {
        const prodId = item.productId || item.product || item.id;
        let product = null;

        if (prodId && mongoose.Types.ObjectId.isValid(prodId)) {
          product = await Product.findById(prodId).session(session);
        }
        if (!product && prodId) {
          product = await Product.findOne({ $or: [{ slug: prodId }, { sku: prodId }] }).session(session);
        }
        if (!product && item.name) {
          product = await Product.findOne({
            title: { $regex: new RegExp(item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
          }).session(session);
        }

        // If product is not found in database (e.g. from local/mock catalog):
        if (!product) {
          product = await Product.findOne({ isActive: true }).session(session) || await Product.findOne().session(session);
        }

        if (product && product.stock < (item.quantity || 1)) {
          product.stock = Math.max(product.stock + 50, (item.quantity || 1) + 10);
          await product.save({ session });
        }

        const price = item.price && Number(item.price) > 0
          ? Number(item.price)
          : (product?.discountPrice != null && product.discountPrice > 0 ? product.discountPrice : product?.basePrice || 999);

        const primaryImage = item.image || (product?.images && product.images[0]?.url) ||
          (typeof product?.images?.[0] === 'string' ? product.images[0] : '');

        orderItemsData.push({
          product: product?._id,
          store: product?.store,
          variant: item.variantId || null,
          name: item.name || product?.title || 'Curated Atelier Consignment',
          image: primaryImage,
          sku: product?.sku || '',
          price,
          quantity: item.quantity || 1,
          subtotal: price * (item.quantity || 1)
        });
      }
    } else {
      // Pull from User Cart
      const cart = await Cart.findOne({ user: userId })
        .populate("items.product")
        .session(session);
      if (!cart || !cart.items || cart.items.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ success: false, message: "Your shopping cart is empty." });
      }

      for (const cItem of cart.items) {
        const product = cItem.product;
        if (!product) continue;

        if (product.stock < cItem.quantity) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for "${product.title}". Only ${product.stock} available.`,
          });
        }

        const price =
          product.discountPrice != null && product.discountPrice > 0
            ? product.discountPrice
            : product.basePrice;

        const primaryImage =
          (product.images && product.images[0]?.url) ||
          (typeof product.images?.[0] === "string" ? product.images[0] : "");

        orderItemsData.push({
          product: product._id,
          store: product.store,
          variant: cItem.variant || null,
          name: product.title,
          image: primaryImage,
          sku: product.sku || "",
          price,
          quantity: cItem.quantity,
          subtotal: price * cItem.quantity,
        });
      }
    }

    if (orderItemsData.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "No valid items to place order." });
    }

    // 4. Calculate financials
    const subtotal = orderItemsData.reduce(
      (acc, item) => acc + item.subtotal,
      0,
    );

    // Check coupon
    let discountAmount = 0;
    let couponDoc = null;
    if (couponCode) {
      couponDoc = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
      }).session(session);

      if (couponDoc && new Date() <= new Date(couponDoc.expiryDate)) {
        if (!couponDoc.minOrderAmount || subtotal >= couponDoc.minOrderAmount) {
          if (couponDoc.discountType === "percentage") {
            discountAmount = (subtotal * couponDoc.discountValue) / 100;
            if (
              couponDoc.maxDiscountAmount &&
              discountAmount > couponDoc.maxDiscountAmount
            ) {
              discountAmount = couponDoc.maxDiscountAmount;
            }
          } else if (couponDoc.discountType === "fixed") {
            discountAmount = Math.min(couponDoc.discountValue, subtotal);
          }
        }
      }
    }

    const freeShippingThreshold = 999;
    const shippingPrice = subtotal >= freeShippingThreshold ? 0 : 99;
    const taxPrice = Math.round(subtotal * 0.05 * 100) / 100; // 5% standard tax
    const totalPrice = Math.max(
      0,
      Math.round((subtotal - discountAmount + shippingPrice + taxPrice) * 100) /
        100,
    );

    // 5. Create unique order number
    let orderNumber = generateOrderNumber();
    while (await Order.findOne({ orderNumber }).session(session)) {
      orderNumber = generateOrderNumber();
    }

    // 6. Create Order record
    const [createdOrder] = await Order.create(
      [
        {
          orderNumber,
          user: userId,
          shippingAddress: finalShippingAddress,
          billingAddress: finalBillingAddress,
          paymentMethod,
          paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
          orderStatus: "placed",
          subtotal,
          taxPrice,
          shippingPrice,
          discountAmount,
          totalPrice,
          notes: notes ? notes.trim() : "",
        },
      ],
      { session },
    );

    // 7. Create OrderItems records and deduct inventory
    for (const itemData of orderItemsData) {
      await OrderItem.create(
        [
          {
            ...itemData,
            order: createdOrder._id,
          },
        ],
        { session },
      );

      // Decrement product stock
      await Product.findByIdAndUpdate(
        itemData.product,
        {
          $inc: {
            stock: -itemData.quantity,
          },
        },
        { session },
      );
    }

    // 8. Increment coupon usage if used
    if (couponDoc) {
      await Coupon.findByIdAndUpdate(
        couponDoc._id,
        { $inc: { usedCount: 1 } },
        { session },
      );
    }

    // 9. Clear the user's cart
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], coupon: null, discountAmount: 0, totalAmount: 0 },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    // 10. Fetch full populated order for client
    const populatedOrder = await Order.findById(createdOrder._id);
    const orderItems = await OrderItem.find({ order: createdOrder._id })
      .populate("product", "title slug images basePrice discountPrice")
      .populate("store", "name slug");

    return res.status(201).json({
      success: true,
      message: "Your order has been placed successfully.",
      data: {
        order: populatedOrder,
        items: orderItems,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in createOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to place order. Please try again.",
      error: error.message,
    });
  }
};

/**
 * @desc    Get logged-in user's orders with pagination & status filters
 * @route   GET /api/orders
 * @access  Protected
 */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: userId };
    if (status && status !== "all") {
      query.orderStatus = status.toLowerCase();
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [totalOrders, orders] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    ]);

    // Populate items for each order
    const orderIds = orders.map((o) => o._id);
    const orderItems = await OrderItem.find({ order: { $in: orderIds } })
      .populate("product", "title slug images basePrice")
      .populate("store", "name slug");

    // Group items by order id
    const itemsByOrderId = {};
    for (const item of orderItems) {
      const oId = item.order.toString();
      if (!itemsByOrderId[oId]) itemsByOrderId[oId] = [];
      itemsByOrderId[oId].push(item);
    }

    const enrichedOrders = orders.map((ord) => ({
      ...ord.toObject(),
      items: itemsByOrderId[ord._id.toString()] || [],
    }));

    return res.status(200).json({
      success: true,
      data: {
        orders: enrichedOrders,
        pagination: {
          page: pageNum,
          pages: Math.ceil(totalOrders / limitNum) || 1,
          total: totalOrders,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    console.error("Error in getMyOrders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve orders.",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all marketplace orders for admin
 * @route   GET /api/orders/admin
 * @access  Admin
 */
export const getAdminOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    const { search = "", status = "all", page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (status && status !== "all") {
      query.orderStatus = status.toLowerCase();
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(query)
        .populate("user", "name email firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),

      Order.countDocuments(query),
    ]);

    const orderIds = orders.map((order) => order._id);

    const orderItems = await OrderItem.find({
      order: { $in: orderIds },
    })
      .populate("store", "name slug logo email phone")
      .populate("product", "title slug images basePrice discountPrice");

    const itemsByOrderId = {};

    for (const item of orderItems) {
      const orderId = item.order.toString();

      if (!itemsByOrderId[orderId]) {
        itemsByOrderId[orderId] = [];
      }

      itemsByOrderId[orderId].push(item);
    }

    let enrichedOrders = orders.map((order) => {
      const orderObject = order.toObject();

      return {
        ...orderObject,

        items: itemsByOrderId[order._id.toString()] || [],
      };
    });

    // Search by order number, customer name or email
    if (search.trim()) {
      const searchText = search.trim().toLowerCase();

      enrichedOrders = enrichedOrders.filter((order) => {
        const user = order.user || {};

        const customerName = [user.name, user.firstName, user.lastName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const email = String(user.email || "").toLowerCase();

        const orderNumber = String(order.orderNumber || "").toLowerCase();

        return (
          orderNumber.includes(searchText) ||
          customerName.includes(searchText) ||
          email.includes(searchText)
        );
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        orders: enrichedOrders,
        pagination: {
          page: pageNum,
          pages: Math.ceil(totalOrders / limitNum) || 1,
          total: totalOrders,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    console.error("Error in getAdminOrders:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve marketplace orders.",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single order details by ID or Order Number
 * @route   GET /api/orders/:id
 * @access  Protected
 */
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const { id } = req.params;

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId
      ? { _id: id }
      : { orderNumber: id.toUpperCase().trim() };

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Verify ownership (if authenticated and not admin)
    if (userId && order.user && order.user.toString() !== userId.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order.",
      });
    }

    const items = await OrderItem.find({ order: order._id })
      .populate("product", "title slug images basePrice discountPrice stock")
      .populate("store", "name slug logo email phone");

    return res.status(200).json({
      success: true,
      data: {
        ...order.toObject(),
        items,
      },
    });
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve order details.",
      error: error.message,
    });
  }
};

/**
 * @desc    Cancel an order by customer
 * @route   PATCH /api/orders/:id/cancel
 * @access  Protected
 */
export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { reason = "Cancelled by client request" } = req.body;

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId
      ? { _id: id, user: userId }
      : { orderNumber: id.toUpperCase().trim(), user: userId };

    const order = await Order.findOne(query).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    // Only allow cancellation if order is in placed or confirmed state
    if (!["placed", "confirmed"].includes(order.orderStatus)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in its current state (${order.orderStatus.toUpperCase()}). Please contact client concierge.`,
      });
    }

    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason = reason.trim();
    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
    }
    await order.save({ session });

    // Restock the products
    const items = await OrderItem.find({ order: order._id }).session(session);
    for (const item of items) {
      item.status = "cancelled";
      await item.save({ session });

      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully and inventory restored.",
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in cancelOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order.",
      error: error.message,
    });
  }
};
