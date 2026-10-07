// Multivendor Commission & Payout System Service for BazaarHub
// Admin Commission Models:
// 1. Percentage based (Global base take-rate)
// 2. Category based (Different percentages per category)
// 3. Seller based (Custom negotiated store rate override)
//
// Seller Financial Pipeline:
// Total Sales -> Commission -> Net Earnings -> Payout

import { CATEGORIES, SELLERS, PRODUCTS } from '../data/mockData';

const SETTINGS_KEY = 'bazaarhub_commission_settings';
const PAYOUTS_KEY = 'bazaarhub_payouts';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DEFAULT_CATEGORY_COMMISSIONS = [
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
  { categorySlug: 'sports', categoryName: 'Sports & Outdoors', rate: 10 },
  { categorySlug: 'smartwatches', categoryName: 'Smartwatches', rate: 8 },
  { categorySlug: 'cameras', categoryName: 'Cameras & Photography', rate: 7 },
  { categorySlug: 'tv', categoryName: 'TV & Home Entertainment', rate: 8 },
  { categorySlug: 'toys', categoryName: 'Toys & Baby Products', rate: 10 }
];

const DEFAULT_SELLER_OVERRIDES = [
  { sellerId: 's-1', sellerName: 'TechWorld Store', rate: 8, isCustom: true, notes: 'Premier High Volume Merchant' },
  { sellerId: 's-2', sellerName: 'FashionHub Trends', rate: 12, isCustom: true, notes: 'Fashion Exclusive Partner' },
  { sellerId: 's-3', sellerName: 'HomeCraft Living', rate: 9, isCustom: true, notes: 'Artisan Direct Agreement' }
];

