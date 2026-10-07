const express = require('express');
const router = express.Router();
const {
  createReturnRequest,
  getMyReturns,
  getVendorReturns,
  getReturnById,
  updateReturnStatus,
  getAllReturns
} = require('../controllers/returnController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public or optional-auth fallback for return creation in development / demo
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();
  return protect(req, res, next);
};

// Customer routes
router.post('/', optionalAuth, createReturnRequest);
router.get('/my-returns', protect, getMyReturns);

// Vendor / Seller routes
router.get('/seller/returns', protect, authorize('vendor', 'admin'), getVendorReturns);

// Admin routes
router.get('/', protect, authorize('admin'), getAllReturns);

// Single return details and status update
router.get('/:id', getReturnById);
router.patch('/:id/status', updateReturnStatus); // Allows seller/admin to update 5-step status

module.exports = router;
