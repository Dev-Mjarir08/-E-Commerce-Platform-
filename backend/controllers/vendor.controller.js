import mongoose from 'mongoose';
import User from '../models/User.js';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import { removeImageFile } from '../middlewares/upload.middleware.js';

/**
 * @desc    Get Current Vendor Profile & Storefront Details
 * @route   GET /api/vendors/me
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorProfile = async (req, res) => {
  try {
    let user = null;
    let store = null;

    if (req.user?._id) {
      user = await User.findById(req.user._id);
      if (user) {
        store = await Store.findOne({ owner: user._id });
      }
    }

    // If user has no store yet or request is unauthenticated preview, fall back to first active store
    if (!store) {
      store = await Store.findOne({ status: 'active' }) || await Store.findOne();
    }

    // Compute vendor store metrics and dashboard data if store exists
    let metrics = {
      totalSales: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      activeProducts: 0,
      totalProducts: 0
    };
    let topProducts = [];
    let recentOrders = [];

    if (store) {
      const [totalProducts, activeProducts, storeOrderItems, productsList] = await Promise.all([
        Product.countDocuments({ store: store._id }),
        Product.countDocuments({
          store: store._id,
          $or: [{ isActive: true }, { status: 'active' }]
        }),
        OrderItem.find({ store: store._id }),
        Product.find({ store: store._id }).sort({ createdAt: -1 }).limit(5)
      ]);

      const orderIds = [...new Set(storeOrderItems.map(item => item.order.toString()))];
      const totalOrders = orderIds.length;
      const totalSales = storeOrderItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
      const averageOrderValue = totalOrders > 0 ? (totalSales / totalOrders) : 0;

      if (orderIds.length > 0) {
        recentOrders = await Order.find({ _id: { $in: orderIds } })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('user', 'name email');
      }

      topProducts = productsList.map(p => ({
        id: p._id,
        name: p.title || p.name,
        price: p.basePrice ?? p.price ?? 0,
        stock: p.stock ?? p.stockQuantity ?? 0,
        images: p.images
      }));

      metrics = {
        totalSales,
        totalOrders,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        activeProducts,
        totalProducts
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        user: user ? {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          status: user.status,
          createdAt: user.createdAt
        } : {
          name: 'Vendor Partner',
          email: 'partner@atelier.com',
          role: 'vendor',
          isVerified: true
        },
        store: store || null,
        metrics,
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    console.error('Error in getVendorProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve vendor profile data.',
      error: error.message
    });
  }
};

/**
 * @desc    Update Vendor Profile & Store Details
 * @route   PATCH /api/vendors/me
 * @access  Private (Vendor / Seller / Admin)
 */
