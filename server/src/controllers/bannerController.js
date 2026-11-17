import Banner from '../models/Banner.js';

// @desc    Get active banners
// @route   GET /api/banners
// @access  Public
export const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, count: banners.length, banners });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all banners
// @route   GET /api/banners/admin
// @access  Private / Admin
export const getAllBannersAdmin = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ sortOrder: 1 });
    res.json({ success: true, count: banners.length, banners });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create banner
// @route   POST /api/banners
// @access  Private / Admin
export const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, message: 'Hero banner created.', banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update banner
// @route   PUT /api/banners/:id
// @access  Private / Admin
export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found.' });
    res.json({ success: true, message: 'Hero banner updated.', banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete banner
// @route   DELETE /api/banners/:id
// @access  Private / Admin
export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found.' });
    res.json({ success: true, message: 'Banner deleted.' });
  } catch (error) {
    next(error);
  }
};
