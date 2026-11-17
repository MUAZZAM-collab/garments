import User from '../models/User.js';
import { generateTokens, clearAuthCookies } from '../utils/generateToken.js';

// @desc    Register a new customer account
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'customer',
      tier: 'Silver',
      loyaltyPoints: 100, // 100 welcome privilege points
    });

    const { accessToken } = generateTokens(res, user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Welcome to VELOURA Privé. Your account has been created.',
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
        wishlist: user.wishlist,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get tokens
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify and try again.' });
    }

    const { accessToken } = generateTokens(res, user._id, user.role);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}`,
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
        wishlist: user.wishlist,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log out current user & clear cookies
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  clearAuthCookies(res);
  res.json({ success: true, message: 'Signed out successfully.' });
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'title slug price comparePrice images category variants');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
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
        wishlist: user.wishlist,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
