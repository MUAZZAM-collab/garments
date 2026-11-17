import express from 'express';
import {
  getProductReviews,
  createReview,
  getAllReviewsAdmin,
  moderateReview,
} from '../controllers/reviewController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', optionalAuth, createReview);
router.get('/admin', protect, adminOnly, getAllReviewsAdmin);
router.put('/:id/moderation', protect, adminOnly, moderateReview);

export default router;
