const express = require('express');
const router = express.Router();
const {
  getStripeConfig,
  createPaymentIntent,
  processTestPayment,
  handleWebhook,
  getRazorpayConfig,
  createRazorpayOrder,
  verifyRazorpayPayment
} = require('../controllers/paymentController');

// Retrieve Stripe status
router.get('/config', getStripeConfig);

// Process Test Card Payment directly via Stripe Secret Key
router.post('/process-test-payment', processTestPayment);

// Create Stripe PaymentIntent
router.post('/create-payment-intent', createPaymentIntent);

// Stripe Webhook listener
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// ==========================================
// Razorpay Routes
// ==========================================

// Retrieve Razorpay Key ID
router.get('/razorpay/config', getRazorpayConfig);

// Create Razorpay Order
router.post('/razorpay/create-order', createRazorpayOrder);

// Verify Razorpay Payment Signature
router.post('/razorpay/verify-payment', verifyRazorpayPayment);

module.exports = router;
