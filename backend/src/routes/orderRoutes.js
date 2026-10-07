const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getVendorOrders,
  updateOrderItemStatus,
  updateOrderToPaid,
  getAllOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Customer order placement
router.post('/', protect, createOrder);

// Customer specific order history (must be before /:id)
router.get('/my-orders', protect, getMyOrders);

// Vendor specific orders (must be before /:id)
router.get('/vendor/orders', protect, authorize('vendor'), getVendorOrders);

// Admin get all orders
router.get('/', protect, authorize('admin'), getAllOrders);

// Single order details
router.get('/:id', protect, getOrderById);

// Vendor updates specific item fulfillment status
router.patch('/:orderId/items/:itemId/status', protect, authorize('vendor', 'admin'), updateOrderItemStatus);

// Mark order as paid
router.put('/:id/pay', protect, updateOrderToPaid);

module.exports = router;