const DEFAULT_PAYOUTS = [
  {
    id: 'PAY-892104',
    payoutNumber: 'PAY-892104',
    sellerId: 's-1',
    sellerName: 'TechWorld Store',
    amount: 150000,
    netAmount: 150000,
    feeDeducted: 0,
    method: 'bank_transfer',
    destinationAccount: {
      bankName: 'HDFC Bank',
      accountHolder: 'TechWorld Retail Pvt Ltd',
      accountNumber: '•••• •••• 4910',
      ifsc: 'HDFC0001824'
    },
    status: 'completed',
    transactionReference: 'CMS-HDFC-918241029',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
  },
  {
    id: 'PAY-741902',
    payoutNumber: 'PAY-741902',
    sellerId: 's-1',
    sellerName: 'TechWorld Store',
    amount: 85000,
    netAmount: 85000,
    feeDeducted: 0,
    method: 'upi',
    destinationAccount: {
      upiId: 'techworld@okhdfcbank'
    },
    status: 'processing',
    transactionReference: 'UPI-BATCH-PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  }
];

export const commissionService = {
  // Get all commission settings (Global %, Category %, Seller %)
  getSettings() {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) {
        const initial = {
          globalRate: 10,
          categoryRates: DEFAULT_CATEGORY_COMMISSIONS,
          sellerRates: DEFAULT_SELLER_OVERRIDES
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return {
        globalRate: 10,
        categoryRates: DEFAULT_CATEGORY_COMMISSIONS,
        sellerRates: DEFAULT_SELLER_OVERRIDES
      };
    }
  },

  // Save updated settings
  updateSettings(newSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    window.dispatchEvent(new CustomEvent('bazaarhub_commission_updated', { detail: newSettings }));
    try {
      fetch(`${API_BASE}/commission/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      }).catch(() => {});
    } catch (_) {}
    return newSettings;
  },

  // 3-Tier Commission Calculation
  // Priority: 1. Seller Custom Rate -> 2. Category Rate -> 3. Global Percentage
  calculateCommission(price, categorySlug, sellerId) {
    const salePrice = Number(price) || 0;
    const settings = this.getSettings();

    let rate = settings.globalRate || 10;
    let ruleApplied = `Global Percentage (${rate}%)`;
    let ruleType = 'global';

    // 1. Check Seller-based override
    if (sellerId) {
      const sellerRule = settings.sellerRates?.find((s) => s.sellerId === sellerId);
      if (sellerRule && sellerRule.rate !== undefined) {
        rate = sellerRule.rate;
        ruleApplied = `Seller Custom (${sellerRule.sellerName || 'Merchant'} @ ${rate}%)`;
        ruleType = 'seller';
      }
    }

    // 2. Check Category-based override if not overridden by seller
    if (ruleType === 'global' && categorySlug) {
      const catSlug = categorySlug.toLowerCase();
      const catRule = settings.categoryRates?.find(
        (c) => c.categorySlug.toLowerCase() === catSlug
      );
      if (catRule && catRule.rate !== undefined) {
        rate = catRule.rate;
        ruleApplied = `Category Rule (${catRule.categoryName} @ ${rate}%)`;
        ruleType = 'category';
      }
    }

    const commissionAmount = Math.round((salePrice * (rate / 100)) * 100) / 100;
    const netEarnings = Math.round((salePrice - commissionAmount) * 100) / 100;

    return {
      grossPrice: salePrice,
      rate,
      ruleType,
      ruleApplied,
      commissionAmount,
      netEarnings
    };
  },

  // Get Seller Payout History
  getPayouts(sellerId = 's-1') {
    try {
      const data = localStorage.getItem(PAYOUTS_KEY);
      if (!data) {
        localStorage.setItem(PAYOUTS_KEY, JSON.stringify(DEFAULT_PAYOUTS));
        return DEFAULT_PAYOUTS.filter((p) => !sellerId || p.sellerId === sellerId);
      }
      const list = JSON.parse(data);
      return sellerId ? list.filter((p) => p.sellerId === sellerId) : list;
    } catch {
      return DEFAULT_PAYOUTS;
    }
  },

  // Request a new Payout
  requestPayout({ sellerId = 's-1', sellerName = 'TechWorld Store', amount, method = 'bank_transfer', destinationAccount }) {
    const payoutId = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPayout = {
      id: payoutId,
      payoutNumber: payoutId,
      sellerId,
      sellerName,
      amount: Number(amount),
      netAmount: Number(amount),
      feeDeducted: 0,
      method,
      destinationAccount: destinationAccount || {
        bankName: 'HDFC Bank',
        accountHolder: sellerName,
        accountNumber: '•••• •••• 4910',
        ifsc: 'HDFC0001824'
      },
      status: 'requested',
      createdAt: new Date().toISOString()
    };

    const current = this.getPayouts(null);
    const updated = [newPayout, ...current];
    localStorage.setItem(PAYOUTS_KEY, JSON.stringify(updated));

    window.dispatchEvent(new CustomEvent('bazaarhub_payout_updated', { detail: newPayout }));

    try {
      fetch(`${API_BASE}/commission/payouts/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayout)
      }).catch(() => {});
    } catch (_) {}

    return newPayout;
  },

  // Update Payout Status (Admin: Approve / Disburse)
  updatePayoutStatus(payoutId, newStatus, transactionReference = '') {
    const list = this.getPayouts(null);
    const index = list.findIndex((p) => p.id === payoutId || p.payoutNumber === payoutId);
    if (index === -1) return null;

    const item = { ...list[index] };
    item.status = newStatus;
    if (transactionReference) item.transactionReference = transactionReference;
    if (newStatus === 'completed') {
      item.completedAt = new Date().toISOString();
      item.transactionReference = transactionReference || `TXN-CMS-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    list[index] = item;
    localStorage.setItem(PAYOUTS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('bazaarhub_payout_updated', { detail: item }));

    try {
      fetch(`${API_BASE}/commission/payouts/${payoutId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, transactionReference: item.transactionReference })
      }).catch(() => {});
    } catch (_) {}

    return item;
  },

  // Calculate Complete Financial Breakdown for Seller Dashboard
  // Total Sales -> Commission -> Net Earnings -> Payout
  getSellerFinancials(sellerId = 's-1') {
    const sellerProducts = PRODUCTS.filter((p) => p.sellerId === sellerId);
    const payouts = this.getPayouts(sellerId);

    // Realistic itemized sales ledger for seller
    const salesLedger = [
      {
        orderId: 'ORD-894120',
        date: '28 Sep 2026',
        product: PRODUCTS[0], // Zenith 5G Smartphone (₹32,999)
        category: 'mobiles',
        quantity: 3,
        status: 'Delivered'
      },
      {
        orderId: 'ORD-881204',
        date: '29 Sep 2026',
        product: PRODUCTS[1], // SoundPro Bass ANC (₹2,499)
        category: 'electronics',
        quantity: 12,
        status: 'Delivered'
      },
      {
        orderId: 'ORD-876541',
        date: '30 Sep 2026',
        product: PRODUCTS[2], // AeroFit Active Smartwatch (₹3,999)
        category: 'smartwatches',
        quantity: 8,
        status: 'Delivered'
      },
      {
        orderId: 'ORD-869201',
        date: '1 Oct 2026',
        product: PRODUCTS[3], // UltraView 4K Smart TV (₹42,990)
        category: 'tv',
        quantity: 4,
        status: 'Delivered'
      },
      {
        orderId: 'ORD-854190',
        date: '2 Oct 2026',
        product: PRODUCTS[4], // PowerMax M5 5G (₹14,999)
        category: 'mobiles',
        quantity: 5,
        status: 'Delivered'
      },
      {
        orderId: 'ORD-841920',
        date: '3 Oct 2026',
        product: PRODUCTS[5], // SpeedPro 10000mAh Power Bank (₹999)
        category: 'mobiles',
        quantity: 20,
        status: 'Delivered'
      }
    ];

    let totalSales = 0;
    let totalCommission = 0;

    const itemizedLedger = salesLedger.map((sale) => {
      const grossSale = sale.product.price * sale.quantity;
      const quote = this.calculateCommission(grossSale, sale.category, sellerId);

      totalSales += grossSale;
      totalCommission += quote.commissionAmount;

      return {
        ...sale,
        grossSale,
        commissionRate: quote.rate,
        commissionAmount: quote.commissionAmount,
        ruleApplied: quote.ruleApplied,
        ruleType: quote.ruleType,
        netEarnings: quote.netEarnings,
        payoutStatus: 'settled'
      };
    });

    const netEarnings = totalSales - totalCommission;

    const totalPaidOut = payouts
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + (p.netAmount || p.amount), 0);

    const pendingPayouts = payouts
      .filter((p) => p.status === 'requested' || p.status === 'processing')
      .reduce((sum, p) => sum + (p.netAmount || p.amount), 0);

    const availableBalance = Math.max(0, netEarnings - totalPaidOut - pendingPayouts);

    return {
      pipeline: {
        totalSales,
        totalCommission,
        netEarnings,
        availableBalance,
        totalPaidOut,
        pendingPayouts
      },
      ledger: itemizedLedger,
      payouts
    };
  }
};