export const updateVendorProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      phone,
      storeName,
      storeDescription,
      storeEmail,
      storePhone,
      storeAddress,
      street,
      city,
      state,
      postalCode,
      country,
      logo,
      banner
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Vendor user account not found.'
      });
    }

    // Update User Profile fields
    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone ? phone.trim() : null;
    await user.save();

    // Update or Create Associated Store
    let store = await Store.findOne({ owner: userId });

    if (store) {
      if (storeName && storeName.trim() !== store.name) {
        store.name = storeName.trim();
        let baseSlug = generateSlug(storeName) || `store-${Date.now()}`;
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (await Store.findOne({ slug: uniqueSlug, _id: { $ne: store._id } })) {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        store.slug = uniqueSlug;
      }

      if (storeDescription !== undefined) {
        store.description = storeDescription.trim();
      }

      if (storeEmail !== undefined) {
        store.email = storeEmail ? storeEmail.trim().toLowerCase() : store.email;
      }

      if (storePhone !== undefined) {
        store.phone = storePhone ? storePhone.trim() : store.phone;
      }

      // Resolve Address
      if (storeAddress && typeof storeAddress === 'object') {
        store.address = {
          street: storeAddress.street !== undefined ? storeAddress.street.trim() : store.address?.street,
          city: storeAddress.city !== undefined ? storeAddress.city.trim() : store.address?.city,
          state: storeAddress.state !== undefined ? storeAddress.state.trim() : store.address?.state,
          postalCode: storeAddress.postalCode !== undefined ? storeAddress.postalCode.trim() : store.address?.postalCode,
          country: storeAddress.country !== undefined ? storeAddress.country.trim() : store.address?.country
        };
      } else if (street !== undefined || city !== undefined || state !== undefined || postalCode !== undefined || country !== undefined) {
        store.address = {
          street: street !== undefined ? street.trim() : store.address?.street,
          city: city !== undefined ? city.trim() : store.address?.city,
          state: state !== undefined ? state.trim() : store.address?.state,
          postalCode: postalCode !== undefined ? postalCode.trim() : store.address?.postalCode,
          country: country !== undefined ? country.trim() : store.address?.country
        };
      }

      if (logo) {
        store.logo = typeof logo === 'object' ? logo : { url: logo, public_id: null };
      }

      if (banner) {
        store.banner = typeof banner === 'object' ? banner : { url: banner, public_id: null };
      }

      if (req.body.category !== undefined) {
        store.category = req.body.category ? req.body.category.trim() : store.category;
      }

      if (req.body.website !== undefined) {
        store.website = req.body.website ? req.body.website.trim() : store.website;
      }

      if (req.body.taxId !== undefined) {
        if (!store.settings) store.settings = {};
        store.settings.taxId = req.body.taxId.trim();
      }

      await store.save();
    } else if (storeName) {
      // Create store if none existed yet
      let baseSlug = generateSlug(storeName) || `store-${Date.now()}`;
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (await Store.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      let resolvedAddress = {};
      if (storeAddress && typeof storeAddress === 'object') {
        resolvedAddress = storeAddress;
      } else {
        resolvedAddress = { street: street || '', city: city || '', state: state || '', postalCode: postalCode || '', country: country || '' };
      }

      store = await Store.create({
        owner: user._id,
        name: storeName.trim(),
        slug: uniqueSlug,
        description: storeDescription?.trim() || `Official storefront of ${storeName}`,
        email: storeEmail ? storeEmail.trim().toLowerCase() : user.email,
        phone: storePhone ? storePhone.trim() : user.phone,
        address: resolvedAddress,
        status: 'pending'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Vendor profile and store details updated successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          status: user.status
        },
        store
      }
    });
  } catch (error) {
    console.error('Error in updateVendorProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update vendor profile.',
      error: error.message
    });
  }
};

/**
 * @desc    Change Vendor Password
 * @route   PATCH /api/vendors/me/change-password
 * @access  Private (Vendor / Seller / Admin)
 */
export const changeVendorPassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current password and new password.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Vendor account not found.'
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.'
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Error in changeVendorPassword:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change vendor password.',
      error: error.message
    });
  }
};

/**
 * @desc    Upload / Update Vendor Avatar
 * @route   POST /api/vendors/me/avatar
 * @access  Private (Vendor / Seller / Admin)
 */
export const uploadVendorAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Vendor user not found.'
      });
    }

    let newAvatarUrl = null;
    let newPublicId = null;

    if (req.file) {
      // Uploaded via multipart form
      newAvatarUrl = `/uploads/avatars/${req.file.filename}`;
    } else if (req.body.avatarUrl || req.body.url || (req.body.avatar && req.body.avatar.url)) {
      // Provided via JSON payload
      newAvatarUrl = req.body.avatarUrl || req.body.url || req.body.avatar.url;
      newPublicId = req.body.public_id || (req.body.avatar && req.body.avatar.public_id) || null;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide an avatar image file or avatarUrl in request.'
      });
    }

    // Clean up old uploaded file if local
    if (user.avatar?.url && user.avatar.url.includes('/uploads/avatars/')) {
      await removeImageFile(user.avatar.url, user.avatar.public_id);
    }

    user.avatar = {
      public_id: newPublicId,
      url: newAvatarUrl
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Avatar updated successfully.',
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Error in uploadVendorAvatar:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update vendor avatar.',
      error: error.message
    });
  }
};

// Helper to resolve vendor store
const resolveVendorStore = async (user) => {
  if (!user) return null;
  let store = await Store.findOne({ owner: user._id });
  if (!store && (user.role === 'admin' || user.role === 'vendor' || user.role === 'seller')) {
    store = (await Store.findOne({ status: 'active' })) || (await Store.findOne());
  }
  return store;
};

