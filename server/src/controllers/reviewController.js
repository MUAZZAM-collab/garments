import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Get approved reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a review for a product
// @route   POST /api/reviews/product/:productId
// @access  Public / Private
export const createReview = async (req, res, next) => {
  try {
    const { rating, comment, authorName, fitFeedback, images } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user ? req.user._id : null,
      authorName: authorName || req.user?.name || 'Verified Client',
      rating: Number(rating),
      comment,
      fitFeedback: fitFeedback || 'True to Size',
      images: images || [],
      isApproved: true,
      isVerifiedPurchase: true,
    });

    // Recalculate product rating & review count
    const allReviews = await Review.find({ product: productId, isApproved: true });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / (allReviews.length || 1);
    
    product.ratings = Number(avgRating.toFixed(1));
    product.numReviews = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for your review. It has been published.',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all reviews
// @route   GET /api/reviews/admin
// @access  Private / Admin
export const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'title slug images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Approve or Reject review
// @route   PUT /api/reviews/:id/moderation
// @access  Private / Admin
export const moderateReview = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: Boolean(isApproved) },
      { new: true }
    );

    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    // Recalculate product average rating
    const allReviews = await Review.find({ product: review.product, isApproved: true });
    const avgRating = allReviews.length > 0
      ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
      : 5.0;

    await Product.findByIdAndUpdate(review.product, {
      ratings: Number(avgRating.toFixed(1)),
      numReviews: allReviews.length,
    });

    res.json({ success: true, message: `Review ${isApproved ? 'approved' : 'hidden'}.`, review });
  } catch (error) {
    next(error);
  }
};
