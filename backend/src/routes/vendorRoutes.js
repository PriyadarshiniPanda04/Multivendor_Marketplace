const express = require('express');
const router = express.Router();
const {
  registerVendor,
  getMyVendorProfile,
  updateMyVendorProfile,
  getAllVendors,
  getVendorBySlug,
  getVendorStats,
  updateVendorStatus
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllVendors);
router.get('/:slug', getVendorBySlug);

// Vendor onboarding (any logged in user can apply)
router.post('/register', protect, registerVendor);

// Vendor authenticated routes
router.get('/me', protect, authorize('vendor'), getMyVendorProfile);
router.put('/me', protect, authorize('vendor'), updateMyVendorProfile);
router.get('/stats', protect, authorize('vendor'), getVendorStats);

// Admin only routes
router.patch('/:id/status', protect, authorize('admin'), updateVendorStatus);

module.exports = router;