// ==========================================
// VENDOR ORDERS CONTROLLERS
// ==========================================

/**
 * @desc    Get all orders containing current vendor's products
 * @route   GET /api/vendor/orders
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorOrders = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    if (!store) {
      return res.status(200).json({ success: true, count: 0, totalCount: 0, data: [] });
    }

    const { status, search, page = 1, limit = 50 } = req.query;

    // Find all order items for this store
    const itemFilter = { store: store._id };
    if (status && status !== 'all') {
      itemFilter.status = status;
    }

    const storeItems = await OrderItem.find(itemFilter)
      .populate('product', 'title slug images basePrice')
      .populate('variant', 'title sku price');

    const orderIdMap = new Map();
    storeItems.forEach((item) => {
      const oId = item.order.toString();
      if (!orderIdMap.has(oId)) orderIdMap.set(oId, []);
      orderIdMap.get(oId).push(item);
    });

    const orderIds = Array.from(orderIdMap.keys());

    const orderQuery = { _id: { $in: orderIds } };
    if (search) {
      orderQuery.$or = [
        { orderNumber: new RegExp(search.trim(), 'i') },
        { 'shippingAddress.recipientName': new RegExp(search.trim(), 'i') }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [totalCount, orders] = await Promise.all([
      Order.countDocuments(orderQuery),
      Order.find(orderQuery)
        .populate('user', 'name email phone avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
    ]);

    const formattedOrders = orders.map((order) => {
      const items = orderIdMap.get(order._id.toString()) || [];
      const storeTotal = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
      return {
        ...order.toObject(),
        vendorItems: items,
        vendorSubtotal: storeTotal
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedOrders.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: formattedOrders
    });
  } catch (error) {
    console.error('getVendorOrders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch vendor orders.', error: error.message });
  }
};

/**
 * @desc    Get vendor order details
 * @route   GET /api/vendor/orders/:id
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorOrderById = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    const { id } = req.params;

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId ? { _id: id } : { orderNumber: id.toUpperCase() };

    const order = await Order.findOne(query).populate('user', 'name email phone avatar');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const storeItemsQuery = { order: order._id };
    if (store && req.user.role !== 'admin') {
      storeItemsQuery.store = store._id;
    }

    const vendorItems = await OrderItem.find(storeItemsQuery)
      .populate('product', 'title slug images sku basePrice')
      .populate('variant', 'title sku price');

    const vendorSubtotal = vendorItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    return res.status(200).json({
      success: true,
      data: {
        ...order.toObject(),
        vendorItems,
        vendorSubtotal
      }
    });
  } catch (error) {
    console.error('getVendorOrderById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch order details.', error: error.message });
  }
};

/**
 * @desc    Update order/item status for vendor
 * @route   PATCH /api/vendor/orders/:id/status
 * @access  Private (Vendor / Seller / Admin)
 */
export const updateVendorOrderStatus = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const orderQuery = isMongoId ? { _id: id } : { orderNumber: id.toUpperCase() };

    const order = await Order.findOne(orderQuery);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    const itemFilter = { order: order._id };
    if (store && req.user.role !== 'admin') {
      itemFilter.store = store._id;
    }

    const updateFields = { status };
    if (trackingNumber !== undefined) updateFields.trackingNumber = trackingNumber;

    await OrderItem.updateMany(itemFilter, { $set: updateFields });

    // If all items in this order now have this status or completed, update order status
    const allItems = await OrderItem.find({ order: order._id });
    if (allItems.every((i) => i.status === status)) {
      order.orderStatus = status === 'pending' ? 'placed' : status;
      if (status === 'delivered') order.deliveredAt = new Date();
      if (status === 'cancelled') order.cancelledAt = new Date();
      await order.save();
    }

    const updatedItems = await OrderItem.find(itemFilter).populate('product variant');

    return res.status(200).json({
      success: true,
      message: `Order fulfillment status updated to '${status}'.`,
      data: {
        orderId: order._id,
        orderStatus: order.orderStatus,
        updatedItems
      }
    });
  } catch (error) {
    console.error('updateVendorOrderStatus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update order status.', error: error.message });
  }
};

