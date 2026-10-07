const { CommissionSetting, Vendor, Order, Payout, User } = require('../models');

// Default initial category rates
const DEFAULT_CATEGORY_RATES = [
  { categorySlug: 'mobiles', categoryName: 'Mobiles & Accessories', rate: 6 },
  { categorySlug: 'electronics', categoryName: 'Electronics & Audio', rate: 8 },
  { categorySlug: 'laptops', categoryName: 'Laptops & Computers', rate: 7 },
  { categorySlug: 'fashion', categoryName: 'Fashion & Apparel', rate: 15 },
  { categorySlug: 'beauty', categoryName: 'Beauty & Personal Care', rate: 12 },
  { categorySlug: 'kitchen', categoryName: 'Home & Kitchen', rate: 10 },
  { categorySlug: 'appliances', categoryName: 'Home Appliances', rate: 9 },
  { categorySlug: 'furniture', categoryName: 'Furniture & Living', rate: 10 },
  { categorySlug: 'grocery', categoryName: 'Grocery & Gourmet', rate: 5 },
  { categorySlug: 'books', categoryName: 'Books & Learning', rate: 5 },
  { categorySlug: 'sports', categoryName: 'Sports & Fitness', rate: 10 },
  { categorySlug: 'smartwatches', categoryName: 'Smartwatches', rate: 8 },
  { categorySlug: 'cameras', categoryName: 'Cameras & Photography', rate: 7 },
  { categorySlug: 'tv', categoryName: 'TV & Entertainment', rate: 8 },
  { categorySlug: 'toys', categoryName: 'Toys & Baby Products', rate: 10 }
];

const DEFAULT_SELLER_RATES = [
  { sellerId: 's-1', sellerName: 'TechWorld Store', rate: 8, notes: 'Volume Premier Partner Rate' },
  { sellerId: 's-2', sellerName: 'FashionHub Trends', rate: 12, notes: 'Fashion Verified Merchant' },
  { sellerId: 's-3', sellerName: 'HomeCraft Living', rate: 9, notes: 'Direct Artisan Rate' }
];

/**
 * Helper to get or seed commission settings
 */
const getOrCreateSettings = async () => {
  let settings = await CommissionSetting.findOne();
  if (!settings) {
    settings = await CommissionSetting.create({
      globalRate: 10,
      categoryRates: DEFAULT_CATEGORY_RATES,
      sellerRates: DEFAULT_SELLER_RATES
    });
  }
  return settings;
};

/**
 * @desc    Get current commission settings (Percentage, Category, Seller based)
 * @route   GET /api/commission/settings
 * @access  Public / Authenticated
 */
const getCommissionSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching commission settings'
    });
  }
};

/**
 * @desc    Admin: Update commission settings
 * @route   PUT /api/commission/settings
 * @access  Private (Admin only)
 */
const updateCommissionSettings = async (req, res) => {
  try {
    const { globalRate, categoryRates, sellerRates } = req.body;
    let settings = await getOrCreateSettings();

    if (globalRate !== undefined) settings.globalRate = Number(globalRate);
    if (categoryRates) settings.categoryRates = categoryRates;
    if (sellerRates) settings.sellerRates = sellerRates;
    settings.lastUpdated = new Date();

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Commission settings updated successfully',
      data: settings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating commission settings'
    });
  }
};

/**
 * @desc    Calculate commission quote for a product sale
 * Priority: 1. Seller Custom Rate -> 2. Category Rate -> 3. Global Percentage
 * @route   POST /api/commission/calculate
 * @access  Public / Authenticated
 */
