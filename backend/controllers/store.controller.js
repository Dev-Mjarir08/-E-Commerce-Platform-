import mongoose from 'mongoose';
import Store from '../models/Store.js';
import User from '../models/User.js';
import { removeImageFile } from '../middlewares/upload.middleware.js';

const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

const getUniqueStoreSlug = async (name, currentId = null) => {
  const base = slugify(name) || `store-${Date.now()}`;
  let slug = base;
  let counter = 1;
  while (await Store.findOne({ slug, ...(currentId ? { _id: { $ne: currentId } } : {}) })) {
    slug = `${base}-${counter++}`;
  }
  return slug;
};

// Helper to find vendor's store
const getVendorStore = async (userId) => {
  let store = await Store.findOne({ owner: userId });
  return store;
};

/**
 * @desc    Create a new store for the vendor
 * @route   POST /api/stores
 * @access  Private (Vendor / Seller / Admin)
 */
export const createStore = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if store already exists for this owner
    let existingStore = await Store.findOne({ owner: userId });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'A store already exists for your account.',
        data: existingStore
      });
    }

    const {
      name,
      description,
      email,
      phone,
      address,
      street,
      city,
      state,
      postalCode,
      country,
      logo,
      banner
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Store name is required.'
      });
    }

    const slug = await getUniqueStoreSlug(name);

    let resolvedAddress = address || {};
    if (street || city || state || postalCode || country) {
      resolvedAddress = {
        street: street || resolvedAddress.street || '',
        city: city || resolvedAddress.city || '',
        state: state || resolvedAddress.state || '',
        postalCode: postalCode || resolvedAddress.postalCode || '',
        country: country || resolvedAddress.country || ''
      };
    }

    const store = new Store({
      owner: userId,
      name: name.trim(),
      slug,
      description: description ? description.trim() : '',
      email: email ? email.trim().toLowerCase() : req.user.email,
      phone: phone ? phone.trim() : req.user.phone || '',
      address: resolvedAddress,
      logo: typeof logo === 'object' ? logo : (logo ? { url: logo, public_id: null } : { url: null, public_id: null }),
      banner: typeof banner === 'object' ? banner : (banner ? { url: banner, public_id: null } : { url: null, public_id: null }),
      status: 'active'
    });

    await store.save();

    // If user role was customer, upgrade to seller/vendor
    if (req.user.role === 'customer' || req.user.role === 'user') {
      await User.findByIdAndUpdate(userId, { role: 'seller' });
    }

    return res.status(201).json({
      success: true,
      message: 'Store created successfully.',
      data: store
    });
  } catch (error) {
    console.error('Error creating store:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create store.',
      error: error.message
    });
  }
};

/**
 * @desc    Get current vendor's store
 * @route   GET /api/stores/my-store
 * @access  Private (Vendor / Seller / Admin)
 */
export const getMyStore = async (req, res) => {
  try {
    let store = await Store.findOne({ owner: req.user._id }).populate('owner', 'name email phone avatar');

    // If not found, fall back to first active store for preview/demo if admin
    if (!store && (req.user.role === 'admin' || req.user.role === 'vendor' || req.user.role === 'seller')) {
      store = await Store.findOne({ status: 'active' }).populate('owner', 'name email phone avatar');
    }

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'No store found for this vendor. Please create a store first.'
      });
    }

    return res.status(200).json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Error getting my store:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch store details.',
      error: error.message
    });
  }
};

/**
 * @desc    Update current vendor's store details
 * @route   PATCH /api/stores/my-store
 * @access  Private (Vendor / Seller / Admin)
 */
