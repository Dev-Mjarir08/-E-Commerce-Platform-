import User from '../models/User.js';
import Order from '../models/Order.js';
import Address from '../models/Address.js';

/**
 * Helper to calculate VIP/Privilege tier based on lifetime spend
 */
const calculateTier = (totalSpend = 0) => {
  if (totalSpend >= 200000) return 'VIP Member';
  if (totalSpend >= 50000) return 'Privilege Club';
  return 'Standard';
};

/**
 * @desc    Get all customers with aggregated order metrics & search
 * @route   GET /api/admin/customers
 * @access  Private / Admin
 */
export const getAllCustomers = async (req, res) => {
  try {
    const { search = '', tier = '', status = '', page = 1, limit = 50 } = req.query;

    const query = { role: 'customer' };

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    if (status.trim() && status !== 'all') {
      query.status = status.trim();
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const skip = (pageNum - 1) * limitNum;

    // Retrieve customers matching query
    const [rawCustomers, totalCount] = await Promise.all([
      User.find(query)
        .select('-password -refreshToken -verificationToken -resetPasswordToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query)
    ]);

    // Aggregate orders & spend for each customer
    const customerIds = rawCustomers.map((c) => c._id);

    const orderAggregations = await Order.aggregate([
      {
        $match: {
          user: { $in: customerIds },
          orderStatus: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
          lifetimeSpend: { $sum: '$totalPrice' }
        }
      }
    ]);

    const metricsMap = new Map();
    orderAggregations.forEach((item) => {
      metricsMap.set(item._id.toString(), {
        orders: item.orderCount,
        spend: item.lifetimeSpend
      });
    });

    // Merge computed metrics
    let customersWithMetrics = rawCustomers.map((c) => {
      const metrics = metricsMap.get(c._id.toString()) || { orders: 0, spend: 0 };
      const calculatedTier = calculateTier(metrics.spend);
      return {
        id: c._id,
        _id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone || 'N/A',
        role: c.role,
        avatar: c.avatar?.url || 'https://placehold.co/150',
        status: c.status || 'active',
        isVerified: c.isVerified,
        orders: metrics.orders,
        totalSpend: `₹${metrics.spend.toLocaleString('en-IN')}`,
        rawSpend: metrics.spend,
        tier: calculatedTier,
        joined: new Date(c.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        }),
        createdAt: c.createdAt
      };
    });

    // Optional tier filtering in memory if queried
    if (tier && tier !== 'all') {
      customersWithMetrics = customersWithMetrics.filter(
        (c) => c.tier.toLowerCase() === tier.toLowerCase()
      );
    }

    // Summary calculation for the admin header
    const totalCustomersInDb = await User.countDocuments({ role: 'customer' });
    const allOrderMetrics = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const summary = {
      totalCustomers: totalCustomersInDb,
      totalOrders: allOrderMetrics[0]?.totalOrders || 0,
      totalSpend: `₹${(allOrderMetrics[0]?.totalRevenue || 0).toLocaleString('en-IN')}`
    };

    return res.status(200).json({
      success: true,
      count: customersWithMetrics.length,
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      summary,
      data: customersWithMetrics
    });
  } catch (error) {
    console.error('Error in getAllCustomers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve customers.',
      error: error.message
    });
  }
};

/**
 * @desc    Get single customer profile with full order history & addresses
 * @route   GET /api/admin/customers/:id
 * @access  Private / Admin
 */
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await User.findById(id)
      .select('-password -refreshToken -verificationToken -resetPasswordToken')
      .lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found.'
      });
    }

    // Fetch customer's orders and addresses in parallel
    const [orders, addresses] = await Promise.all([
      Order.find({ user: customer._id })
        .sort({ createdAt: -1 })
        .lean(),
      Address.find({ user: customer._id }).lean()
    ]);

    // Calculate customer metrics
    const nonCancelledOrders = orders.filter((o) => o.orderStatus !== 'cancelled');
    const lifetimeSpend = nonCancelledOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const tier = calculateTier(lifetimeSpend);

    const formattedOrders = orders.map((o) => ({
      id: o._id,
      orderNumber: o.orderNumber || `ORD-${o._id.toString().slice(-6).toUpperCase()}`,
      date: new Date(o.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      total: `₹${(o.totalPrice || 0).toLocaleString('en-IN')}`,
      rawTotal: o.totalPrice,
      status: o.orderStatus,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      shippingAddress: o.shippingAddress,
      createdAt: o.createdAt
    }));

    return res.status(200).json({
      success: true,
      data: {
        id: customer._id,
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || 'N/A',
        role: customer.role,
        avatar: customer.avatar?.url || 'https://placehold.co/150',
        status: customer.status || 'active',
        isVerified: customer.isVerified,
        tier,
        ordersCount: orders.length,
        totalSpend: `₹${lifetimeSpend.toLocaleString('en-IN')}`,
        rawSpend: lifetimeSpend,
        joined: new Date(customer.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        }),
        createdAt: customer.createdAt,
        orders: formattedOrders,
        addresses: addresses || []
      }
    });
  } catch (error) {
    console.error('Error in getCustomerById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer details.',
      error: error.message
    });
  }
};

/**
 * @desc    Update customer status (e.g. active, suspended)
 * @route   PUT /api/admin/customers/:id/status
 * @access  Private / Admin
 */
export const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'inactive', 'suspended', 'banned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
      });
    }

    const customer = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Customer status updated to ${status}.`,
      data: customer
    });
  } catch (error) {
    console.error('Error in updateCustomerStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update customer status.',
      error: error.message
    });
  }
};

/**
 * @desc    Delete customer
 * @route   DELETE /api/admin/customers/:id
 * @access  Private / Admin
 */
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await User.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Customer deleted successfully.'
    });
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete customer.',
      error: error.message
    });
  }
};
