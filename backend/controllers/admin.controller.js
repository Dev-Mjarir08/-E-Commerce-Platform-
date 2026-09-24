import User from '../models/User.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.utils.js';

/**
 * @desc    Create / Register a new Admin
 * @route   POST /api/admin/create OR POST /api/auth/admin/register
 * @access  Public (or protected with ADMIN_SECRET_KEY if configured in .env)
 */
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, secretKey } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check optional admin secret key if configured in .env
    const configuredSecret = process.env.ADMIN_SECRET_KEY;
    if (configuredSecret && secretKey !== configuredSecret) {
      return res.status(403).json({
        success: false,
        message: 'Invalid Admin Secret Key. Unauthorized to create admin.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Create user with admin role
    const adminUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone ? phone.trim() : null,
      role: 'admin',
      isVerified: true, // Pre-verified so admin can login immediately
      status: 'active'
    });

    const accessToken = generateAccessToken(adminUser);
    const refreshToken = generateRefreshToken(adminUser);

    adminUser.refreshToken = refreshToken;
    await adminUser.save();

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          phone: adminUser.phone,
          isVerified: adminUser.isVerified,
          status: adminUser.status,
          createdAt: adminUser.createdAt
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while creating admin.'
    });
  }
};

/**
 * @desc    Get all admins
 * @route   GET /api/admin
 * @access  Private / Admin
 */
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password -refreshToken');
    return res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    console.error('Get admins error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching admins.'
    });
  }
};

/**
 * @desc    Get real-time live dynamic dashboard statistics from MongoDB
 * @route   GET /api/admin/stats OR GET /api/admin/dashboard
 * @access  Public / Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      inStockCount,
      lowStockCount,
      outOfStockCount,
      totalStores,
      totalCategories,
      totalCustomers,
      activeCustomers,
      totalOrders,
      totalVendors,
      activeVendors,
      pendingVendors,
      recentProducts,
      recentCustomers,
      recentVendorsRaw,
      valuationAgg,
      revenueAgg
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ stock: { $gt: 8 } }),
      Product.countDocuments({ stock: { $gt: 0, $lte: 8 } }),
      Product.countDocuments({ stock: 0 }),
      Store.countDocuments(),
      Category.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'customer', status: 'active' }),
      Order.countDocuments(),
      User.countDocuments({ role: { $in: ['seller', 'vendor'] } }),
      User.countDocuments({ role: { $in: ['seller', 'vendor'] }, status: 'active' }),
      User.countDocuments({ role: { $in: ['seller', 'vendor'] }, status: 'pending' }),
      Product.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('category', 'name slug')
        .populate('store', 'name slug'),
      User.find({ role: 'customer' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email phone status avatar createdAt')
        .lean(),
      User.find({ role: { $in: ['seller', 'vendor'] } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email phone status avatar isVerified createdAt')
        .lean(),
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalValue: {
              $sum: { $multiply: ['$basePrice', '$stock'] }
            }
          }
        }
      ]),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' }
          }
        }
      ])
    ]);

    // Attach store info and product count to recent vendors
    const recentVendors = await Promise.all(
      recentVendorsRaw.map(async (v) => {
        const store = await Store.findOne({ owner: v._id }).lean();
        const productsCount = store ? await Product.countDocuments({ store: store._id }) : 0;
        return {
          ...v,
          storeName: store?.name || 'No Storefront Created',
          slug: store?.slug || '',
          city: store?.address?.city || 'Global',
          rating: store?.ratingAverage || 4.9,
          productsCount,
          storeStatus: store?.status || v.status || 'active'
        };
      })
    );

    const totalInventoryValue = valuationAgg[0]?.totalValue || 0;
    const totalOrderRevenue = revenueAgg[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        inStockCount,
        lowStockCount,
        outOfStockCount,
        totalStores,
        totalCategories,
        totalCustomers,
        activeCustomers,
        totalOrders,
        totalVendors,
        activeVendors,
        pendingVendors,
        totalOrderRevenue,
        totalInventoryValue,
        recentProducts,
        recentCustomers,
        recentVendors
      }
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching dashboard statistics.'
    });
  }
};
