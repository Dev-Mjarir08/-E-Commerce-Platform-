import User from '../models/User.js';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import OrderItem from '../models/OrderItem.js';

/**
 * @desc    Get all live vendors from MongoDB with their stores and catalog counts
 * @route   GET /api/admin/vendors
 * @access  Private / Admin
 */
export const getAllVendors = async (req, res) => {
  try {
    const { search = '', status = '', page = 1, limit = 50 } = req.query;

    const query = { role: { $in: ['seller', 'vendor'] } };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const skip = (pageNum - 1) * limitNum;

    // Fetch vendor users from MongoDB
    const [vendorUsers, totalCount] = await Promise.all([
      User.find(query)
        .select('-password -refreshToken -verificationToken -resetPasswordToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query)
    ]);

    // Query stores associated with each vendor user
    const vendorsWithStores = await Promise.all(
      vendorUsers.map(async (user) => {
        let store = await Store.findOne({ owner: user._id }).lean();

        let productsCount = 0;
        let salesVolume = 0;

        if (store) {
          productsCount = await Product.countDocuments({ store: store._id });
          const orderItems = await OrderItem.find({ store: store._id }).lean();
          salesVolume = orderItems.reduce(
            (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
            0
          );
        }

        return {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || 'N/A',
          userStatus: user.status || 'active',
          isVerified: user.isVerified || false,
          avatar: user.avatar?.url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80',
          createdAt: user.createdAt,
          store: store || null,
          storeId: store?._id || null,
          storeName: store?.name || 'Storefront Not Set',
          slug: store?.slug || '',
          city: store?.address?.city || 'Global',
          category: store?.category || 'Atelier Boutique',
          tagline: store?.description || 'Curated luxury seller',
          status: store?.status || user.status || 'active',
          rating: store?.ratingAverage || 4.9,
          productsCount,
          salesVolume: `₹${salesVolume.toLocaleString('en-IN')}`,
          logo: store?.logo?.url || user.avatar?.url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80'
        };
      })
    );

    // Also include stores that might be owned by admin or standalone
    const allStores = await Store.find({}).populate('owner', 'name email role status isVerified avatar').lean();
    const standaloneStores = allStores
      .filter((s) => !vendorsWithStores.some((v) => v.storeId && v.storeId.toString() === s._id.toString()))
      .map((s) => ({
        id: s._id,
        _id: s._id,
        name: s.owner?.name || s.name,
        email: s.owner?.email || s.email || 'concierge@atelier.com',
        phone: s.phone || 'N/A',
        userStatus: s.owner?.status || 'active',
        isVerified: s.isVerified || false,
        avatar: s.owner?.avatar?.url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80',
        createdAt: s.createdAt,
        store: s,
        storeId: s._id,
        storeName: s.name,
        slug: s.slug,
        city: s.address?.city || 'Paris',
        category: s.category || 'Luxury Fashion',
        tagline: s.description || 'Flagship atelier boutique',
        status: s.status || 'active',
        rating: s.ratingAverage || 5.0,
        productsCount: 0,
        salesVolume: '₹0',
        logo: s.logo?.url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80'
      }));

    const combinedVendors = [...vendorsWithStores, ...standaloneStores];

    return res.status(200).json({
      success: true,
      count: combinedVendors.length,
      totalCount,
      data: combinedVendors
    });
  } catch (error) {
    console.error('getAllVendors error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve vendor directory from MongoDB.',
      error: error.message
    });
  }
};

/**
 * @desc    Get single vendor details by ID
 * @route   GET /api/admin/vendors/:id
 * @access  Private / Admin
 */
export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is user ID or store ID
    let user = await User.findById(id).select('-password -refreshToken').lean();
    let store = null;

    if (user) {
      store = await Store.findOne({ owner: user._id }).lean();
    } else {
      store = await Store.findById(id).populate('owner', '-password -refreshToken').lean();
      if (store?.owner) {
        user = store.owner;
      }
    }

    if (!user && !store) {
      return res.status(404).json({
        success: false,
        message: 'Vendor or Store record not found.'
      });
    }

    let products = [];
    if (store) {
      products = await Product.find({ store: store._id }).limit(20).lean();
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
        store,
        products
      }
    });
  } catch (error) {
    console.error('getVendorById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve vendor details.',
      error: error.message
    });
  }
};

/**
 * @desc    Update Vendor / Store Status (active, pending, suspended)
 * @route   PUT /api/admin/vendors/:id/status
 * @access  Private / Admin
 */
export const updateVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isVerified } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (typeof isVerified === 'boolean') updates.isVerified = isVerified;

    // Check if user exists
    let user = await User.findById(id);
    let store = null;

    if (user) {
      if (status) user.status = status;
      if (typeof isVerified === 'boolean') user.isVerified = isVerified;
      await user.save({ validateBeforeSave: false });
      store = await Store.findOneAndUpdate({ owner: user._id }, updates, { new: true });
    } else {
      store = await Store.findByIdAndUpdate(id, updates, { new: true });
      if (store?.owner) {
        user = await User.findByIdAndUpdate(store.owner, updates, { new: true });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Vendor status updated successfully to ${status || 'verified'}.`,
      data: { user, store }
    });
  } catch (error) {
    console.error('updateVendorStatus error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update vendor status.',
      error: error.message
    });
  }
};

/**
 * @desc    Delete / Deactivate Vendor
 * @route   DELETE /api/admin/vendors/:id
 * @access  Private / Admin
 */
export const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (user) {
      user.status = 'suspended';
      await user.save({ validateBeforeSave: false });
      await Store.findOneAndUpdate({ owner: user._id }, { status: 'suspended' });
    } else {
      await Store.findByIdAndUpdate(id, { status: 'suspended' });
    }

    return res.status(200).json({
      success: true,
      message: 'Vendor has been deactivated successfully.'
    });
  } catch (error) {
    console.error('deleteVendor error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to deactivate vendor.',
      error: error.message
    });
  }
};
