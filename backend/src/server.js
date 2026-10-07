const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables with explicit path
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
// Request logger middleware for visual terminal confirmation
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const emailRoutes = require('./routes/emailRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const visualSearchRoutes = require('./routes/visualSearchRoutes');
const returnRoutes = require('./routes/returnRoutes');
const commissionRoutes = require('./routes/commissionRoutes');
const couponRoutes = require('./routes/couponRoutes');

// Base / Health-check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Multivendor Marketplace API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/search/visual', visualSearchRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/commission', commissionRoutes);
app.use('/api/coupons', couponRoutes);

// Error Handling Middlewares
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

// Port & Server Listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