// ==========================================
// VENDOR CUSTOMERS CONTROLLERS
// ==========================================

/**
 * @desc    Get customers who have purchased from this vendor
 * @route   GET /api/vendor/customers
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorCustomers = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    if (!store) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const storeItems = await OrderItem.find({ store: store._id });
    const orderIds = [...new Set(storeItems.map((i) => i.order.toString()))];

    const orders = await Order.find({ _id: { $in: orderIds } }).populate('user', 'name email phone avatar createdAt status');

    const customerMap = new Map();

    orders.forEach((ord) => {
      if (!ord.user) return;
      const cId = ord.user._id.toString();
      const itemsForThisOrder = storeItems.filter((it) => it.order.toString() === ord._id.toString());
      const spentOnThisOrder = itemsForThisOrder.reduce((sum, it) => sum + (it.price * it.quantity), 0);

      if (!customerMap.has(cId)) {
        customerMap.set(cId, {
          id: ord.user._id,
          name: ord.user.name,
          email: ord.user.email,
          phone: ord.user.phone || ord.shippingAddress?.phone || null,
          avatar: ord.user.avatar,
          joinedAt: ord.user.createdAt,
          status: ord.user.status || 'active',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: ord.createdAt
        });
      }

      const c = customerMap.get(cId);
      c.totalOrders += 1;
      c.totalSpent += spentOnThisOrder;
      if (new Date(ord.createdAt) > new Date(c.lastOrderDate)) {
        c.lastOrderDate = ord.createdAt;
      }
    });

    const customers = Array.from(customerMap.values()).map((c) => ({
      ...c,
      totalSpent: Math.round(c.totalSpent * 100) / 100
    }));

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    console.error('getVendorCustomers error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch vendor customers.', error: error.message });
  }
};

/**
 * @desc    Get customer details and order history with this vendor
 * @route   GET /api/vendor/customers/:id
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorCustomerById = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    const { id } = req.params;

    const customer = await User.findById(id).select('name email phone avatar createdAt status');
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    let customerOrders = [];
    if (store) {
      const storeItems = await OrderItem.find({ store: store._id }).populate('product variant');
      const orderIds = [...new Set(storeItems.map((it) => it.order.toString()))];

      const orders = await Order.find({ _id: { $in: orderIds }, user: customer._id }).sort({ createdAt: -1 });

      customerOrders = orders.map((ord) => {
        const items = storeItems.filter((it) => it.order.toString() === ord._id.toString());
        const subtotal = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
        return {
          ...ord.toObject(),
          vendorItems: items,
          vendorSubtotal: subtotal
        };
      });
    }

    const totalSpent = customerOrders.reduce((sum, ord) => sum + (ord.vendorSubtotal || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        customer,
        metrics: {
          totalOrders: customerOrders.length,
          totalSpent: Math.round(totalSpent * 100) / 100,
          averageOrderValue: customerOrders.length > 0 ? Math.round((totalSpent / customerOrders.length) * 100) / 100 : 0
        },
        orders: customerOrders
      }
    });
  } catch (error) {
    console.error('getVendorCustomerById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch customer details.', error: error.message });
  }
};

// ==========================================
// VENDOR ANALYTICS CONTROLLERS
// ==========================================

/**
 * @desc    Analytics Overview KPI metrics
 * @route   GET /api/vendor/analytics/overview
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorAnalyticsOverview = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    if (!store) {
      return res.status(200).json({
        success: true,
        data: { totalRevenue: 0, totalOrders: 0, totalProducts: 0, averageOrderValue: 0 }
      });
    }

    const [productsCount, storeItems] = await Promise.all([
      Product.countDocuments({ store: store._id }),
      OrderItem.find({ store: store._id })
    ]);

    const orderIds = [...new Set(storeItems.map((i) => i.order.toString()))];
    const totalOrders = orderIds.length;
    const totalRevenue = storeItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    const avgOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;
    const totalUnitsSold = storeItems.reduce((sum, it) => sum + it.quantity, 0);

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts: productsCount,
        totalUnitsSold,
        averageOrderValue: avgOrderValue
      }
    });
  } catch (error) {
    console.error('getVendorAnalyticsOverview error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch analytics overview.', error: error.message });
  }
};

/**
 * @desc    Revenue analytics timeline
 * @route   GET /api/vendor/analytics/revenue
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorAnalyticsRevenue = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    if (!store) return res.status(200).json({ success: true, data: { timeline: [] } });

    const storeItems = await OrderItem.find({ store: store._id }).sort({ createdAt: 1 });

    const dailyMap = {};
    storeItems.forEach((it) => {
      const date = new Date(it.createdAt).toISOString().split('T')[0];
      if (!dailyMap[date]) dailyMap[date] = { date, revenue: 0, items: 0 };
      dailyMap[date].revenue += it.price * it.quantity;
      dailyMap[date].items += it.quantity;
    });

    const timeline = Object.values(dailyMap).map((d) => ({
      ...d,
      revenue: Math.round(d.revenue * 100) / 100
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue: timeline.reduce((sum, t) => sum + t.revenue, 0),
        timeline
      }
    });
  } catch (error) {
    console.error('getVendorAnalyticsRevenue error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch revenue analytics.', error: error.message });
  }
};

/**
 * @desc    Orders status breakdown analytics
 * @route   GET /api/vendor/analytics/orders
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorAnalyticsOrders = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    if (!store) return res.status(200).json({ success: true, data: { statusBreakdown: {} } });

    const storeItems = await OrderItem.find({ store: store._id });
    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0
    };

    storeItems.forEach((it) => {
      if (statusCounts[it.status] !== undefined) {
        statusCounts[it.status]++;
      } else {
        statusCounts.pending++;
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        totalItems: storeItems.length,
        statusBreakdown: statusCounts
      }
    });
  } catch (error) {
    console.error('getVendorAnalyticsOrders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch order analytics.', error: error.message });
  }
};

/**
 * @desc    Top products performance analytics
 * @route   GET /api/vendor/analytics/products
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorAnalyticsProducts = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    if (!store) return res.status(200).json({ success: true, data: { topProducts: [] } });

    const storeItems = await OrderItem.find({ store: store._id }).populate('product', 'title slug images basePrice stock');

    const productMap = {};
    storeItems.forEach((it) => {
      const pId = it.product?._id?.toString() || it.name;
      if (!productMap[pId]) {
        productMap[pId] = {
          productId: it.product?._id || null,
          title: it.product?.title || it.name,
          images: it.product?.images || [],
          stock: it.product?.stock || 0,
          quantitySold: 0,
          revenueGenerated: 0
        };
      }
      productMap[pId].quantitySold += it.quantity;
      productMap[pId].revenueGenerated += it.price * it.quantity;
    });

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenueGenerated - a.revenueGenerated)
      .slice(0, 10)
      .map((p) => ({ ...p, revenueGenerated: Math.round(p.revenueGenerated * 100) / 100 }));

    return res.status(200).json({
      success: true,
      data: {
        topProducts
      }
    });
  } catch (error) {
    console.error('getVendorAnalyticsProducts error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch product analytics.', error: error.message });
  }
};

/**
 * @desc    Customers analytics (growth, repeats)
 * @route   GET /api/vendor/analytics/customers
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorAnalyticsCustomers = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    if (!store) return res.status(200).json({ success: true, data: { totalCustomers: 0, repeatCustomers: 0 } });

    const storeItems = await OrderItem.find({ store: store._id });
    const orderIds = [...new Set(storeItems.map((i) => i.order.toString()))];

    const orders = await Order.find({ _id: { $in: orderIds } }).select('user createdAt');

    const customerOrderCount = {};
    orders.forEach((o) => {
      if (!o.user) return;
      const uId = o.user.toString();
      customerOrderCount[uId] = (customerOrderCount[uId] || 0) + 1;
    });

    const totalCustomers = Object.keys(customerOrderCount).length;
    const repeatCustomers = Object.values(customerOrderCount).filter((c) => c > 1).length;
    const repeatRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        repeatCustomers,
        repeatRate: `${repeatRate}%`
      }
    });
  } catch (error) {
    console.error('getVendorAnalyticsCustomers error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch customer analytics.', error: error.message });
  }
};

/**
 * @desc    Sales timeline and summary
 * @route   GET /api/vendor/analytics/sales
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorAnalyticsSales = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    if (!store) return res.status(200).json({ success: true, data: { sales: [] } });

    const storeItems = await OrderItem.find({ store: store._id })
      .sort({ createdAt: -1 })
      .populate('product', 'category title')
      .limit(100);

    const totalSales = storeItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalSales: Math.round(totalSales * 100) / 100,
        recentSalesCount: storeItems.length,
        sales: storeItems
      }
    });
  } catch (error) {
    console.error('getVendorAnalyticsSales error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch sales analytics.', error: error.message });
  }
};

// ==========================================
// VENDOR REVIEWS CONTROLLERS
// ==========================================

/**
 * @desc    Get reviews for vendor's products or store
 * @route   GET /api/vendor/reviews
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorReviews = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    let query = {};

    if (store) {
      const products = await Product.find({ store: store._id }).select('_id');
      const productIds = products.map((p) => p._id);
      query = { $or: [{ store: store._id }, { product: { $in: productIds } }] };
    }

    const { rating, page = 1, limit = 50 } = req.query;
    if (rating) query.rating = Number(rating);

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [totalCount, reviews] = await Promise.all([
      Review.countDocuments(query),
      Review.find(query)
        .populate('user', 'name email avatar')
        .populate('product', 'title slug images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
    ]);

    return res.status(200).json({
      success: true,
      count: reviews.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: reviews
    });
  } catch (error) {
    console.error('getVendorReviews error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch vendor reviews.', error: error.message });
  }
};

/**
 * @desc    Get single review details
 * @route   GET /api/vendor/reviews/:id
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('product', 'title slug images basePrice');

    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    return res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('getVendorReviewById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch review.', error: error.message });
  }
};

/**
 * @desc    Moderate / update review
 * @route   PATCH /api/vendor/reviews/:id
 * @access  Private (Vendor / Seller / Admin)
 */
