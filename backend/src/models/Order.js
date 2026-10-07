const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
  itemStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { _id: true });

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String },
  name: { type: String },
  phone: { type: String, required: true },
  flat: { type: String },
  area: { type: String },
  landmark: { type: String },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String },
  postalCode: { type: String },
  type: { type: String, default: 'Home' },
  country: { type: String, required: true, default: 'India' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a customer']
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['cod', 'stripe', 'paypal', 'razorpay']
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    updateTime: { type: String },
    emailAddress: { type: String }
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'processing', 'partially_shipped', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ 'orderItems.vendor': 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
