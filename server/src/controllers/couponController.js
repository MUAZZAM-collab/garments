import Coupon from '../models/Coupon.js';

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public / Private
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid privilege promo code.' });
    }

    const userTier = req.user?.tier || 'Silver';
    const validation = coupon.isValid(Number(subtotal) || 0, userTier);

    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.reason });
    }

    let calculatedDiscount = 0;
    if (coupon.type === 'percentage') {
      calculatedDiscount = Math.round(((Number(subtotal) || 0) * coupon.value) / 100);
    } else {
      calculatedDiscount = Math.min(Number(subtotal) || 0, coupon.value);
    }

    res.json({
      success: true,
      message: `Privilege code '${coupon.code}' successfully applied!`,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: calculatedDiscount,
        isVipOnly: coupon.isVipOnly,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all coupons
// @route   GET /api/coupons
// @access  Private / Admin
export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create coupon
// @route   POST /api/coupons
// @access  Private / Admin
export const createCoupon = async (req, res, next) => {
  try {
    const { code, type, value, minOrder, expiresAt, usageLimit, isVipOnly, allowedTiers, description } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists.' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      description,
      type,
      value: Number(value),
      minOrder: Number(minOrder) || 0,
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: Number(usageLimit) || 100,
      isVipOnly: Boolean(isVipOnly),
      allowedTiers: allowedTiers || ['Rose Gold', 'Black Card'],
    });

    res.status(201).json({ success: true, message: 'Coupon created.', coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private / Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.json({ success: true, message: 'Coupon removed.' });
  } catch (error) {
    next(error);
  }
};
