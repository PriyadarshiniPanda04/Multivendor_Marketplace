const express = require('express');
const router = express.Router();
const {
  isSmtpConfigured,
  verifyConnection,
  sendOrderConfirmationEmail,
  sendWelcomeEmail,
  sendTestEmail
} = require('../services/emailService');

/**
 * @desc    Check SMTP configuration status
 * @route   GET /api/email/status
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const configured = isSmtpConfigured();
    const connection = configured ? await verifyConnection() : { connected: false, message: 'SMTP credentials not configured yet' };

    res.status(200).json({
      success: true,
      isConfigured: configured,
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      user: configured ? process.env.SMTP_USER : 'Not configured',
      from: process.env.SMTP_FROM || 'BazaarHub Marketplace <noreply@bazaarhub.com>',
      connection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @desc    Send test email to verify credentials
 * @route   POST /api/email/test
 * @access  Public
 */
router.post('/test', async (req, res) => {
  try {
    const { to } = req.body;
    const result = await sendTestEmail({ to });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @desc    Send order confirmation email
 * @route   POST /api/email/order-confirmation
 * @access  Public
 */
router.post('/order-confirmation', async (req, res) => {
  try {
    const { order, customerEmail, customerName } = req.body;
    if (!order) {
      return res.status(400).json({ success: false, message: 'Order data required' });
    }

    const result = await sendOrderConfirmationEmail({ order, customerEmail, customerName });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @desc    Send welcome email
 * @route   POST /api/email/welcome
 * @access  Public
 */
router.post('/welcome', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const result = await sendWelcomeEmail({ email, name });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
