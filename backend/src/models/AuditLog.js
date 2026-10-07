const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  action: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  entityType: {
    type: String,
    required: true,
    enum: ['User', 'Vendor', 'Store', 'Product', 'Variant', 'Order', 'VendorOrder', 'Payment', 'Shipment', 'Return', 'Payout', 'Coupon', 'Review', 'Settings'],
    index: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false } // Immutable audit records
});

auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
