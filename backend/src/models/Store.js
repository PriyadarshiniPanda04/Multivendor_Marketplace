const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true,
    maxlength: [100, 'Store name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  tagline: {
    type: String,
    trim: true,
    maxlength: [150, 'Tagline cannot exceed 150 characters']
  },
  logo: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  supportEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  supportPhone: {
    type: String,
    trim: true
  },
  policies: {
    shippingPolicy: { type: String, default: '' },
    refundPolicy: { type: String, default: '' },
    privacyPolicy: { type: String, default: '' },
    termsOfService: { type: String, default: '' }
  },
  socialLinks: {
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    twitter: { type: String, trim: true },
    website: { type: String, trim: true }
  },
  seo: {
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    metaKeywords: [{ type: String, trim: true }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
