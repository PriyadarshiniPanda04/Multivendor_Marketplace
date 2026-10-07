const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: [true, 'A product must belong to a vendor']
  },
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a product category']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price must be positive']
  },
  discountPrice: {
    type: Number,
    default: null,
    min: [0, 'Discount price must be positive'],
    validate: {
      validator: function (val) {
        return val === null || val === undefined || val < this.price;
      },
      message: 'Discount price ({VALUE}) must be lower than original price'
    }
  },
  countInStock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    trim: true,
    uppercase: true
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false }
  }],
  attributes: [{
    name: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true }
  }],
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5'],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'active', 'out_of_stock', 'archived'],
      message: '{VALUE} is not a valid product status'
    },
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexing for faster search and filtering
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ vendor: 1, category: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
