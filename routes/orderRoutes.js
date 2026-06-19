const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getAllOrders,
  updateOrderStatus, getDashboardStats, verifyPayment
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/verify-payment', protect, adminOnly, verifyPayment);

module.exports = router;