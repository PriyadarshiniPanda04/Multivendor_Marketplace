/**
 * Coupon Management & Validation Service
 * Handles coupon validation, discount calculation, and available offers.
 */

const API_BASE = 'http://localhost:5000/api/coupons';

// Default / fallback coupons matching marketplace promotions
export const MOCK_COUPONS = [
  {
    id: 'c-1',
    code: 'SAVE20',
    description: 'Get 20% off on your purchase above ₹500 (Max ₹500)',
    discountType: 'percentage', // 'percentage' | 'fixed'
    discountValue: 20,
    minOrderAmount: 500,
    maxDiscountAmount: 500,
    startDate: '2024-01-01',
    endDate: '2028-12-31',
    usageLimit: 1000,
    usedCount: 15,
    isActive: true,
    highlight: 'Trending'
  },
  {
    id: 'c-2',
    code: 'FLAT100',
    description: 'Flat ₹100 instant discount on orders above ₹499',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 499,
    maxDiscountAmount: 100,
    startDate: '2024-01-01',
    endDate: '2028-12-31',
    usageLimit: 500,
    usedCount: 42,
    isActive: true,
    highlight: 'Instant Cashback'
  },
  {
    id: 'c-3',
    code: 'FESTIVE30',
    description: 'Mega Festive: 30% discount on cart value above ₹1,500 (Max ₹1,000)',
    discountType: 'percentage',
    discountValue: 30,
    minOrderAmount: 1500,
    maxDiscountAmount: 1000,
    startDate: '2024-01-01',
    endDate: '2028-12-31',
    usageLimit: 300,
    usedCount: 68,
    isActive: true,
    highlight: 'Mega Savings'
  },
  {
    id: 'c-4',
    code: 'WELCOME50',
    description: 'Welcome Gift: Flat ₹50 off on minimum purchase of ₹299',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 299,
    maxDiscountAmount: 50,
    startDate: '2024-01-01',
    endDate: '2028-12-31',
    usageLimit: 5000,
    usedCount: 120,
    isActive: true,
    highlight: 'First Order'
  }
];

export const couponService = {
  /**
   * Fetch all active coupons
   */
  async getCoupons() {
    try {
      const res = await fetch(API_BASE);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Backend coupons fetch failed, using fallback coupons:', e.message);
    }
    return MOCK_COUPONS;
  },

  /**
   * Validate and calculate coupon discount
   * @param {string} code - e.g. "SAVE20"
   * @param {number} orderAmount - cart subtotal
   * @param {string} userId - optional customer ID
   */
  async validateCoupon(code, orderAmount, userId = null) {
    if (!code || !code.trim()) {
      return {
        valid: false,
        message: 'Please enter a coupon code.'
      };
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Try backend validation
    try {
      const res = await fetch(`${API_BASE}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, orderAmount, userId })
      });

      const json = await res.json();
      if (res.ok && json.valid) {
        return {
          valid: true,
          message: json.message,
          discountAmount: json.discountAmount,
          newTotal: json.newTotal,
          coupon: json.coupon
        };
      } else if (json.message) {
        return {
          valid: false,
          minOrderAmount: json.minOrderAmount,
          message: json.message
        };
      }
    } catch (e) {
      console.warn('Backend validation unreachable, using client validator:', e.message);
    }

    // 2. Client-side fallback validation
    return this.validateLocally(cleanCode, orderAmount);
  },

  /**
   * Local validator adhering to all coupon rules
   */
  validateLocally(code, orderAmount) {
    const coupon = MOCK_COUPONS.find(c => c.code === code);
    if (!coupon) {
      return {
        valid: false,
        message: `Coupon code "${code}" is invalid or does not exist.`
      };
    }

    if (!coupon.isActive) {
      return {
        valid: false,
        message: `Coupon "${code}" is no longer active.`
      };
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return {
        valid: false,
        message: `Coupon "${code}" is not yet active.`
      };
    }

    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return {
        valid: false,
        message: `Coupon code "${code}" has expired.`
      };
    }

    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
      return {
        valid: false,
        message: `Coupon "${code}" has reached its maximum redemption limit.`
      };
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      const needed = coupon.minOrderAmount - orderAmount;
      return {
        valid: false,
        minOrderAmount: coupon.minOrderAmount,
        message: `Minimum order amount of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required. Add ₹${needed.toLocaleString('en-IN')} more to apply!`
      };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      const calc = Math.round((orderAmount * coupon.discountValue) / 100);
      discountAmount = coupon.maxDiscountAmount ? Math.min(calc, coupon.maxDiscountAmount) : calc;
    } else {
      discountAmount = Math.min(coupon.discountValue, orderAmount);
    }

    return {
      valid: true,
      message: `Coupon "${code}" applied! You saved ₹${discountAmount.toLocaleString('en-IN')}.`,
      discountAmount,
      newTotal: Math.max(0, orderAmount - discountAmount),
      coupon
    };
  },

  /**
   * Recalculates discount for an already applied coupon given a new subtotal
   */
  calculateDiscount(coupon, currentSubtotal) {
    if (!coupon || currentSubtotal <= 0) return 0;
    if (coupon.minOrderAmount && currentSubtotal < coupon.minOrderAmount) return 0;

    if (coupon.discountType === 'percentage') {
      const calc = Math.round((currentSubtotal * coupon.discountValue) / 100);
      return coupon.maxDiscountAmount ? Math.min(calc, coupon.maxDiscountAmount) : calc;
    } else {
      return Math.min(coupon.discountValue, currentSubtotal);
    }
  }
};