const calculateCommissionQuote = async (req, res) => {
  try {
    const { price, categorySlug, sellerId } = req.body;
    const salePrice = Number(price) || 0;

    const settings = await getOrCreateSettings();

    let rate = settings.globalRate || 10;
    let ruleApplied = 'Percentage based (Global Default)';
    let ruleType = 'global';

    // 1. Check Seller-based override
    if (sellerId) {
      const sellerOverride = settings.sellerRates?.find(
        s => s.sellerId === sellerId || (s.sellerId && s.sellerId.toString() === sellerId.toString())
      );
      if (sellerOverride && sellerOverride.rate !== undefined) {
        rate = sellerOverride.rate;
        ruleApplied = `Seller based (${sellerOverride.sellerName || 'Custom'} @ ${rate}%)`;
        ruleType = 'seller';
      }
    }

    // 2. Check Category-based if no seller override
    if (ruleType === 'global' && categorySlug) {
      const catSlug = categorySlug.toLowerCase();
      const catOverride = settings.categoryRates?.find(
        c => c.categorySlug.toLowerCase() === catSlug
      );
      if (catOverride && catOverride.rate !== undefined) {
        rate = catOverride.rate;
        ruleApplied = `Category based (${catOverride.categoryName} @ ${rate}%)`;
        ruleType = 'category';
      }
    }

    const commissionAmount = Math.round((salePrice * (rate / 100)) * 100) / 100;
    const netEarnings = Math.round((salePrice - commissionAmount) * 100) / 100;

    return res.status(200).json({
      success: true,
      data: {
        price: salePrice,
        commissionRate: rate,
        commissionAmount,
        netEarnings,
        ruleApplied,
        ruleType
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error calculating commission quote'
    });
  }
};

/**
 * @desc    Get Vendor Financial Pipeline: Total Sales -> Commission -> Net Earnings -> Payout
 * @route   GET /api/commission/seller/financials
 * @access  Private (Vendor)
 */
const getVendorFinancials = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    const vendorId = vendor ? vendor._id : req.query.vendorId;

    // Fetch vendor orders
    const filter = vendorId ? { 'orderItems.vendor': vendorId } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });

    const settings = await getOrCreateSettings();

    let totalSales = 0;
    let totalCommission = 0;
    let ledgerBreakdown = [];

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (!vendorId || item.vendor?.toString() === vendorId.toString()) {
          const itemTotal = item.price * item.quantity;
          totalSales += itemTotal;

          // Determine rate: Seller custom -> Category -> Global
          let rate = settings.globalRate;
          if (vendor?.commissionRate) rate = vendor.commissionRate;

          const commission = Math.round((itemTotal * (rate / 100)) * 100) / 100;
          const net = itemTotal - commission;
          totalCommission += commission;

          ledgerBreakdown.push({
            orderId: order._id,
            date: order.createdAt,
            productName: item.name,
            quantity: item.quantity,
            salePrice: itemTotal,
            commissionRate: rate,
            commissionDeducted: commission,
            netEarnings: net,
            payoutStatus: order.isPaid ? 'ready_for_payout' : 'in_escrow'
          });
        }
      });
    });

    const netEarnings = totalSales - totalCommission;

    // Fetch vendor payouts
    const payouts = vendor ? await Payout.find({ vendor: vendor._id }).sort({ createdAt: -1 }) : [];
    const totalPaidOut = payouts
      .filter(p => p.status === 'completed')
      .reduce((acc, p) => acc + (p.netAmount || p.amount), 0);

    const pendingPayouts = payouts
      .filter(p => p.status === 'requested' || p.status === 'processing')
      .reduce((acc, p) => acc + (p.netAmount || p.amount), 0);

    const availableBalance = Math.max(0, netEarnings - totalPaidOut - pendingPayouts);

    return res.status(200).json({
      success: true,
      data: {
        pipeline: {
          totalSales: Math.round(totalSales * 100) / 100,
          totalCommission: Math.round(totalCommission * 100) / 100,
          netEarnings: Math.round(netEarnings * 100) / 100,
          availableBalance: Math.round(availableBalance * 100) / 100,
          totalPaidOut: Math.round(totalPaidOut * 100) / 100,
          pendingPayouts: Math.round(pendingPayouts * 100) / 100
        },
        ledgerBreakdown,
        payouts
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching vendor financials'
    });
  }
};

/**
 * @desc    Vendor requests a payout
 * @route   POST /api/commission/payouts/request
 * @access  Private (Vendor)
 */
const requestPayout = async (req, res) => {
  try {
    const { amount, method, destinationAccount } = req.body;
    const payoutAmount = Number(amount);

    if (!payoutAmount || payoutAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid payout amount'
      });
    }

    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    const payoutNumber = `PAY-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const payout = await Payout.create({
      payoutNumber,
      vendor: vendor._id,
      amount: payoutAmount,
      netAmount: payoutAmount,
      method: method || 'bank_transfer',
      destinationAccount: destinationAccount || vendor.payoutDetails || {},
      status: 'requested',
      initiatedBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: `Payout request for ₹${payoutAmount.toLocaleString('en-IN')} submitted successfully`,
      data: payout
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating payout request'
    });
  }
};

/**
 * @desc    Admin: Get all marketplace payouts
 * @route   GET /api/commission/payouts
 * @access  Private (Admin only)
 */
const getAllPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate('vendor', 'storeName slug contactEmail payoutDetails')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payouts.length,
      data: payouts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching all payouts'
    });
  }
};

/**
 * @desc    Admin: Update payout status (approve, disburse, fail)
 * @route   PATCH /api/commission/payouts/:id/status
 * @access  Private (Admin only)
 */
const updatePayoutStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionReference } = req.body;

    const payout = await Payout.findById(id);
    if (!payout) {
      return res.status(404).json({
        success: false,
        message: 'Payout not found'
      });
    }

    payout.status = status;
    if (transactionReference) payout.transactionReference = transactionReference;
    if (status === 'completed') {
      payout.transactionReference = transactionReference || `TXN-DISB-${Date.now().toString().slice(-6)}`;
    }
    payout.processedBy = req.user._id;

    await payout.save();

    return res.status(200).json({
      success: true,
      message: `Payout marked as ${status}`,
      data: payout
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating payout status'
    });
  }
};

module.exports = {
  getCommissionSettings,
  updateCommissionSettings,
  calculateCommissionQuote,
  getVendorFinancials,
  requestPayout,
  getAllPayouts,
  updatePayoutStatus
};
