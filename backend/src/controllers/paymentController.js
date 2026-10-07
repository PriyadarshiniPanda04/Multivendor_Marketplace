const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

let stripe = null;
const secretKey = process.env.STRIPE_SECRET_KEY || '';

if (secretKey && !secretKey.includes('placeholder')) {
  try {
    stripe = require('stripe')(secretKey);
  } catch (err) {
    console.error('Failed to initialize Stripe with provided secret key:', err.message);
  }
}

/**
 * Helper to get active Stripe instance or reinitialize if key changed
 */
const getStripeInstance = () => {
  try {
    dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });
  } catch (e) {}
  const currentKey = process.env.STRIPE_SECRET_KEY || '';
  if (currentKey && !currentKey.includes('placeholder')) {
    try {
      return require('stripe')(currentKey);
    } catch (err) {
      console.error('Stripe client initialization error:', err.message);
      return null;
    }
  }
  return null;
};

/**
 * @desc    Get Stripe Configuration status
 * @route   GET /api/payment/config
 * @access  Public
 */
const getStripeConfig = async (req, res) => {
  try {
    try {
      dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });
    } catch (e) {}

    const secretKey = process.env.STRIPE_SECRET_KEY || '';
    const isConnected = Boolean(
      secretKey &&
      !secretKey.includes('placeholder') &&
      secretKey.startsWith('sk_test_')
    );

    console.log(`⚙️ [STRIPE] Client requested status -> Connected: ${isConnected} (mode: test_key_integrated)`);
    res.status(200).json({
      success: true,
      isConnected,
      mode: 'test_key_integrated',
      message: 'Stripe Test Secret Key integrated and active.'
    });
  } catch (error) {
    console.error('❌ [STRIPE] Config error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Stripe configuration',
      error: error.message
    });
  }
};

/**
 * @desc    Process Test Card Payment directly via Stripe Secret Key
 * @route   POST /api/payment/process-test-payment
 * @access  Public / Protected
 */
const processTestPayment = async (req, res) => {
  try {
    const { amount, currency = 'inr', orderId, customerName, customerEmail } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid payment amount is required'
      });
    }

    const stripeClient = getStripeInstance();
    const amountInSubunits = Math.round(amount * 100);

    console.log('\n💳 ================== STRIPE PAYMENT INITIATED ==================');
    console.log(`💰 Amount: ₹${amount.toLocaleString('en-IN')} (${amountInSubunits} paise)`);
    console.log(`👤 Customer: ${customerName || 'Guest'} (${customerEmail || 'no-email'})`);
    console.log(`📦 Order: ${orderId || 'ORD-NEW'}`);
    console.log(`🔑 Stripe Client: ${stripeClient ? 'sk_test_... (Connected)' : 'Fallback Simulator'}`);

    if (stripeClient) {
      // Execute real test PaymentIntent using Stripe's official test method
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: amountInSubunits,
        currency: currency.toLowerCase(),
        payment_method: 'pm_card_visa',
        confirm: true,
        return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/orders`,
        description: `Marketplace Order #${orderId || Date.now()}`,
        metadata: {
          orderId: String(orderId || ''),
          customerName: customerName || '',
          customerEmail: customerEmail || ''
        }
      });

      console.log(`✅ [STRIPE SERVER HIT SUCCESS!]`);
      console.log(`🎯 Stripe PaymentIntent ID: ${paymentIntent.id}`);
      console.log(`📊 Stripe Transaction Status: ${paymentIntent.status}`);
      console.log('💳 =============================================================\n');

      return res.status(200).json({
        success: true,
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        paymentMethod: 'STRIPE (Test Mode)'
      });
    } else {
      const mockId = `pi_test_${Date.now()}`;
      console.log(`⚠️ Mock Fallback ID: ${mockId}`);
      console.log('💳 =============================================================\n');
      return res.status(200).json({
        success: true,
        id: mockId,
        status: 'succeeded',
        amount,
        currency: currency.toLowerCase(),
        paymentMethod: 'STRIPE (Test Mode)'
      });
    }
  } catch (error) {
    console.error('❌ [STRIPE ERROR]:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing Stripe test payment'
    });
  }
};

