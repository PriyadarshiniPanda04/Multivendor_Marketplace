const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Checks if real SMTP credentials are provided
 */
const isSmtpConfigured = () => {
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  return Boolean(
    user &&
    pass &&
    !user.includes('your_email') &&
    !user.includes('placeholder') &&
    !pass.includes('your_gmail') &&
    !pass.includes('placeholder')
  );
};

/**
 * Create Nodemailer Transporter
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Verify SMTP Connection
 */
const verifyConnection = async () => {
  if (!isSmtpConfigured()) {
    return {
      connected: false,
      message: 'SMTP credentials not configured (placeholder values present)'
    };
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();
    return {
      connected: true,
      message: 'SMTP server connection established successfully'
    };
  } catch (error) {
    return {
      connected: false,
      message: error.message || 'SMTP connection failed'
    };
  }
};

/**
 * Helper to send email or log mock if not configured
 */
const sendMailSafe = async ({ to, subject, html, text }) => {
  const from = process.env.SMTP_FROM || 'BazaarHub Marketplace <noreply@bazaarhub.com>';

  if (!isSmtpConfigured()) {
    console.log(`\n📨 [SMTP SIMULATION] Email to: ${to} | Subject: "${subject}"`);
    console.log(`[SMTP SIMULATION] Configure SMTP_USER and SMTP_PASS in backend/.env to deliver live emails.\n`);
    return {
      success: true,
      isMock: true,
      messageId: `mock_${Date.now()}@bazaarhub.local`,
      message: 'Email simulated in development mode (credentials not configured)'
    };
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || '',
      html
    });

    console.log(`✅ [SMTP DELIVERED] Email sent to: ${to} (MessageID: ${info.messageId})`);
    return {
      success: true,
      isMock: false,
      messageId: info.messageId
    };
  } catch (error) {
    console.error(`❌ [SMTP ERROR] Failed to send email to ${to}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// ==========================================
// EMAIL TEMPLATES
// ==========================================

/**
 * 1. Send Order Confirmation Email to Customer
 */
const sendOrderConfirmationEmail = async ({ order, customerEmail, customerName }) => {
  const to = customerEmail || order.address?.email || order.shippingAddress?.email;
  if (!to) {
    console.warn('Cannot send order confirmation: no customer email provided');
    return { success: false, message: 'Missing email' };
  }

  const name = customerName || order.address?.name || order.shippingAddress?.fullName || 'Valued Customer';
  const orderId = order.id || order._id || 'ORD-' + Date.now();
  const total = order.total || order.totalPrice || 0;
  const paymentMethod = (order.paymentMethod || 'Online Payment').toUpperCase();
  const items = order.items || order.orderItems || [];
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
        <div style="font-weight: 600; color: #0f172a; font-size: 13px;">${item.name || item.product?.name || 'Product'}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Qty: ${item.quantity || 1}</div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700; color: #0f172a; font-size: 13px;">
        ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmed - BazaarHub</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="580" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #0f172a; padding: 28px 32px; text-align: left;">
                  <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">BazaarHub<span style="color: #6366f1;">.</span></div>
                  <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Multi-Vendor Marketplace Network</div>
                </td>
              </tr>

              <!-- Status Banner -->
              <tr>
                <td style="padding: 32px 32px 20px 32px;">
                  <span style="background-color: #ecfdf5; color: #059669; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; border: 1px solid #a7f3d0; text-transform: uppercase; letter-spacing: 0.5px;">Order Confirmed</span>
                  <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 12px 0 6px 0;">Thank you, ${name}!</h1>
                  <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">
                    Your order <strong style="color: #0f172a;">#${orderId}</strong> has been confirmed and forwarded to our verified vendor partners for fulfillment.
                  </p>
                </td>
              </tr>

              <!-- Summary Card -->
              <tr>
                <td style="padding: 0 32px 24px 32px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px;">
                    <tr>
                      <td style="font-size: 11px; color: #64748b;">Order Date:</td>
                      <td align="right" style="font-size: 11px; font-weight: 600; color: #0f172a;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 11px; color: #64748b; padding-top: 6px;">Payment Method:</td>
                      <td align="right" style="font-size: 11px; font-weight: 600; color: #4f46e5; padding-top: 6px;">${paymentMethod}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 11px; color: #64748b; padding-top: 6px;">Protection:</td>
                      <td align="right" style="font-size: 11px; font-weight: 600; color: #059669; padding-top: 6px;">256-Bit Escrow Guarantee</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Items Breakdown -->
              <tr>
                <td style="padding: 0 32px 24px 32px;">
                  <h3 style="font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">Purchased Items</h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${itemsHtml}
                    <tr>
                      <td style="padding: 16px 0 0 0; font-size: 14px; font-weight: 800; color: #0f172a;">Total Amount</td>
                      <td align="right" style="padding: 16px 0 0 0; font-size: 18px; font-weight: 900; color: #0f172a;">₹${total.toLocaleString('en-IN')}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA Track Order -->
              <tr>
                <td align="center" style="padding: 0 32px 32px 32px;">
                  <a href="${clientUrl}/orders/${orderId}" style="display: inline-block; width: 100%; box-sizing: border-box; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-size: 13px; font-weight: 700; text-align: center; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);">
                    Track Order Live Status &rarr;
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; font-size: 11px; color: #94a3b8;">
                  Need help? Contact our customer support anytime.<br>
                  &copy; ${new Date().getFullYear()} BazaarHub Marketplace. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendMailSafe({
    to,
    subject: `Order Confirmation #${orderId} - BazaarHub`,
    html,
    text: `Thank you for your order #${orderId}! Total: ₹${total}. Track your order at: ${clientUrl}/orders/${orderId}`
  });
};

