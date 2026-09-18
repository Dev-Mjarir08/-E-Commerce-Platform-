import mongoose from 'mongoose';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

/**
 * @desc    Get current user's wishlist
 * @route   GET /api/wishlist
 * @access  Protected
 */
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'title slug basePrice discountPrice images stock store category isAvailable brand'
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    // Clean up items if underlying product has been deleted
    const validItems = wishlist.items.filter((item) => item.product != null);
    if (validItems.length !== wishlist.items.length) {
      wishlist.items = validItems;
      await wishlist.save();
    }

    return res.status(200).json({
      success: true,
      count: wishlist.items.length,
      data: wishlist.items
    });
  } catch (error) {
    console.error('Error in getWishlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve wishlist.',
      error: error.message
    });
  }
};

/**
 * @desc    Toggle item in wishlist (add if not present, remove if present)
 * @route   POST /api/wishlist/toggle
 * @access  Protected
 */
export const toggleWishlistItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid Product ID is required.'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    let actionStatus = 'added';
    if (itemIndex > -1) {
      // Remove from wishlist
      wishlist.items.splice(itemIndex, 1);
      actionStatus = 'removed';
    } else {
      // Add to wishlist
      wishlist.items.push({
        product: productId,
        addedAt: new Date()
      });
      actionStatus = 'added';
    }

    await wishlist.save();

    const populated = await Wishlist.findById(wishlist._id).populate({
      path: 'items.product',
      select: 'title slug basePrice discountPrice images stock store category isAvailable brand'
    });

    return res.status(200).json({
      success: true,
      action: actionStatus,
      message: actionStatus === 'added' ? 'Added to wishlist archive.' : 'Removed from wishlist archive.',
      count: populated.items.length,
      data: populated.items
    });
  } catch (error) {
    console.error('Error in toggleWishlistItem:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update wishlist.',
      error: error.message
    });
  }
};

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist/items
 * @access  Protected
 */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid Product ID is required.'
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    const alreadyExists = wishlist.items.some(
      (item) => item.product.toString() === productId.toString()
    );

    if (!alreadyExists) {
      wishlist.items.push({ product: productId, addedAt: new Date() });
      await wishlist.save();
    }

    const populated = await Wishlist.findById(wishlist._id).populate({
      path: 'items.product',
      select: 'title slug basePrice discountPrice images stock store category isAvailable brand'
    });

    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist.',
      count: populated.items.length,
      data: populated.items
    });
  } catch (error) {
    console.error('Error in addToWishlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist.',
      error: error.message
    });
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/items/:productId
 * @access  Protected
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found.' });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );
    await wishlist.save();

    const populated = await Wishlist.findById(wishlist._id).populate({
      path: 'items.product',
      select: 'title slug basePrice discountPrice images stock store category isAvailable brand'
    });

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist.',
      count: populated.items.length,
      data: populated.items
    });
  } catch (error) {
    console.error('Error in removeFromWishlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist.',
      error: error.message
    });
  }
};

/**
 * @desc    Clear all wishlist items
 * @route   DELETE /api/wishlist
 * @access  Protected
 */
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.items = [];
      await wishlist.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully.',
      count: 0,
      data: []
    });
  } catch (error) {
    console.error('Error in clearWishlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist.',
      error: error.message
    });
  }
};
