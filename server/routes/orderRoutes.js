const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  confirmPayment
} = require('../controllers/orderController');
const {
  createOrderValidation,
  updateOrderStatusValidation,
  validateRequest
} = require('../middleware/validate');

// Customer routes
router.post('/', protect, createOrderValidation, validateRequest, createOrder);
router.get('/my-orders', protect, getOrders);
router.get('/:id', protect, getOrder);
router.post('/confirm-payment', protect, confirmPayment);

// Admin routes
router.patch(
  '/:id/status',
  protect,
  authorize('admin'),
  updateOrderStatusValidation,
  validateRequest,
  updateOrderStatus
);

module.exports = router; 