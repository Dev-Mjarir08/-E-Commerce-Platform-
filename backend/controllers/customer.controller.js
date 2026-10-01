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
          coverImage: user.coverImage || null,
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
    const { name, phone, avatar, coverImage } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Update basic user details
    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone ? phone.trim() : null;

    // Update profile avatar if provided in payload
    if (avatar) {
      user.avatar = {
        public_id: avatar.public_id || null,
        url: avatar.url || user.avatar?.url || 'https://placehold.co/150'
      };
    }

    // Update cover image if provided in payload
    if (coverImage) {
      user.coverImage = {
        public_id: coverImage.public_id || null,
        url: coverImage.url || user.coverImage?.url || null
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
        coverImage: user.coverImage,
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
 * @desc    Upload / Update customer avatar picture
 * @route   POST /api/customer/avatar
 * @access  Protected
 */
export const uploadCustomerAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let avatarUrl = null;
    let publicId = null;

    if (req.file) {
      // Local multipart file upload
      avatarUrl = `/uploads/avatars/${req.file.filename}`;
      publicId = req.file.filename;
    } else if (req.body.avatarUrl || req.body.url) {
      // Direct URL string
      avatarUrl = req.body.avatarUrl || req.body.url;
      publicId = req.body.public_id || null;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file using multipart field "avatar" or JSON "url".'
      });
    }

    user.avatar = {
      public_id: publicId,
      url: avatarUrl
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully.',
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Error in uploadCustomerAvatar:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload avatar.',
      error: error.message
    });
  }
};

/**
 * @desc    Upload / Update customer cover background image
 * @route   POST /api/customer/cover
 * @access  Protected
 */
export const uploadCustomerCover = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let coverUrl = null;
    let publicId = null;

    if (req.file) {
      coverUrl = `/uploads/categories/${req.file.filename}`;
      publicId = req.file.filename;
    } else if (req.body.coverUrl || req.body.url) {
      coverUrl = req.body.coverUrl || req.body.url;
      publicId = req.body.public_id || null;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file using multipart field "cover" or "image".'
      });
    }

    user.coverImage = {
      public_id: publicId,
      url: coverUrl
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Cover image updated successfully.',
      data: {
        coverImage: user.coverImage
      }
    });
  } catch (error) {
    console.error('Error in uploadCustomerCover:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload cover image.',
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
