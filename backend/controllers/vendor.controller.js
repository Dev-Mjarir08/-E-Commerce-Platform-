import User from '../models/User.js';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
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
        Product.countDocuments({ store: store._id, status: 'active' }),
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
        name: p.title,
        price: p.price,
        stock: p.stockQuantity || 0,
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
