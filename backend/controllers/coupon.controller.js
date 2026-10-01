import mongoose from 'mongoose';
import Coupon from '../models/Coupon.js';
import Store from '../models/Store.js';

const resolveVendorStore = async (user) => {
  if (!user) return null;
  let store = await Store.findOne({ owner: user._id });
  if (!store && (user.role === 'admin' || user.role === 'vendor' || user.role === 'seller')) {
    store = (await Store.findOne({ status: 'active' })) || (await Store.findOne());
  }
  return store;
};

/**
 * @desc    Create a new coupon
 * @route   POST /api/coupons
 * @access  Private (Vendor / Seller / Admin)
 */
export const createCoupon = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      expiryDate,
      usageLimit,
      isActive
    } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    if (discountValue == null || Number(discountValue) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid positive discount value is required.' });
    }

    if (!expiryDate) {
      return res.status(400).json({ success: false, message: 'Coupon expiry date is required.' });
    }

    const formattedCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: formattedCode });
    if (existing) {
      return res.status(400).json({ success: false, message: `Coupon with code '${formattedCode}' already exists.` });
    }

    const coupon = new Coupon({
      code: formattedCode,
      discountType: discountType === 'fixed' ? 'fixed' : 'percentage',
      discountValue: Number(discountValue),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      startDate: startDate ? new Date(startDate) : new Date(),
      expiryDate: new Date(expiryDate),
      usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
      store: store ? store._id : null,
      isActive: isActive !== false
    });

    await coupon.save();

    return res.status(201).json({
      success: true,
      message: 'Coupon created successfully.',
      data: coupon
    });
  } catch (error) {
    console.error('createCoupon error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create coupon.', error: error.message });
  }
};

/**
 * @desc    Get all coupons (filtered by vendor store)
 * @route   GET /api/coupons
 * @access  Private (Vendor / Seller / Admin)
 */
export const getCoupons = async (req, res) => {
  try {
    const store = await resolveVendorStore(req.user);
    const query = {};

    if (store && req.user.role !== 'admin') {
      query.$or = [{ store: store._id }, { store: null }];
    }

    const { search, isActive, page = 1, limit = 50 } = req.query;

    if (search) {
      query.code = new RegExp(search.trim(), 'i');
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true' || isActive === true;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [totalCount, coupons] = await Promise.all([
      Coupon.countDocuments(query),
      Coupon.find(query)
        .populate('store', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
    ]);

    return res.status(200).json({
      success: true,
      count: coupons.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: coupons
    });
  } catch (error) {
    console.error('getCoupons error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch coupons.', error: error.message });
  }
};

/**
 * @desc    Get coupon by ID or Code
 * @route   GET /api/coupons/:id
 * @access  Public / Private
 */
export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId ? { _id: id } : { code: id.toUpperCase() };

    const coupon = await Coupon.findOne(query).populate('store', 'name slug');
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    return res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('getCouponById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch coupon.', error: error.message });
  }
};

/**
 * @desc    Update coupon
 * @route   PATCH /api/coupons/:id
 * @access  Private (Vendor / Seller / Admin)
 */
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId ? { _id: id } : { code: id.toUpperCase() };

    const coupon = await Coupon.findOne(query);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      expiryDate,
      usageLimit,
      isActive
    } = req.body;

    if (code !== undefined) coupon.code = code.trim().toUpperCase();
    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
    if (minOrderAmount !== undefined) coupon.minOrderAmount = Number(minOrderAmount);
    if (maxDiscountAmount !== undefined) coupon.maxDiscountAmount = maxDiscountAmount ? Number(maxDiscountAmount) : null;
    if (startDate !== undefined) coupon.startDate = new Date(startDate);
    if (expiryDate !== undefined) coupon.expiryDate = new Date(expiryDate);
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit ? parseInt(usageLimit, 10) : null;
    if (isActive !== undefined) coupon.isActive = Boolean(isActive);

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: 'Coupon updated successfully.',
      data: coupon
    });
  } catch (error) {
    console.error('updateCoupon error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update coupon.', error: error.message });
  }
};

/**
 * @desc    Delete coupon
 * @route   DELETE /api/coupons/:id
 * @access  Private (Vendor / Seller / Admin)
 */
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId ? { _id: id } : { code: id.toUpperCase() };

    const coupon = await Coupon.findOneAndDelete(query);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully.'
    });
  } catch (error) {
    console.error('deleteCoupon error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete coupon.', error: error.message });
  }
};

/**
 * @desc    Validate and calculate coupon discount for checkout/cart
 * @route   POST /api/coupons/validate
 * @access  Public / OptionalAuth
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code.' });
    }

    const formattedCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: formattedCode });
    if (!coupon) {
      return res.status(404).json({ success: false, message: `Coupon '${formattedCode}' is invalid.` });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: `Coupon '${formattedCode}' is no longer active.` });
    }

    const now = new Date();
    if (coupon.startDate && now < new Date(coupon.startDate)) {
      return res.status(400).json({ success: false, message: `Coupon '${formattedCode}' is not active yet.` });
    }

    const expiry = new Date(coupon.expiryDate);
    expiry.setHours(23, 59, 59, 999);
    if (now > expiry) {
      return res.status(400).json({ success: false, message: `Coupon '${formattedCode}' has expired.` });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: `Coupon '${formattedCode}' has reached its maximum usage limit.` });
    }

    const orderSubtotal = Number(subtotal) || 0;
    if (coupon.minOrderAmount && orderSubtotal > 0 && orderSubtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Order subtotal must be at least ₹${coupon.minOrderAmount} to redeem '${formattedCode}'.`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, orderSubtotal || coupon.discountValue);
    }

    return res.status(200).json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      data: {
        coupon: {
          _id: coupon._id,
          id: coupon._id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrderAmount: coupon.minOrderAmount,
          maxDiscountAmount: coupon.maxDiscountAmount,
          expiryDate: coupon.expiryDate,
          isActive: coupon.isActive
        },
        discountAmount: Math.round(discountAmount * 100) / 100,
        discountPercent: coupon.discountType === 'percentage' ? coupon.discountValue : 0
      }
    });
  } catch (error) {
    console.error('validateCoupon error:', error);
    return res.status(500).json({ success: false, message: 'Failed to validate coupon.', error: error.message });
  }
};
