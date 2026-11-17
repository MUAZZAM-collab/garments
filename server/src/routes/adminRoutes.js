import express from 'express';
import { getDashboardStats, exportProductsCSV } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/products/export-csv', protect, adminOnly, exportProductsCSV);

export default router;
