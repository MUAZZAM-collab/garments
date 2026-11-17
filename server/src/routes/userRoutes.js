import express from 'express';
import {
  updateProfile,
  addAddress,
  deleteAddress,
  toggleWishlist,
  getVipStatus,
  getAllCustomersAdmin,
  updateCustomerTierAdmin,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.get('/vip-status', protect, getVipStatus);

// Admin-only customer routes
router.get('/admin/customers', protect, adminOnly, getAllCustomersAdmin);
router.put('/admin/:id/tier', protect, adminOnly, updateCustomerTierAdmin);

export default router;
