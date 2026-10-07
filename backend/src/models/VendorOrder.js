const mongoose = require('mongoose');

const vendorOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  parentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    index: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem'
  }],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  commissionRate: {
    type: Number,
    default: 10 // platform take rate %
  },
  commissionAmount: {
    type: Number,
    default: 0
  },
  vendorEarnings: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'processing', 'ready_for_pickup', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  payoutStatus: {
    type: String,
    enum: ['pending', 'escrow', 'eligible', 'paid', 'refunded'],
    default: 'pending'
  },
  shippingCarrier: {
    type: String,
    default: ''
  },
  trackingNumber: {
    type: String,
    default: ''
  },
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

vendorOrderSchema.index({ vendor: 1, status: 1 });
vendorOrderSchema.index({ parentOrder: 1, vendor: 1 });

const VendorOrder = mongoose.model('VendorOrder', vendorOrderSchema);

module.exports = VendorOrder;