export const updateMyStore = async (req, res) => {
  try {
    let store = await Store.findOne({ owner: req.user._id });
    if (!store && req.user.role === 'admin') {
      store = await Store.findOne();
    }

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.'
      });
    }

    const {
      name,
      description,
      email,
      phone,
      address,
      street,
      city,
      state,
      postalCode,
      country
    } = req.body;

    if (name && name.trim() !== store.name) {
      store.name = name.trim();
      store.slug = await getUniqueStoreSlug(name, store._id);
    }

    if (description !== undefined) store.description = description.trim();
    if (email !== undefined) store.email = email.trim().toLowerCase();
    if (phone !== undefined) store.phone = phone.trim();

    if (address && typeof address === 'object') {
      store.address = { ...store.address.toObject(), ...address };
    }
    if (street !== undefined || city !== undefined || state !== undefined || postalCode !== undefined || country !== undefined) {
      store.address = {
        street: street !== undefined ? street.trim() : store.address?.street,
        city: city !== undefined ? city.trim() : store.address?.city,
        state: state !== undefined ? state.trim() : store.address?.state,
        postalCode: postalCode !== undefined ? postalCode.trim() : store.address?.postalCode,
        country: country !== undefined ? country.trim() : store.address?.country
      };
    }

    await store.save();

    return res.status(200).json({
      success: true,
      message: 'Store updated successfully.',
      data: store
    });
  } catch (error) {
    console.error('Error updating store:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update store.',
      error: error.message
    });
  }
};

/**
 * @desc    Update store logo
 * @route   PATCH /api/stores/my-store/logo
 * @access  Private (Vendor / Seller / Admin)
 */
export const updateStoreLogo = async (req, res) => {
  try {
    let store = await Store.findOne({ owner: req.user._id });
    if (!store && req.user.role === 'admin') store = await Store.findOne();

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    let logoUrl = null;
    let publicId = null;

    if (req.file) {
      logoUrl = `/uploads/avatars/${req.file.filename}`;
    } else if (req.body.logoUrl || req.body.url || req.body.logo?.url) {
      logoUrl = req.body.logoUrl || req.body.url || req.body.logo.url;
      publicId = req.body.public_id || req.body.logo?.public_id || null;
    } else {
      return res.status(400).json({ success: false, message: 'Logo image file or url is required.' });
    }

    if (store.logo?.url && store.logo.url.includes('/uploads/')) {
      await removeImageFile(store.logo.url, store.logo.public_id);
    }

    store.logo = { url: logoUrl, public_id: publicId };
    await store.save();

    return res.status(200).json({
      success: true,
      message: 'Store logo updated successfully.',
      data: store.logo
    });
  } catch (error) {
    console.error('Error updating store logo:', error);
    return res.status(500).json({ success: false, message: 'Failed to update store logo.', error: error.message });
  }
};

/**
 * @desc    Update store banner
 * @route   PATCH /api/stores/my-store/banner
 * @access  Private (Vendor / Seller / Admin)
 */
export const updateStoreBanner = async (req, res) => {
  try {
    let store = await Store.findOne({ owner: req.user._id });
    if (!store && req.user.role === 'admin') store = await Store.findOne();

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    let bannerUrl = null;
    let publicId = null;

    if (req.file) {
      bannerUrl = `/uploads/categories/${req.file.filename}`;
    } else if (req.body.bannerUrl || req.body.url || req.body.banner?.url) {
      bannerUrl = req.body.bannerUrl || req.body.url || req.body.banner.url;
      publicId = req.body.public_id || req.body.banner?.public_id || null;
    } else {
      return res.status(400).json({ success: false, message: 'Banner image file or url is required.' });
    }

    if (store.banner?.url && store.banner.url.includes('/uploads/')) {
      await removeImageFile(store.banner.url, store.banner.public_id);
    }

    store.banner = { url: bannerUrl, public_id: publicId };
    await store.save();

    return res.status(200).json({
      success: true,
      message: 'Store banner updated successfully.',
      data: store.banner
    });
  } catch (error) {
    console.error('Error updating store banner:', error);
    return res.status(500).json({ success: false, message: 'Failed to update store banner.', error: error.message });
  }
};

/**
 * @desc    Get store settings (Operational settings, banking, tax, fulfillment, notifications)
 * @route   GET /api/stores/my-store/settings
 * @access  Private (Vendor / Seller / Admin)
 */
