import express from 'express';
import {
  createOrder,
  getOrderByIdentifier,
  getMyOrders,
  getAllOrdersAdmin,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/admin', protect, adminOnly, getAllOrdersAdmin);
router.get('/:identifier', optionalAuth, getOrderByIdentifier);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
