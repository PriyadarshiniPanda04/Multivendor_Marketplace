import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Bookmark, 
  ShoppingCart, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Truck, 
  RotateCcw, 
  Sparkles,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/mockData';
import CouponSection from '../components/CouponSection';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    savedForLater,
    itemsCount,
    subtotal,
    originalSubtotal,
    totalSavings,
    freeDeliveryThreshold,
    isFreeDelivery,
    deliveryFee,
    appliedCoupon,
    couponDiscount,
    finalTotal,
    updateQuantity,
    removeFromCart,
    saveForLaterItem,
    moveToCartFromSaved,
    removeSavedItem,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="space-y-6">
      
      {/* 2-Column Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Main Cart Items & Saved for Later */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Cart Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Review Shopping Bag
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Items reserved for your checkout session
                </p>
              </div>

              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-500 hover:text-rose-600 font-semibold transition-colors"
                >
                  Clear bag
                </button>
              )}
            </div>

            {/* Free Delivery Progress Notification */}
            {items.length > 0 && (
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 flex items-center gap-3">
                {isFreeDelivery ? (
                  <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Your order qualifies for <strong>Complimentary Express Delivery</strong> across India.</span>
                  </div>
                ) : (
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-700">
                      <span className="flex items-center gap-2 font-medium">
                        <Truck className="w-4 h-4 text-indigo-600" />
                        Add <strong className="text-slate-900">₹{amountNeededForFreeDelivery.toLocaleString('en-IN')}</strong> more for FREE Express Delivery
                      </span>
                      <Link to="/shop" className="text-indigo-600 font-bold hover:underline text-[11px]">
                        Add items →
                      </Link>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Promo Coupon Strip inside Add to Cart / Shopping Bag Section */}
            {items.length > 0 && (
              <div className="p-3.5 rounded-2xl border border-dashed border-emerald-300 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-emerald-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900">Applicable Coupon:</span>
                      <span className="font-mono bg-white border border-emerald-300 text-slate-900 px-2 py-0.5 rounded font-black tracking-wider text-[11px] shadow-2xs">
                        SAVE20
                      </span>
                      <span className="text-emerald-700 font-bold text-[11px]">20% OFF (Max ₹500)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {appliedCoupon
                        ? `Coupon ${appliedCoupon.code} is active! You are saving ₹${couponDiscount.toLocaleString('en-IN')}.`
                        : 'Eligible for instant 20% discount on cart value above ₹500.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {appliedCoupon?.code === 'SAVE20' ? (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Applied
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => applyCoupon('SAVE20')}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Apply SAVE20</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* List of Cart Items */}
            {items.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="py-5 first:pt-0 flex flex-col sm:flex-row items-start gap-4"
                  >
                    {/* Thumbnail */}
                    <Link
                      to={`/product/${product.id}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-2xl p-2.5 border border-slate-200/80 shrink-0 flex items-center justify-center overflow-hidden hover:border-slate-400 transition-colors"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <Link
                        to={`/product/${product.id}`}
                        className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug"
                      >
                        {product.name}
                      </Link>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-emerald-700 font-bold">In Stock</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">Merchant: {product.sellerName || 'Marketplace Verified'}</span>
                      </div>

                      {product.freeDelivery && (
                        <span className="text-[11px] text-slate-500 block">
                          Eligible for Express Dispatch
                        </span>
                      )}

                      {/* Controls: Quantity + Delete + Save for Later */}
                      <div className="flex items-center flex-wrap gap-4 pt-2 text-xs">
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                          <label className="text-slate-500 font-medium">Qty:</label>
                          <select
                            value={quantity}
                            onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                            className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
                          >
                            {[...Array(Math.min(product.stock || 10, 10))].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>

                        <button
                          onClick={() => saveForLaterItem(product.id)}
                          className="text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save for later</span>
                        </button>
                      </div>
                    </div>

                    {/* Item Price */}
                    <div className="text-right sm:self-start shrink-0">
                      <span className="text-base sm:text-lg font-bold text-slate-950">
                        ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice > product.price && (
                        <div className="text-xs text-slate-400 line-through">
                          ₹{(product.originalPrice * quantity).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Subtotal bottom bar */}
                <div className="pt-5 text-right">
                  <span className="text-sm sm:text-base text-slate-600">
                    Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'items'}):{' '}
                    <strong className="text-xl font-black text-slate-950">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </strong>
                  </span>
                </div>
              </div>
            ) : (
              /* Empty Cart State */
              <div className="text-center py-14 space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Your shopping bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Explore our curated marketplace for electronics, bespoke fashion, home decor, and certified artisan goods.
                </p>
                <div className="pt-2">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    <span>Browse Marketplace</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* Saved For Later Section */}
          {savedForLater.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                Saved for Later ({savedForLater.length} {savedForLater.length === 1 ? 'item' : 'items'})
              </h2>

              <div className="divide-y divide-slate-100">
                {savedForLater.map(({ product }) => (
                  <div key={product.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 object-contain rounded-xl border border-slate-200 p-1.5 shrink-0 bg-slate-50"
                      />
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{product.name}</h4>
                        <span className="text-sm font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveToCartFromSaved(product.id)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                      >
                        Move to Bag
                      </button>
                      <button
                        onClick={() => removeSavedItem(product.id)}
                        className="text-xs text-slate-500 hover:text-rose-600 font-semibold p-2 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Order Summary Buy Box & Coupon Widget */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          
          {/* Interactive Coupon Widget */}
          <CouponSection />

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            
            {/* Free delivery badge */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 pb-3 border-b border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Complimentary insured shipping applies.</span>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal ({itemsCount}):</span>
                <span className="font-semibold text-slate-900">₹{originalSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Promotional Savings:</span>
                  <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}

              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/80 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon ({appliedCoupon.code}):</span>
                  </span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery Fee:</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-base font-bold text-slate-950">
                <span>Total Amount:</span>
                <span className="text-2xl font-black text-slate-950">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              disabled={items.length === 0}
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust badge */}
            <div className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-slate-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted 256-Bit SSL Escrow Checkout</span>
              </div>
              <p>UPI, Credit/Debit Cards, Net Banking & Cash on Delivery accepted.</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
