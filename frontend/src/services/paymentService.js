import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch Stripe configuration from backend
 */
export const getStripeConfig = async () => {
  try {
    const res = await axios.get(`${API_BASE}/payment/config`);
    return res.data;
  } catch (err) {
    console.warn('Backend payment config unavailable, falling back to local env:', err.message);
    const localKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
    return {
      success: true,
      publishableKey: localKey && !localKey.includes('placeholder') ? localKey : '',
      isConfigured: Boolean(localKey && !localKey.includes('placeholder') && localKey.startsWith('pk_'))
    };
  }
};

/**
 * Create PaymentIntent on backend
 */
export const createPaymentIntent = async ({ amount, currency = 'inr', orderId, customerName, customerEmail }) => {
  try {
    const res = await axios.post(`${API_BASE}/payment/create-payment-intent`, {
      amount,
      currency,
      orderId,
      customerName,
      customerEmail
    });
    return res.data;
  } catch (err) {
    console.error('Error creating payment intent:', err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

// ==========================================
// RAZORPAY SERVICES
// ==========================================

/**
 * Dynamically load Razorpay SDK checkout.js
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Fetch Razorpay configuration from backend
 */
export const getRazorpayConfig = async () => {
  try {
    const res = await axios.get(`${API_BASE}/payment/razorpay/config`);
    return res.data;
  } catch (err) {
    console.warn('Backend Razorpay config unavailable, falling back to local env:', err.message);
    const localKey = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    return {
      success: true,
      keyId: localKey && !localKey.includes('placeholder') ? localKey : '',
      isConfigured: Boolean(localKey && !localKey.includes('placeholder') && localKey.startsWith('rzp_'))
    };
  }
};

/**
 * Create Razorpay Order
 */
export const createRazorpayOrder = async ({ amount, currency = 'INR', receipt }) => {
  try {
    const res = await axios.post(`${API_BASE}/payment/razorpay/create-order`, {
      amount,
      currency,
      receipt
    });
    return res.data;
  } catch (err) {
    console.error('Error creating Razorpay order:', err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

/**
 * Verify Razorpay Payment Signature
 */
export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const res = await axios.post(`${API_BASE}/payment/razorpay/verify-payment`, paymentData);
    return res.data;
  } catch (err) {
    console.error('Error verifying Razorpay payment:', err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

// ==========================================
// EMAIL SERVICES
// ==========================================

/**
 * Trigger Order Confirmation Email
 */
export const sendOrderConfirmationEmailAPI = async ({ order, customerEmail, customerName }) => {
  try {
    const res = await axios.post(`${API_BASE}/email/order-confirmation`, {
      order,
      customerEmail,
      customerName
    });
    return res.data;
  } catch (err) {
    console.warn('Order confirmation email trigger notice:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Check SMTP status from backend
 */
export const getSmtpStatusAPI = async () => {
  try {
    const res = await axios.get(`${API_BASE}/email/status`);
    return res.data;
  } catch (err) {
    return { success: false, isConfigured: false, message: err.message };
  }
};


