const mongoose = require('mongoose');

const stockReservationSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant',
    default: null
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Reserved quantity must be at least 1']
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'converted', 'expired', 'cancelled'],
    default: 'active',
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // MongoDB TTL index to auto-remove or expire
  }
}, {
  timestamps: true
});

stockReservationSchema.index({ product: 1, status: 1 });

const StockReservation = mongoose.model('StockReservation', stockReservationSchema);

module.exports = StockReservation;
