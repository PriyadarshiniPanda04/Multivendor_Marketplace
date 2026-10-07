const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor must be linked to a user account'],
    unique: true
  },
  storeName: {
    type: String,
    required: [true, 'Please provide a store name'],
    unique: true,
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
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Store description cannot exceed 1000 characters']
  },
  logo: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' }
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected', 'suspended'],
      message: '{VALUE} is not a valid vendor status'
    },
    default: 'pending'
  },
  commissionRate: {
    type: Number,
    default: 10, // percentage taken by marketplace platform
    min: 0,
    max: 100
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  payoutDetails: {
    bankName: { type: String, trim: true },
    accountHolder: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    ifscOrRouting: { type: String, trim: true },
    upiId: { type: String, trim: true }
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
