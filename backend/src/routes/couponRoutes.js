const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Validate and calculate discount for a coupon
router.post('/validate', couponController.validateCoupon);

// Get all active / available coupons
router.get('/', couponController.getAllCoupons);

// Create a new coupon
router.post('/', couponController.createCoupon);

// Toggle coupon status (active/inactive)
router.patch('/:id/toggle', couponController.toggleCouponStatus);

// Delete coupon
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;
