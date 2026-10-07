const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  vendorOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendorOrder',
    required: true,
    index: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    index: true
  },
  carrier: {
    type: String,
    required: true,
    trim: true
  },
  trackingNumber: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  trackingUrl: {
    type: String,
    default: ''
  },
  labelUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['label_created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
    default: 'label_created',
    index: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date,
  shippingAddress: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  packages: [{
    weight: Number,
    dimensions: { length: Number, width: Number, height: Number },
    items: [{
      orderItem: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' },
      quantity: Number
    }]
  }],
  statusHistory: [{
    status: String,
    location: String,
    note: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;