export const updateVendorReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    const { comment, reply } = req.body;
    if (comment) review.comment = comment.trim();
    if (reply !== undefined) review.vendorReply = reply;

    await review.save();

    return res.status(200).json({
      success: true,
      message: 'Review updated successfully.',
      data: review
    });
  } catch (error) {
    console.error('updateVendorReview error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update review.', error: error.message });
  }
};

/**
 * @desc    Delete review
 * @route   DELETE /api/vendor/reviews/:id
 * @access  Private (Vendor / Seller / Admin)
 */
export const deleteVendorReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    // Recalculate product rating
    if (review.product) {
      const remainingReviews = await Review.find({ product: review.product });
      const avg = remainingReviews.length > 0
        ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length
        : 0;
      await Product.findByIdAndUpdate(review.product, {
        ratingsAverage: Math.round(avg * 10) / 10,
        numReviews: remainingReviews.length
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully.'
    });
  } catch (error) {
    console.error('deleteVendorReview error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete review.', error: error.message });
  }
};

// ==========================================
// VENDOR NOTIFICATIONS CONTROLLERS
// ==========================================

/**
 * @desc    Get vendor notifications
 * @route   GET /api/vendor/notifications
 * @access  Private (Vendor / Seller / Admin)
 */
export const getVendorNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const [unreadCount, notifications] = await Promise.all([
      Notification.countDocuments({ recipient: userId, isRead: false }),
      Notification.find({ recipient: userId }).sort({ createdAt: -1 }).limit(50)
    ]);

    return res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('getVendorNotifications error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications.', error: error.message });
  }
};

/**
 * @desc    Mark single notification as read
 * @route   PATCH /api/vendor/notifications/:id/read
 * @access  Private (Vendor / Seller / Admin)
 */
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: notification
    });
  } catch (error) {
    console.error('markNotificationRead error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update notification.', error: error.message });
  }
};

/**
 * @desc    Mark all vendor notifications as read
 * @route   PATCH /api/vendor/notifications/read-all
 * @access  Private (Vendor / Seller / Admin)
 */
export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    console.error('markAllNotificationsRead error:', error);
    return res.status(500).json({ success: false, message: 'Failed to mark notifications as read.', error: error.message });
  }
};

