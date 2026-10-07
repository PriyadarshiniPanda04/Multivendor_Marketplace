const express = require('express');
const router = express.Router();
const {
  getCommissionSettings,
  updateCommissionSettings,
  calculateCommissionQuote,
  getVendorFinancials,
  requestPayout,
  getAllPayouts,
  updatePayoutStatus
} = require('../controllers/commissionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Optional/Public routes
router.get('/settings', getCommissionSettings);
router.post('/calculate', calculateCommissionQuote);

// Vendor Financials & Payout Request
router.get('/seller/financials', protect, getVendorFinancials);
router.post('/payouts/request', protect, requestPayout);

// Admin Commission & Payouts Management
router.put('/settings', protect, authorize('admin'), updateCommissionSettings);
router.get('/payouts', protect, authorize('admin'), getAllPayouts);
router.patch('/payouts/:id/status', protect, authorize('admin'), updatePayoutStatus);

module.exports = router;
