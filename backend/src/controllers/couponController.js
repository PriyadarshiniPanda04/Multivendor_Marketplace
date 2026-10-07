const Coupon = require('../models/Coupon');

// Default initial coupons (seeded automatically into DB if empty)
const DEFAULT_COUPONS = [
  {
    code: 'SAVE20',
    description: 'Get 20% off on your order above ₹500 (Max ₹500)',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 500,
    maxDiscountAmount: 500,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2028-12-31'),
    usageLimit: 1000,
    usedCount: 15,
    userUsageLimit: 5,
    isActive: true
  },
  {
    code: 'FLAT100',
    description: 'Flat ₹100 instant discount on orders above ₹499',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 499,
    maxDiscountAmount: 100,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2028-12-31'),
    usageLimit: 500,
    usedCount: 42,
    userUsageLimit: 3,
    isActive: true
  },
  {
    code: 'FESTIVE30',
    description: 'Festive Special: 30% discount on cart value above ₹1,500 (Max ₹1,000)',
    discountType: 'percentage',
    discountValue: 30,
    minOrderAmount: 1500,
    maxDiscountAmount: 1000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2028-12-31'),
    usageLimit: 300,
    usedCount: 68,
    userUsageLimit: 2,
    isActive: true
  },
  {
    code: 'WELCOME50',
    description: 'New Customer Special: Flat ₹50 off on minimum purchase of ₹299',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 299,
    maxDiscountAmount: 50,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2028-12-31'),
    usageLimit: 5000,
    usedCount: 120,
    userUsageLimit: 1,
    isActive: true
  }
];

// Helper to seed defaults if DB is empty
const ensureDefaultCoupons = async () => {
  try {
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.insertMany(DEFAULT_COUPONS);
      console.log('Seeded default promotional coupons into database.');
    }
  } catch (err) {
    console.error('Error seeding coupons:', err.message);
  }
};

/**
 * Validate and calculate coupon discount
 * POST /api/coupons/validate
 * Body: { code, orderAmount, userId }
 */
exports.validateCoupon = async (req, res) => {
  try {
    let { code, orderAmount = 0 } = req.body;
    orderAmount = Number(orderAmount) || 0;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Please provide a valid coupon code.'
      });
    }

    const cleanCode = code.trim().toUpperCase();

    // Ensure database contains default coupons
    await ensureDefaultCoupons();

    // Find coupon in DB
    let coupon = await Coupon.findOne({ code: cleanCode });

    // Fallback in memory if DB connection is mock/unavailable
    if (!coupon) {
      coupon = DEFAULT_COUPONS.find(c => c.code === cleanCode);
    }

    if (!coupon) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: `Coupon code "${cleanCode}" is invalid.`
      });
    }

    // 1. Check if active
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Coupon code "${cleanCode}" is no longer active.`
      });
    }

    const now = new Date();

    // 2. Check start date
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Coupon "${cleanCode}" will be active from ${new Date(coupon.startDate).toLocaleDateString('en-IN')}.`
      });
    }

    // 3. Check expiration end date
    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Coupon code "${cleanCode}" expired on ${new Date(coupon.endDate).toLocaleDateString('en-IN')}.`
      });
    }

    // 4. Check overall usage limit
    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Coupon "${cleanCode}" has reached its maximum usage limit.`
      });
    }

    // 5. Check minimum order value
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      const needed = coupon.minOrderAmount - orderAmount;
      return res.status(400).json({
        success: false,
        valid: false,
        minOrderAmount: coupon.minOrderAmount,
        message: `Minimum order amount of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required. Add ₹${needed.toLocaleString('en-IN')} more to qualify!`
      });
    }

    // 6. Calculate discount amount
    let discountAmount = 0;
    const isPercentage = coupon.discountType === 'percentage';

    if (isPercentage) {
      const calculated = Math.round((orderAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && calculated > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      } else {
        discountAmount = calculated;
      }
    } else {
      // Fixed amount
      discountAmount = Math.min(coupon.discountValue, orderAmount);
    }

    const newTotal = Math.max(0, orderAmount - discountAmount);

    return res.status(200).json({
      success: true,
      valid: true,
      message: `Coupon "${cleanCode}" applied successfully! You saved ₹${discountAmount.toLocaleString('en-IN')}.`,
      discountAmount,
      newTotal,
      coupon: {
        id: coupon._id || coupon.code,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount
      }
    });

  } catch (err) {
    console.error('Error validating coupon:', err);
    return res.status(500).json({
      success: false,
      valid: false,
      message: 'Server error validating coupon. Please try again.'
    });
  }
};

/**
 * Get all available active coupons
 * GET /api/coupons
 */
exports.getAllCoupons = async (req, res) => {
  try {
    await ensureDefaultCoupons();
    let coupons = await Coupon.find().sort({ createdAt: -1 });

    if (!coupons || coupons.length === 0) {
      coupons = DEFAULT_COUPONS;
    }

    return res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (err) {
    console.error('Error fetching coupons:', err);
    return res.status(200).json({
      success: true,
      count: DEFAULT_COUPONS.length,
      data: DEFAULT_COUPONS
    });
  }
};

/**
 * Create a new coupon (Admin / Merchant)
 * POST /api/coupons
 */
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      usageLimit
    } = req.body;

    if (!code || !discountType || discountValue === undefined || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Code, discount type, discount value, and end date are required.'
      });
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Coupon code "${cleanCode}" already exists.`
      });
    }

    const newCoupon = await Coupon.create({
      code: cleanCode,
      description,
      discountType: discountType === 'fixed' ? 'fixed_amount' : discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: new Date(endDate),
      usageLimit: usageLimit ? Number(usageLimit) : null,
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: `Coupon "${cleanCode}" created successfully!`,
      data: newCoupon
    });
  } catch (err) {
    console.error('Error creating coupon:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Error creating coupon'
    });
  }
};

/**
 * Toggle coupon status (Admin)
 * PATCH /api/coupons/:id/toggle
 */
exports.toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.code} is now ${coupon.isActive ? 'Active' : 'Inactive'}`,
      data: coupon
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete a coupon
 * DELETE /api/coupons/:id
 */
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