export const getStoreSettings = async (req, res) => {
  try {
    let store = await Store.findOne({ owner: req.user._id });
    if (!store && req.user.role === 'admin') store = await Store.findOne();

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found for this vendor.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Store settings retrieved successfully.',
      data: {
        settings: store.settings || {},
        email: store.email || '',
        phone: store.phone || '',
        address: store.address || {},
        status: store.status
      }
    });
  } catch (error) {
    console.error('Error fetching store settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch store settings.',
      error: error.message
    });
  }
};

/**
 * @desc    Update store operational settings
 * @route   PATCH /api/stores/my-store/settings
 * @access  Private (Vendor / Seller / Admin)
 */
export const updateStoreSettings = async (req, res) => {
  try {
    let store = await Store.findOne({ owner: req.user._id });
    if (!store && req.user.role === 'admin') store = await Store.findOne();

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    const {
      status,
      email,
      phone,
      address,
      description,
      settings: nestedSettings,
      // Banking & Payouts direct fields
      payoutMethod,
      bankName,
      accountHolder,
      accountNumber,
      routingNumber,
      paypalEmail,
      payoutSchedule,
      // Tax direct fields
      taxId,
      businessType,
      collectTax,
      defaultTaxRate,
      // Fulfillment direct fields
      freeShippingThreshold,
      processingTime,
      autoFulfillDigital,
      enableLocalPickup,
      // Notification direct fields
      orderEmailAlerts,
      lowStockAlerts,
      lowStockThreshold,
      customerSmsAlerts
    } = req.body;

    // General store attributes
    if (status && ['pending', 'active', 'suspended', 'closed'].includes(status)) {
      store.status = status;
    }
    if (email !== undefined) store.email = email.trim().toLowerCase();
    if (phone !== undefined) store.phone = phone.trim();
    if (description !== undefined) store.description = description.trim();
    if (address && typeof address === 'object') {
      const existingAddress = store.address?.toObject?.() || store.address || {};
      store.address = { ...existingAddress, ...address };
    }

    // Merge operational settings (support nested settings object or top-level body fields)
    const currentSettings = store.settings?.toObject?.() || store.settings || {};
    const incomingOperational = {
      ...(nestedSettings && typeof nestedSettings === 'object' ? nestedSettings : {}),
      ...(payoutMethod !== undefined && { payoutMethod }),
      ...(bankName !== undefined && { bankName }),
      ...(accountHolder !== undefined && { accountHolder }),
      ...(accountNumber !== undefined && { accountNumber }),
      ...(routingNumber !== undefined && { routingNumber }),
      ...(paypalEmail !== undefined && { paypalEmail }),
      ...(payoutSchedule !== undefined && { payoutSchedule }),
      ...(taxId !== undefined && { taxId }),
      ...(businessType !== undefined && { businessType }),
      ...(collectTax !== undefined && { collectTax: Boolean(collectTax) }),
      ...(defaultTaxRate !== undefined && { defaultTaxRate: String(defaultTaxRate) }),
      ...(freeShippingThreshold !== undefined && { freeShippingThreshold: String(freeShippingThreshold) }),
      ...(processingTime !== undefined && { processingTime }),
      ...(autoFulfillDigital !== undefined && { autoFulfillDigital: Boolean(autoFulfillDigital) }),
      ...(enableLocalPickup !== undefined && { enableLocalPickup: Boolean(enableLocalPickup) }),
      ...(orderEmailAlerts !== undefined && { orderEmailAlerts: Boolean(orderEmailAlerts) }),
      ...(lowStockAlerts !== undefined && { lowStockAlerts: Boolean(lowStockAlerts) }),
      ...(lowStockThreshold !== undefined && { lowStockThreshold: String(lowStockThreshold) }),
      ...(customerSmsAlerts !== undefined && { customerSmsAlerts: Boolean(customerSmsAlerts) })
    };

    store.settings = {
      ...currentSettings,
      ...incomingOperational
    };

    await store.save();

    return res.status(200).json({
      success: true,
      message: 'Store operational settings updated successfully.',
      data: store
    });
  } catch (error) {
    console.error('Error updating store settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update store settings.',
      error: error.message
    });
  }
};

