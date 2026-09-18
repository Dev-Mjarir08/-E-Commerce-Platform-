import Address from '../models/Address.js';

/**
 * @desc    Get all saved addresses for current user
 * @route   GET /api/addresses
 * @access  Protected
 */
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    const addresses = await Address.find({ user: userId }).sort({
      isDefaultShipping: -1,
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses
    });
  } catch (error) {
    console.error('Error in getAddresses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve saved addresses.',
      error: error.message
    });
  }
};

/**
 * @desc    Get single address by ID
 * @route   GET /api/addresses/:id
 * @access  Protected
 */
export const getAddressById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error in getAddressById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve address.',
      error: error.message
    });
  }
};

/**
 * @desc    Create new address
 * @route   POST /api/addresses
 * @access  Protected
 */
export const createAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      recipientName,
      phone,
      street,
      apartment,
      city,
      state,
      postalCode,
      country = 'US',
      addressType = 'home',
      isDefaultShipping = false,
      isDefaultBilling = false
    } = req.body;

    // Validation
    if (!recipientName || !phone || !street || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Recipient name, phone, street, city, state, and postal code are required.'
      });
    }

    // Count existing addresses
    const count = await Address.countDocuments({ user: userId });
    const isFirst = count === 0;

    // If first address or marked default shipping, ensure other addresses are unmarked
    let defaultShipping = isDefaultShipping || isFirst;
    let defaultBilling = isDefaultBilling || isFirst;

    if (defaultShipping) {
      await Address.updateMany({ user: userId }, { isDefaultShipping: false });
    }
    if (defaultBilling) {
      await Address.updateMany({ user: userId }, { isDefaultBilling: false });
    }

    const newAddress = await Address.create({
      user: userId,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      street: street.trim(),
      apartment: apartment ? apartment.trim() : '',
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      addressType,
      isDefaultShipping: defaultShipping,
      isDefaultBilling: defaultBilling
    });

    return res.status(201).json({
      success: true,
      message: 'Address saved successfully.',
      data: newAddress
    });
  } catch (error) {
    console.error('Error in createAddress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save address.',
      error: error.message
    });
  }
};

/**
 * @desc    Update existing address
 * @route   PUT /api/addresses/:id
 * @access  Protected
 */
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const {
      recipientName,
      phone,
      street,
      apartment,
      city,
      state,
      postalCode,
      country,
      addressType,
      isDefaultShipping,
      isDefaultBilling
    } = req.body;

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found.'
      });
    }

    if (isDefaultShipping && !address.isDefaultShipping) {
      await Address.updateMany({ user: userId, _id: { $ne: id } }, { isDefaultShipping: false });
    }

    if (isDefaultBilling && !address.isDefaultBilling) {
      await Address.updateMany({ user: userId, _id: { $ne: id } }, { isDefaultBilling: false });
    }

    if (recipientName !== undefined) address.recipientName = recipientName.trim();
    if (phone !== undefined) address.phone = phone.trim();
    if (street !== undefined) address.street = street.trim();
    if (apartment !== undefined) address.apartment = apartment.trim();
    if (city !== undefined) address.city = city.trim();
    if (state !== undefined) address.state = state.trim();
    if (postalCode !== undefined) address.postalCode = postalCode.trim();
    if (country !== undefined) address.country = country.trim();
    if (addressType !== undefined) address.addressType = addressType;
    if (isDefaultShipping !== undefined) address.isDefaultShipping = Boolean(isDefaultShipping);
    if (isDefaultBilling !== undefined) address.isDefaultBilling = Boolean(isDefaultBilling);

    await address.save();

    return res.status(200).json({
      success: true,
      message: 'Address updated successfully.',
      data: address
    });
  } catch (error) {
    console.error('Error in updateAddress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update address.',
      error: error.message
    });
  }
};

/**
 * @desc    Delete an address
 * @route   DELETE /api/addresses/:id
 * @access  Protected
 */
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found.'
      });
    }

    const wasDefaultShipping = address.isDefaultShipping;
    const wasDefaultBilling = address.isDefaultBilling;

    await Address.deleteOne({ _id: id });

    // If it was default, make another address default
    if (wasDefaultShipping) {
      const nextAddress = await Address.findOne({ user: userId });
      if (nextAddress) {
        nextAddress.isDefaultShipping = true;
        await nextAddress.save();
      }
    }

    if (wasDefaultBilling) {
      const nextAddress = await Address.findOne({ user: userId });
      if (nextAddress) {
        nextAddress.isDefaultBilling = true;
        await nextAddress.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Address removed successfully.'
    });
  } catch (error) {
    console.error('Error in deleteAddress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete address.',
      error: error.message
    });
  }
};

/**
 * @desc    Set address as default shipping or billing
 * @route   PATCH /api/addresses/:id/default
 * @access  Protected
 */
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { type = 'shipping' } = req.body; // 'shipping' or 'billing'

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found.'
      });
    }

    if (type === 'shipping') {
      await Address.updateMany({ user: userId }, { isDefaultShipping: false });
      address.isDefaultShipping = true;
    } else if (type === 'billing') {
      await Address.updateMany({ user: userId }, { isDefaultBilling: false });
      address.isDefaultBilling = true;
    } else if (type === 'both') {
      await Address.updateMany({ user: userId }, { isDefaultShipping: false, isDefaultBilling: false });
      address.isDefaultShipping = true;
      address.isDefaultBilling = true;
    }

    await address.save();

    return res.status(200).json({
      success: true,
      message: `Address set as default ${type}.`,
      data: address
    });
  } catch (error) {
    console.error('Error in setDefaultAddress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to set default address.',
      error: error.message
    });
  }
};
