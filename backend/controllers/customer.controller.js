import User from '../models/User.js';
import Order from '../models/Order.js';
import Address from '../models/Address.js';
import Wishlist from '../models/Wishlist.js';

/**
 * @desc    Get customer profile summary & statistics
 * @route   GET /api/customer/profile
 * @access  Protected
 */
export const getCustomerProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer account not found.' });
    }

    // Compute stats
    const [totalOrders, activeOrders, addressCount, wishlistDoc] = await Promise.all([
      Order.countDocuments({ user: userId }),
      Order.countDocuments({ user: userId, orderStatus: { $in: ['placed', 'confirmed', 'processing', 'shipped'] } }),
      Address.countDocuments({ user: userId }),
      Wishlist.findOne({ user: userId })
    ]);

    const wishlistCount = wishlistDoc ? wishlistDoc.items.length : 0;

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          status: user.status,
          createdAt: user.createdAt
        },
        stats: {
          totalOrders,
          activeOrders,
          addressCount,
          wishlistCount
        }
      }
    });
  } catch (error) {
    console.error('Error in getCustomerProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile data.',
      error: error.message
    });
  }
};

/**
 * @desc    Update customer profile details
 * @route   PUT /api/customer/profile
 * @access  Protected
 */
export const updateCustomerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, avatar } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone ? phone.trim() : null;
    if (avatar) {
      user.avatar = {
        public_id: avatar.public_id || null,
        url: avatar.url || user.avatar.url
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error in updateCustomerProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error.message
    });
  }
};

/**
 * @desc    Change customer password
 * @route   PUT /api/customer/change-password
 * @access  Protected
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
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
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password.'
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Error in changePassword:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password.',
      error: error.message
    });
  }
};
