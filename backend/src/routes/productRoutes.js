const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyVendorProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public catalog routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);

// Vendor managed products (must be defined before /:idOrSlug)
router.get('/vendor/me', protect, authorize('vendor'), getMyVendorProducts);

// Product details by ID or Slug
router.get('/:idOrSlug', getProductById);

// Protected mutation routes
router.post('/', protect, authorize('vendor'), createProduct);
router.put('/:id', protect, authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);

module.exports = router;
