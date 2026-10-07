const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema({
  provider: {
    type: String,
    enum: ['stripe', 'razorpay', 'paypal', 'shiprocket', 'delhivery', 'custom'],
    required: true
  },
  eventId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  eventType: {
    type: String,
    required: true
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  status: {
    type: String,
    enum: ['received', 'processing', 'processed', 'failed', 'ignored'],
    default: 'received',
    index: true
  },
  attempts: {
    type: Number,
    default: 1
  },
  errorMessage: {
    type: String,
    default: null
  },
  processedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

webhookEventSchema.index({ provider: 1, eventType: 1 });

const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema);

module.exports = WebhookEvent;
