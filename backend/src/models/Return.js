const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  returnNumber: {
    type: String,
    required: true,
    unique: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  vendorOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendorOrder',
    index: true
  },
  orderItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: String,
  productImage: String,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  reason: {
    type: String,
    enum: [
      'Wrong product',
      'Damaged product',
      'Product not as described',
      'Other',
      'wrong_product',
      'damaged_product',
      'not_as_described',
      'other',
      'damaged',
      'defective',
      'wrong_item'
    ],
    required: true
  },
  customerComments: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: [
      'requested',       // Return Requested
      'seller_review',   // Seller Review
      'approved',        // Approved
      'pickup',          // Pickup
      'refunded',        // Refund
      'rejected',        // Rejected
      'closed'
    ],
    default: 'requested',
    index: true
  },
  refundAmount: {
    type: Number,
    required: true,
    min: 0
  },
  refundMethod: {
    type: String,
    enum: ['original_payment_method', 'store_wallet', 'bank_transfer', 'UPI'],
    default: 'original_payment_method'
  },
  pickupDate: Date,
  pickupAddress: String,
  trackingAwb: String,
  refundTransactionId: String,
  vendorNotes: String,
  adminNotes: String,
  timeline: [{
    step: String,
    title: String,
    description: String,
    timestamp: { type: Date, default: Date.now },
    completed: { type: Boolean, default: true }
  }],
  resolvedAt: Date
}, {
  timestamps: true
});

const Return = mongoose.model('Return', returnSchema);

module.exports = Return;