/**
 * 2. Send Vendor Order Notification Email
 */
const sendVendorOrderNotification = async ({ vendorEmail, vendorName, orderId, items = [] }) => {
  if (!vendorEmail) return { success: false, message: 'Missing vendor email' };

  const name = vendorName || 'Seller Partner';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const itemsList = items.map(i => `• ${i.name || 'Item'} (Qty: ${i.quantity || 1}) - ₹${(i.price || 0).toLocaleString('en-IN')}`).join('<br>');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; background-color: #f8fafc; padding: 24px; color: #0f172a;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0;">
        <span style="background-color: #e0e7ff; color: #4338ca; font-size: 10px; font-weight: bold; padding: 3px 8px; rounded: 4px;">NEW ORDER ALERT</span>
        <h2 style="margin-top: 12px; font-size: 20px;">Hello, ${name}!</h2>
        <p style="font-size: 13px; color: #475569; line-height: 1.5;">
          You have received a new customer order <strong>#${orderId}</strong> on BazaarHub. Please review the items and prepare packaging for logistics pickup:
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 12px; line-height: 1.6;">
          ${itemsList}
        </div>
        <a href="${clientUrl}/seller/dashboard" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: bold; margin-top: 8px;">
          Open Seller Dashboard &rarr;
        </a>
      </div>
    </body>
    </html>
  `;

  return sendMailSafe({
    to: vendorEmail,
    subject: `🔔 New Order #${orderId} Received - Action Required`,
    html,
    text: `New order #${orderId} received for your store! Check your Seller Dashboard at ${clientUrl}/seller/dashboard`
  });
};

/**
 * 3. Send Welcome Email to New Customer
 */
const sendWelcomeEmail = async ({ email, name = 'Friend' }) => {
  if (!email) return { success: false, message: 'Missing email' };
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; background-color: #f8fafc; padding: 24px; color: #0f172a;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <h2 style="margin: 0; font-size: 22px; font-weight: 800;">Welcome to BazaarHub, ${name}! 🎉</h2>
        <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin-top: 12px;">
          We're thrilled to have you join our marketplace network. Enjoy verified vendors, 256-bit escrow safe checkout, instant UPI/Cards, and 7-day hassle-free returns.
        </p>
        <div style="margin: 20px 0;">
          <a href="${clientUrl}/shop" style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 12px 22px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: bold;">
            Start Exploring Products &rarr;
          </a>
        </div>
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">Have questions? Reply directly to this email for customer support.</p>
      </div>
    </body>
    </html>
  `;

  return sendMailSafe({
    to: email,
    subject: `Welcome to BazaarHub, ${name}! 🎉`,
    html,
    text: `Welcome to BazaarHub, ${name}! Start exploring top deals at ${clientUrl}/shop`
  });
};

/**
 * 4. Send Test Diagnostic Email
 */
const sendTestEmail = async ({ to }) => {
  const recipient = to || process.env.SMTP_USER;
  if (!recipient || recipient.includes('placeholder')) {
    return { success: false, message: 'Please provide a valid recipient email address or set SMTP_USER in .env' };
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; padding: 20px; background-color: #f1f5f9;">
      <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #cbd5e1; max-width: 480px; margin: auto;">
        <h2 style="color: #059669; margin: 0 0 10px 0;">✅ SMTP Connection Verified!</h2>
        <p style="font-size: 13px; color: #475569;">
          Your SMTP configuration on <strong>BazaarHub</strong> is working perfectly. Automated order confirmations, vendor alerts, and welcome emails are active.
        </p>
        <p style="font-size: 11px; color: #94a3b8; margin-top: 16px;">Timestamp: ${new Date().toISOString()}</p>
      </div>
    </body>
    </html>
  `;

  return sendMailSafe({
    to: recipient,
    subject: `✅ BazaarHub SMTP Test Email - Connection Successful`,
    html,
    text: `Your BazaarHub SMTP setup is working successfully at ${new Date().toISOString()}!`
  });
};

