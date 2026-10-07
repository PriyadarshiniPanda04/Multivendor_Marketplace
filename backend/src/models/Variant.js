const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Variant title is required (e.g. Red / XL)'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required for each variant'],
    unique: true,
    trim: true,
    uppercase: true
  },
  barcode: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Variant price is required'],
    min: [0, 'Price must be non-negative']
  },
  compareAtPrice: {
    type: Number,
    default: null,
    min: [0, 'Compare-at price must be non-negative']
  },
  costPrice: {
    type: Number,
    default: null,
    min: [0, 'Cost price must be non-negative']
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  attributes: [{
    name: { type: String, required: true, trim: true }, // e.g. "Color", "Size"
    value: { type: String, required: true, trim: true } // e.g. "Emerald Green", "XL"
  }],
  images: [{
    type: String
  }],
  weight: {
    value: { type: Number, default: 0 },
    unit: { type: String, enum: ['g', 'kg', 'oz', 'lb'], default: 'kg' }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, enum: ['cm', 'in'], default: 'cm' }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

variantSchema.index({ product: 1, sku: 1 });

const Variant = mongoose.model('Variant', variantSchema);

module.exports = Variant;
