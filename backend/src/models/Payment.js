const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'paypal', 'cod', 'wallet'],
    required: true
  },
  transactionId: {
    type: String,
    trim: true,
    index: true
  },
  paymentIntentId: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Payment amount must be non-negative']
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'requires_action', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending',
    index: true
  },
  paymentMethodDetails: {
    type: { type: String }, // card, upi, netbanking, etc.
    cardBrand: String,
    last4: String,
    bank: String
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  refundedAmount: {
    type: Number,
    default: 0
  },
  failureReason: String,
  paidAt: Date
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
