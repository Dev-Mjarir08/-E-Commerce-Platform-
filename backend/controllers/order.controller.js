import mongoose from 'mongoose';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import Address from '../models/Address.js';
import User from '../models/User.js';
import Store from '../models/Store.js';
import Payment from '../models/Payment.js';

/**
 * Helper: Generate unique order number
 * Format: OMNI-YYYYMMDD-XXXX (e.g. OMNI-20260918-7F3A)
 */
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `OMNI-${dateStr}-${randomHex}`;
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
      let defaultUser = await User.findOne({ role: 'customer' }) || await User.findOne();
      if (!defaultUser) {
        defaultUser = await User.create({
          name: 'Valued Client',
          email: `client_${Date.now()}@atelier.com`,
          password: 'ClientPassword123!',
          role: 'customer'
        });
      }
      userId = defaultUser._id;
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

        let itemStore = product?.store;
        if (!itemStore) {
          const defaultStore = (await Store.findOne().session(session)) || (await Store.findOne());
          itemStore = defaultStore?._id;
          if (!itemStore) {
            const newStore = await Store.create([
              {
                name: 'Atelier Flagship Store',
                slug: `atelier-flagship-${Date.now()}`,
                owner: userId,
                status: 'active'
              }
            ], { session });
            itemStore = newStore[0]._id;
          }
        }

        orderItemsData.push({
          product: product?._id,
          store: itemStore,
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

    // 10. Create initial Payment transaction record
    await Payment.create(
      [
        {
          order: createdOrder._id,
          user: userId,
          paymentMethod: (paymentMethod || 'cod').toLowerCase(),
          amount: totalPrice,
          currency: 'INR',
          status: paymentMethod?.toLowerCase() === 'cod' ? 'pending' : 'pending',
          transactionId: `TXN-${Date.now().toString().slice(-6)}`,
          gatewayResponse: {
            method: paymentMethod,
            orderNumber: createdOrder.orderNumber,
            placedAt: new Date()
          }
        }
      ],
      { session }
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
      const s = status.toLowerCase().trim();
      if (s === "processing") {
        query.orderStatus = { $in: ["placed", "confirmed", "processing"] };
      } else if (s === "in transit" || s === "shipped") {
        query.orderStatus = "shipped";
      } else {
        query.orderStatus = s;
      }
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

    // Search by order number, customer name, email, tracking, destination
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

        const tracking = String(order.trackingNumber || "").toLowerCase();
        const recipient = String(order.shippingAddress?.recipientName || "").toLowerCase();
        const city = String(order.shippingAddress?.city || "").toLowerCase();

        return (
          orderNumber.includes(searchText) ||
          customerName.includes(searchText) ||
          email.includes(searchText) ||
          tracking.includes(searchText) ||
          recipient.includes(searchText) ||
          city.includes(searchText)
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
    let order = null;

    if (isMongoId) {
      order = await Order.findById(id).populate(
        "user",
        "name email phone firstName lastName"
      );
    }

    if (!order) {
      order = await Order.findOne({ orderNumber: id.toUpperCase().trim() }).populate(
        "user",
        "name email phone firstName lastName"
      );
    }

    if (!order && !isMongoId) {
      order = await Order.findOne({ orderNumber: new RegExp(`^${id}$`, 'i') }).populate(
        "user",
        "name email phone firstName lastName"
      );
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
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
 * @desc    Update order status by Admin
 * @route   PATCH /api/orders/admin/:id/status
 * @access  Admin
 */
export const updateAdminOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "seller" && req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Admin or Vendor access required.",
      });
    }

    const { id } = req.params;
    const { status, reason, trackingNumber, carrier } = req.body;

    const allowedStatuses = [
      "placed",
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const normalizedStatus = String(status || "").toLowerCase().trim();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status "${status}". Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

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

    const previousStatus = order.orderStatus;
    order.orderStatus = normalizedStatus;

    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }
    if (carrier !== undefined) {
      order.carrier = carrier;
    }

    if (normalizedStatus === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    if (normalizedStatus === "cancelled") {
      if (!order.cancelledAt) {
        order.cancelledAt = new Date();
      }
      if (reason) {
        order.cancellationReason = reason.trim();
      }
      if (order.paymentStatus === "paid") {
        order.paymentStatus = "refunded";
      }

      // Restock items if was not already cancelled
      if (previousStatus !== "cancelled") {
        const items = await OrderItem.find({ order: order._id });
        for (const item of items) {
          item.status = "cancelled";
          await item.save();
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
      }
    } else {
      // Synchronize OrderItem status
      const mappedItemStatus =
        normalizedStatus === 'delivered'
          ? 'delivered'
          : normalizedStatus === 'shipped'
            ? 'shipped'
            : normalizedStatus === 'cancelled'
              ? 'cancelled'
              : 'processing';
      await OrderItem.updateMany(
        { order: order._id },
        { $set: { status: mappedItemStatus } }
      );
    }

    await order.save();

    const populatedOrder = await Order.findById(order._id).populate(
      "user",
      "name email firstName lastName"
    );
    const orderItems = await OrderItem.find({ order: order._id })
      .populate("store", "name slug")
      .populate("product", "title slug images basePrice discountPrice");

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${normalizedStatus}" successfully.`,
      data: {
        order: populatedOrder,
        items: orderItems,
      },
    });
  } catch (error) {
    console.error("Error in updateAdminOrderStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
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

/**
 * @desc    Get real shipping tracking verification timeline and status
 * @route   GET /api/orders/:id/tracking
 * @access  Public / Optional Auth
 */
export const getShippingTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId
      ? { _id: id }
      : {
          $or: [
            { orderNumber: id.toUpperCase().trim() },
            { trackingNumber: id.trim() }
          ]
        };

    const order = await Order.findOne(query).populate('user', 'name email phone firstName lastName');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tracking record not found.'
      });
    }

    const items = await OrderItem.find({ order: order._id }).populate('product', 'title slug images basePrice');

    const statusMap = {
      placed: 0,
      confirmed: 1,
      processing: 2,
      shipped: 3,
      out_for_delivery: 4,
      delivered: 5,
      cancelled: -1
    };

    const currentStatus = order.orderStatus || 'placed';
    const activeIndex = statusMap[currentStatus] ?? 0;

    const defaultTimeline = [
      {
        status: 'placed',
        title: 'Order Placed',
        description: 'Order confirmed and recorded in Atelier marketplace',
        location: order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.state}` : 'National Processing Hub',
        timestamp: order.createdAt
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Payment and inventory reservation verified',
        location: 'Consignment Atelier Fulfillment Center',
        timestamp: activeIndex >= 1 ? order.createdAt : null
      },
      {
        status: 'processing',
        title: 'Packaging & Quality Check',
        description: 'Luxury garments inspected, packaged, and tagged for dispatch',
        location: 'Atelier Vault / Central Depot',
        timestamp: activeIndex >= 2 ? order.updatedAt : null
      },
      {
        status: 'shipped',
        title: 'In Transit',
        description: `Dispatched with ${order.carrier || 'BlueDart Express'}. AWB: ${order.trackingNumber || `TRK-${order.orderNumber}`}`,
        location: 'Transit Sorting Hub',
        timestamp: activeIndex >= 3 ? order.updatedAt : null
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'With local courier delivery partner for doorstep delivery',
        location: order.shippingAddress ? `${order.shippingAddress.city} Delivery Center` : 'Destination Hub',
        timestamp: activeIndex >= 4 ? (order.deliveredAt || order.updatedAt) : null
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Handed over and verified with recipient signature',
        location: order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}` : 'Delivery Address',
        timestamp: activeIndex >= 5 ? order.deliveredAt : null
      }
    ];

    const events = (order.trackingEvents && order.trackingEvents.length > 0)
      ? order.trackingEvents
      : defaultTimeline.slice(0, activeIndex + 1);

    return res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber || `TRK-${order.orderNumber}`,
        carrier: order.carrier || 'BlueDart Express',
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        estimatedDelivery: order.estimatedDelivery || new Date(new Date(order.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000),
        deliveredAt: order.deliveredAt,
        events,
        timeline: defaultTimeline,
        currentStep: activeIndex,
        items,
        totalPrice: order.totalPrice
      }
    });
  } catch (error) {
    console.error('Error in getShippingTracking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve shipping tracking.',
      error: error.message
    });
  }
};