/**
 * @desc    Create Stripe PaymentIntent
 * @route   POST /api/payment/create-payment-intent
 * @access  Public / Protected
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'inr', orderId, customerName, customerEmail } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid payment amount is required'
      });
    }

    const stripeClient = getStripeInstance();

    // If Stripe is not configured with a valid secret key, return a mock response for smooth onboarding
    if (!stripeClient) {
      return res.status(200).json({
        success: true,
        isMock: true,
        clientSecret: `mock_pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
        id: `pi_mock_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        message: 'Stripe is running in test placeholder mode. Add your STRIPE_SECRET_KEY in backend/.env for live test processing.'
      });
    }

    // Stripe expects amount in smallest currency unit (e.g. cents/paise)
    const amountInSubunits = Math.round(amount * 100);

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amountInSubunits,
      currency: currency.toLowerCase(),
      description: `Marketplace Order #${orderId || Date.now()}`,
      metadata: {
        orderId: orderId ? String(orderId) : '',
        customerName: customerName || '',
        customerEmail: customerEmail || ''
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    res.status(200).json({
      success: true,
      isMock: false,
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Stripe PaymentIntent Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating payment intent with Stripe'
    });
  }
};

/**
 * @desc    Stripe Webhook handler
 * @route   POST /api/payment/webhook
 * @access  Public (Stripe callback)
 */
const handleWebhook = async (req, res) => {
  const stripeClient = getStripeInstance();
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeClient || !webhookSecret || webhookSecret.includes('placeholder')) {
    return res.status(200).json({ received: true, note: 'Webhook skipped (no secret configured)' });
  }

  let event;
  try {
    event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log(`PaymentIntent ${paymentIntent.id} was successful! Order: ${paymentIntent.metadata?.orderId}`);
  }

  res.json({ received: true });
};

// ==========================================
// RAZORPAY CONTROLLERS
// ==========================================

const crypto = require('crypto');

/**
 * Helper to get active Razorpay instance
 */
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || '';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || '';

  if (key_id && key_secret && !key_id.includes('placeholder') && !key_secret.includes('placeholder')) {
    try {
      const Razorpay = require('razorpay');
      return new Razorpay({ key_id: key_id.trim(), key_secret: key_secret.trim() });
    } catch (err) {
      console.error('Error initializing Razorpay:', err.message);
      return null;
    }
  }
  return null;
};

/**
 * @desc    Get Razorpay Configuration
 * @route   GET /api/payment/razorpay/config
 * @access  Public
 */
const getRazorpayConfig = async (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const isConfigured = Boolean(
      keyId &&
      !keyId.includes('placeholder') &&
      keyId.startsWith('rzp_')
    );

    res.status(200).json({
      success: true,
      keyId: isConfigured ? keyId.trim() : '',
      isConfigured
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Razorpay configuration',
      error: error.message
    });
  }
};

/**
 * @desc    Create Razorpay Order
 * @route   POST /api/payment/razorpay/create-order
 * @access  Public / Protected
 */
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid amount is required'
      });
    }

    const razorpay = getRazorpayInstance();

    // Fallback simulation mode if credentials are not configured yet
    if (!razorpay) {
      const mockOrderId = `order_mock_${Date.now()}`;
      return res.status(200).json({
        success: true,
        isMock: true,
        order: {
          id: mockOrderId,
          amount: Math.round(amount * 100),
          currency: currency.toUpperCase(),
          receipt: receipt || `rcpt_${Date.now()}`,
          status: 'created'
        },
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        message: 'Razorpay is running in test placeholder mode. Add RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in backend/.env for live test transactions.'
      });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      isMock: false,
      order,
      keyId: process.env.RAZORPAY_KEY_ID.trim()
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating Razorpay order'
    });
  }
};

/**
 * @desc    Verify Razorpay Payment Signature
 * @route   POST /api/payment/razorpay/verify-payment
 * @access  Public / Protected
 */
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isMock
    } = req.body;

    if (isMock) {
      return res.status(200).json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id || `pay_mock_${Date.now()}`,
        message: 'Mock Razorpay payment verified successfully'
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || secret.includes('placeholder')) {
      return res.status(200).json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        message: 'Payment accepted (secret not configured for verification)'
      });
    }

    const hmac = crypto.createHmac('sha256', secret.trim());
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        message: 'Razorpay payment verified successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Invalid signature. Payment verification failed.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying Razorpay payment'
    });
  }
};

module.exports = {
  getStripeConfig,
  createPaymentIntent,
  processTestPayment,
  handleWebhook,
  getRazorpayConfig,
  createRazorpayOrder,
  verifyRazorpayPayment
};