/**
 * 5. Send Return & Refund Lifecycle Notification Email
 */
const sendReturnNotificationEmail = async ({
  to,
  customerName = 'Valued Customer',
  returnNumber,
  orderId,
  productName,
  status,
  reason,
  refundAmount,
  refundTxnId
}) => {
  const recipient = to || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!recipient) return { success: false, message: 'Missing recipient' };

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  let statusTitle = '';
  let statusMessage = '';
  let statusColor = '#f97316';

  switch (status) {
    case 'requested':
      statusTitle = 'Return Request Received';
      statusMessage = `We have received your return claim for <strong>${productName || 'your item'}</strong> (Reason: <em>${reason || 'Not specified'}</em>). The seller has been notified and will review your request shortly.`;
      statusColor = '#2563eb';
      break;
    case 'seller_review':
      statusTitle = 'Return Under Seller Review';
      statusMessage = `The merchant is actively reviewing your return claim and package details for <strong>${productName || 'your item'}</strong>.`;
      statusColor = '#d97706';
      break;
    case 'approved':
      statusTitle = 'Return Approved - Pickup Scheduled';
      statusMessage = `Good news! Your return claim for <strong>${productName || 'your item'}</strong> has been approved by the merchant. A courier executive has been assigned for pickup from your address.`;
      statusColor = '#059669';
      break;
    case 'pickup':
      statusTitle = 'Item Picked Up by Courier';
      statusMessage = `Your returned package for <strong>${productName || 'your item'}</strong> has been successfully picked up by our courier and is in transit.`;
      statusColor = '#7c3aed';
      break;
    case 'refunded':
      statusTitle = 'Refund Completed & Credited';
      statusMessage = `Your refund of <strong>₹${(refundAmount || 0).toLocaleString('en-IN')}</strong> for <strong>${productName || 'your item'}</strong> has been processed successfully. ${refundTxnId ? `Reference ID: <code>${refundTxnId}</code>` : ''}`;
      statusColor = '#10b981';
      break;
    default:
      statusTitle = `Return Update: ${status}`;
      statusMessage = `Your return claim #${returnNumber} has been updated to: ${status}.`;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #0f172a; margin: 0;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
          <span style="background-color: ${statusColor}15; color: ${statusColor}; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">
            ${statusTitle}
          </span>
          <span style="font-family: monospace; font-size: 11px; color: #64748b;">${returnNumber || 'Claim'}</span>
        </div>

        <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 800; color: #0f172a;">Hello, ${customerName}!</h2>
        <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
          ${statusMessage}
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 12px; line-height: 1.6;">
          <div style="margin-bottom: 4px;"><strong>Order ID:</strong> #${orderId || 'ORD-894120'}</div>
          <div style="margin-bottom: 4px;"><strong>Item:</strong> ${productName || 'Marketplace Item'}</div>
          ${refundAmount ? `<div style="margin-bottom: 4px;"><strong>Refund Value:</strong> ₹${refundAmount.toLocaleString('en-IN')}</div>` : ''}
          <div><strong>Current Pipeline Step:</strong> <span style="color: ${statusColor}; font-weight: bold; text-transform: capitalize;">${status.replace('_', ' ')}</span></div>
        </div>

        <div style="text-align: center; margin: 24px 0 16px 0;">
          <a href="${clientUrl}/orders" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 12px; font-weight: 700;">
            Track Return & Refund Progress &rarr;
          </a>
        </div>

        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 24px 0 0 0;">
          BazaarHub Customer Protection &bull; 7-Day Hassle-Free Returns
        </p>
      </div>
    </body>
    </html>
  `;

  return sendMailSafe({
    to: recipient,
    subject: `📦 Return Update: ${statusTitle} (#${returnNumber || orderId}) - BazaarHub`,
    html,
    text: `${statusTitle} for order #${orderId}. Track progress at ${clientUrl}/orders`
  });
};

module.exports = {
  isSmtpConfigured,
  verifyConnection,
  sendOrderConfirmationEmail,
  sendVendorOrderNotification,
  sendWelcomeEmail,
  sendTestEmail,
  sendReturnNotificationEmail
};

