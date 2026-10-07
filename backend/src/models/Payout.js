const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  payoutNumber: {
    type: String,
    required: true,
    unique: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Payout amount must be greater than zero']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  feeDeducted: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  destinationAccount: {
    bankName: String,
    accountNumber: String,
    accountHolder: String,
    ifscOrRouting: String,
    upiId: String
  },
  method: {
    type: String,
    enum: ['bank_transfer', 'upi', 'stripe_connect', 'paypal', 'manual'],
    default: 'bank_transfer'
  },
  status: {
    type: String,
    enum: ['requested', 'approved', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'requested',
    index: true
  },
  transactionReference: {
    type: String,
    trim: true
  },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: Date,
  failureReason: String
}, {
  timestamps: true
});

payoutSchema.index({ vendor: 1, status: 1 });

const Payout = mongoose.model('Payout', payoutSchema);

module.exports = Payout;
