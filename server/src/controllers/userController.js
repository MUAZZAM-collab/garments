import User from '../models/User.js';
import Order from '../models/Order.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password && password.trim() !== '') {
      user.password = password;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile details updated.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tier: user.tier,
        loyaltyPoints: user.loyaltyPoints,
        lifetimeSpend: user.lifetimeSpend,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const { label, recipientName, phone, streetAddress, apartment, city, postalCode, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses.push({
      label: label || 'Home',
      recipientName,
      phone,
      streetAddress,
      apartment: apartment || '',
      city,
      postalCode: postalCode || '',
      isDefault: isDefault || user.addresses.length === 0,
    });

    await user.save();
    res.status(201).json({ success: true, message: 'Address saved.', addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json({ success: true, message: 'Address removed.', addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist/:productId
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const existsIndex = user.wishlist.findIndex((id) => id.toString() === productId);
    let added = false;

    if (existsIndex > -1) {
      user.wishlist.splice(existsIndex, 1);
    } else {
      user.wishlist.push(productId);
      added = true;
    }

    await user.save();
    await user.populate('wishlist', 'title slug price comparePrice images category variants');

    res.json({
      success: true,
      message: added ? 'Piece saved to your private wishlist.' : 'Piece removed from wishlist.',
      wishlist: user.wishlist,
      isWishlisted: added,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user VIP details & tier progress
// @route   GET /api/users/vip-status
// @access  Private
export const getVipStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const spend = user.lifetimeSpend || 0;

    let currentTier = user.tier;
    let nextTier = 'Rose Gold';
    let progressPercentage = 0;
    let amountNeeded = 0;

    if (spend < 25000) {
      currentTier = 'Silver';
      nextTier = 'Rose Gold';
      progressPercentage = Math.min(100, Math.round((spend / 25000) * 100));
      amountNeeded = 25000 - spend;
    } else if (spend < 60000) {
      currentTier = 'Rose Gold';
      nextTier = 'Black Card';
      progressPercentage = Math.min(100, Math.round(((spend - 25000) / 35000) * 100));
      amountNeeded = 60000 - spend;
    } else {
      currentTier = 'Black Card';
      nextTier = 'Top Tier Privilege Reached';
      progressPercentage = 100;
      amountNeeded = 0;
    }

    const perks = [
      { name: 'Complimentary Nationwide Shipping', silver: false, roseGold: true, blackCard: true },
      { name: 'Secret Drop Early Access (24 Hours)', silver: true, roseGold: true, blackCard: true },
      { name: 'Dedicated VIP Atelier Concierge via WhatsApp', silver: false, roseGold: true, blackCard: true },
      { name: 'Private Annual Birthday Privilege (25% Off)', silver: false, roseGold: true, blackCard: true },
      { name: 'Complimentary Monogramming & Custom Sizing', silver: false, roseGold: false, blackCard: true },
      { name: 'Invitations to Private Trunk Shows', silver: false, roseGold: false, blackCard: true },
    ];

    res.json({
      success: true,
      vip: {
        tier: currentTier,
        points: user.loyaltyPoints,
        lifetimeSpend: spend,
        nextTier,
        progressPercentage,
        amountNeeded,
        perks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all customers
// @route   GET /api/users/admin/customers
// @access  Private / Admin
export const getAllCustomersAdmin = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update customer tier / promote to VIP
// @route   PUT /api/users/admin/:id/tier
// @access  Private / Admin
export const updateCustomerTierAdmin = async (req, res, next) => {
  try {
    const { tier, loyaltyPoints } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    if (tier) user.tier = tier;
    if (loyaltyPoints !== undefined) user.loyaltyPoints = Number(loyaltyPoints);

    await user.save();
    res.json({ success: true, message: `Customer tier updated to ${user.tier}.`, user });
  } catch (error) {
    next(error);
  }
};
