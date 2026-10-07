import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  CheckCircle2, 
  X, 
  Percent, 
  Gift, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Copy,
  Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { couponService, MOCK_COUPONS } from '../services/couponService';

export default function CouponSection({ compact = false }) {
  const { 
    subtotal, 
    appliedCoupon, 
    couponDiscount, 
    isCouponValidForSubtotal,
    couponMinAmountRequired,
    applyCoupon, 
    removeCoupon 
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAvailable, setShowAvailable] = useState(!appliedCoupon);
  const [availableCoupons, setAvailableCoupons] = useState(MOCK_COUPONS);

  // Fetch available coupons on mount
  useEffect(() => {
    let mounted = true;
    couponService.getCoupons().then(data => {
      if (mounted && data) {
        setAvailableCoupons(data);
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleApply = async (codeToApply) => {
    const code = (codeToApply || inputCode).trim().toUpperCase();
    if (!code) {
      setErrorMessage('Please enter a coupon code.');
      return;
    }

    setErrorMessage('');
    setIsApplying(true);

    try {
      const res = await applyCoupon(code);
      if (res.success) {
        setInputCode('');
        setShowAvailable(false);
      } else {
        setErrorMessage(res.message || 'Invalid coupon code.');
      }
    } catch (err) {
      setErrorMessage('Failed to apply coupon. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5 transition-all">
      
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Apply Coupons & Promo Codes</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Save extra with bank deals & marketplace codes
            </p>
          </div>
        </div>

        {appliedCoupon && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Applied
          </span>
        )}
      </div>

      {/* Applied Coupon Banner */}
      {appliedCoupon ? (
        <div className="space-y-2">
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs font-black text-xs">
                {appliedCoupon.discountType === 'percentage' ? '%' : '₹'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-slate-900 text-sm tracking-wide bg-white px-2 py-0.5 rounded border border-emerald-300">
                    {appliedCoupon.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    {appliedCoupon.discountType === 'percentage'
                      ? `${appliedCoupon.discountValue}% OFF`
                      : `₹${appliedCoupon.discountValue} OFF`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                  {appliedCoupon.description || 'Promotional coupon discount'}
                </p>
                {couponDiscount > 0 ? (
                  <p className="text-[11px] font-semibold text-emerald-800 mt-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    You are saving ₹{couponDiscount.toLocaleString('en-IN')} on this order!
                  </p>
                ) : null}
              </div>
            </div>

            <button
              onClick={removeCoupon}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              title="Remove coupon"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>

          {/* Warning if subtotal dropped below min requirement */}
          {!isCouponValidForSubtotal && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Add ₹{(couponMinAmountRequired - subtotal).toLocaleString('en-IN')} more to your cart to activate coupon <strong>{appliedCoupon.code}</strong>.
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Input Field Form */
        <div className="space-y-2">
          <div className="flex items-stretch gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase());
                  setErrorMessage('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter coupon code (e.g. SAVE20)"
                maxLength={20}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm uppercase font-bold tracking-wider placeholder:font-normal placeholder:normal-case placeholder:tracking-normal text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-indigo-600 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20 transition-all"
              />
              {inputCode && (
                <button
                  onClick={() => setInputCode('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleApply()}
              disabled={isApplying || !inputCode.trim()}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              {isApplying ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>APPLY</span>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200/80 p-2.5 rounded-lg animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span className="font-medium leading-snug">{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Available Coupons Accordion & Quick Tap */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowAvailable(!showAvailable)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-indigo-600 py-1 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5 text-indigo-700">
            <Gift className="w-3.5 h-3.5 text-indigo-600" />
            <span>Available Marketplace Offers ({availableCoupons.length})</span>
          </span>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-normal">
            {showAvailable ? 'Hide deals' : 'View deals'}
            {showAvailable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>

        {showAvailable && (
          <div className="mt-2.5 space-y-2 animate-in fade-in duration-150">
            {availableCoupons.map((coupon) => {
              const isCurrentlyApplied = appliedCoupon?.code === coupon.code;
              const meetsMinOrder = subtotal >= (coupon.minOrderAmount || 0);

              return (
                <div
                  key={coupon.id || coupon.code}
                  className={`p-3 rounded-xl border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    isCurrentlyApplied
                      ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300'
                      : meetsMinOrder
                      ? 'bg-slate-50/60 hover:bg-slate-50 border-slate-200/80'
                      : 'bg-slate-50/30 border-dashed border-slate-200 opacity-80'
                  }`}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 bg-white border border-slate-300 px-2 py-0.5 rounded text-[11px] tracking-wide">
                        {coupon.code}
                      </span>
                      <span className="font-bold text-slate-800 text-[11px]">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : `Flat ₹${coupon.discountValue} OFF`}
                      </span>
                      {coupon.highlight && (
                        <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
                          {coupon.highlight}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {coupon.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span>Min Order: ₹{coupon.minOrderAmount?.toLocaleString('en-IN') || 0}</span>
                      {coupon.maxDiscountAmount && (
                        <span>Max Discount: ₹{coupon.maxDiscountAmount.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    {isCurrentlyApplied ? (
                      <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Applied
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApply(coupon.code)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                          meetsMinOrder
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}
                      >
                        {meetsMinOrder ? 'APPLY' : 'ADD MORE & APPLY'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
