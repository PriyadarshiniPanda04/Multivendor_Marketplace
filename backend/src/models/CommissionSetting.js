const mongoose = require('mongoose');

const commissionSettingSchema = new mongoose.Schema({
  // Global percentage-based commission
  globalRate: {
    type: Number,
    required: true,
    default: 10, // 10%
    min: 0,
    max: 100
  },
  // Category-based commission overrides
  categoryRates: [{
    categorySlug: { type: String, required: true },
    categoryName: { type: String, required: true },
    rate: { type: Number, required: true, min: 0, max: 100 }
  }],
  // Seller-based commission overrides
  sellerRates: [{
    sellerId: { type: String, required: true },
    sellerName: { type: String, required: true },
    rate: { type: Number, required: true, min: 0, max: 100 },
    notes: { type: String, default: 'Custom negotiated rate' }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const CommissionSetting = mongoose.model('CommissionSetting', commissionSettingSchema);

module.exports = CommissionSetting;