/**
 * @desc    Get all stores from MongoDB (Admin)
 * @route   GET /api/stores
 * @access  Private / Admin
 */
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find()
      .populate('owner', 'email')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: stores
    });
  } catch (error) {
    console.error('Error fetching all stores:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch stores list.',
      error: error.message
    });
  }
};

/**
 * @desc    Update store by ID (Admin)
 * @route   PATCH /api/stores/:id
 * @access  Private / Admin
 */
export const updateStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid store ID format.'
      });
    }

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.'
      });
    }

    const { name, description, phone, email, city, address, status, isVerified } = req.body;

    // Slug generation: Always regenerate slug on backend if name changes
    if (name && name.trim() !== store.name) {
      store.name = name.trim();
      store.slug = await getUniqueStoreSlug(name, store._id);
    }

    if (description !== undefined) store.description = description.trim();
    if (phone !== undefined) store.phone = phone.trim();
    if (email !== undefined) store.email = email.trim().toLowerCase();

    // Preserve existing address fields when updating city or address
    if (city !== undefined || address !== undefined) {
      const existingAddress = store.address?.toObject?.() || store.address || {};
      const incomingAddress = typeof address === 'object' && address !== null ? address : {};
      store.address = {
        street: incomingAddress.street !== undefined ? incomingAddress.street : (existingAddress.street || ''),
        city: city !== undefined ? city.trim() : (incomingAddress.city !== undefined ? incomingAddress.city : (existingAddress.city || '')),
        state: incomingAddress.state !== undefined ? incomingAddress.state : (existingAddress.state || ''),
        postalCode: incomingAddress.postalCode !== undefined ? incomingAddress.postalCode : (existingAddress.postalCode || ''),
        country: incomingAddress.country !== undefined ? incomingAddress.country : (existingAddress.country || '')
      };
    }

    if (status !== undefined) {
      if (!['pending', 'active', 'suspended', 'closed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Allowed values: 'pending', 'active', 'suspended', 'closed'."
        });
      }
      store.status = status;
    }

    if (isVerified !== undefined) {
      store.isVerified = Boolean(isVerified);
    }

    await store.save();
    await store.populate('owner', 'email');

    return res.status(200).json({
      success: true,
      message: 'Store updated successfully.',
      data: store
    });
  } catch (error) {
    console.error('Error updating store:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update store.',
      error: error.message
    });
  }
};

/**
 * @desc    Delete store by ID (Admin)
 * @route   DELETE /api/stores/:id
 * @access  Private / Admin
 */
export const deleteStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid store ID format.'
      });
    }

    const store = await Store.findByIdAndDelete(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Store deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting store:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete store.',
      error: error.message
    });
  }
};

/**
 * @desc    Update store status by ID (Admin)
 * @route   PATCH /api/stores/:id/status
 * @access  Private / Admin
 */
export const updateStoreStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid store ID format.'
      });
    }

    if (!status || !['pending', 'active', 'suspended', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: 'pending', 'active', 'suspended', 'closed'."
      });
    }

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.'
      });
    }

    store.status = status;
    await store.save();
    await store.populate('owner', 'email');

    return res.status(200).json({
      success: true,
      message: 'Store status updated successfully.',
      data: store
    });
  } catch (error) {
    console.error('Error updating store status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update store status.',
      error: error.message
    });
  }
};

/**
 * @desc    Update store verification by ID (Admin)
 * @route   PATCH /api/stores/:id/verification
 * @access  Private / Admin
 */
export const toggleStoreVerificationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid store ID format.'
      });
    }

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.'
      });
    }

    if (req.body.isVerified !== undefined) {
      store.isVerified = Boolean(req.body.isVerified);
    } else {
      store.isVerified = !store.isVerified;
    }

    await store.save();
    await store.populate('owner', 'email');

    return res.status(200).json({
      success: true,
      message: 'Store verification updated successfully.',
      data: store
    });
  } catch (error) {
    console.error('Error updating store verification:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update store verification.',
      error: error.message
    });
  }
};

// Get single store by ID - Admin
export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID",
      });
    }

    const store = await Store.findById(id).populate(
      "owner",
      "name email phone avatar"
    );

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    console.error("Get store by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch store",
    });
  }
};