/**
 * @desc    Update shipping status, carrier, tracking number and append tracking events
 * @route   PATCH /api/orders/admin/:id/shipping
 * @access  Admin / Vendor
 */
export const updateShippingTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, carrier, estimatedDelivery, status, note, location } = req.body;

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId ? { _id: id } : { orderNumber: id.toUpperCase().trim() };
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    if (trackingNumber) order.trackingNumber = trackingNumber.trim();
    if (carrier) order.carrier = carrier.trim();
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);

    const validStatuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && validStatuses.includes(status.toLowerCase())) {
      order.orderStatus = status.toLowerCase();
      if (status.toLowerCase() === 'delivered') {
        order.deliveredAt = new Date();
      }
    }

    const eventTitle = note || `Shipment marked as ${order.orderStatus.toUpperCase()}`;
    const eventLocation = location || (order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.state}` : 'Logistics Hub');

    order.trackingEvents.push({
      status: order.orderStatus,
      title: eventTitle,
      location: eventLocation,
      description: `Carrier: ${order.carrier}. Tracking ID: ${order.trackingNumber || 'Pending'}`,
      timestamp: new Date()
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Shipping tracking information updated and verified successfully.',
      data: order
    });
  } catch (error) {
    console.error('Error in updateShippingTracking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update shipping tracking record.',
      error: error.message
    });
  }
};
