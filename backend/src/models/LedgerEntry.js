const mongoose = require('mongoose');

const ledgerEntrySchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    default: null,
    index: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
    index: true
  },
  vendorOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendorOrder',
    default: null
  },
  payout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payout',
    default: null
  },
  entryType: {
    type: String,
    enum: [
      'order_credit',       // Vendor earnings from order
      'platform_commission', // Marketplace platform fee
      'payout_debit',       // Payout sent to vendor bank
      'refund_debit',       // Deduction due to customer return/refund
      'penalty_fee',        // Penalty or late shipment deduction
      'adjustment'          // Manual admin adjustment
    ],
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  referenceId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

ledgerEntrySchema.index({ vendor: 1, createdAt: -1 });

const LedgerEntry = mongoose.model('LedgerEntry', ledgerEntrySchema);

module.exports = LedgerEntry;
