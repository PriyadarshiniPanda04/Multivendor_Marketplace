import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, Zap, Repeat } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id || product._id);
  const inCompare = isInCompare(product.id || product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <div className="group modern-card bg-white rounded-2xl border border-slate-200/70 p-3 sm:p-3.5 flex flex-col justify-between h-full relative overflow-hidden shadow-xs hover:border-slate-300">
      
      {/* Top Floating Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        {product.discount > 0 ? (
          <span className="bg-slate-950 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
            -{product.discount}%
          </span>
        ) : <span />}

        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const pid = product.id || product._id;
              if (inCompare) {
                removeFromCompare(pid);
              } else {
                addToCompare(product);
              }
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm ${
              inCompare
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-white/90 hover:bg-white text-slate-400 hover:text-blue-600 border border-slate-200/80'
            }`}
            title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm ${
              inWishlist
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 border border-slate-200/80'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Image Stage */}
      <Link to={`/product/${product.id}`} className="block relative pt-[90%] bg-slate-50/80 rounded-xl overflow-hidden mb-3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Product Information */}
      <div className="flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Brand & Category micro-header */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold text-slate-500 truncate max-w-[120px]">{product.brand}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              {product.subcategory || product.category}
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-xs sm:text-[13px] font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug" title={product.name}>
              {product.name}
            </h3>
          </Link>

          {/* Rating Pill */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center bg-amber-50 border border-amber-200/80 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md gap-0.5">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              ({product.reviewCount?.toLocaleString('en-IN') || 48})
            </span>
          </div>

          {/* Pricing */}
          <div className="mt-2.5 flex items-baseline flex-wrap gap-2">
            <span className="text-base sm:text-lg font-extrabold text-slate-950">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-normal">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Delivery & Vendor Info */}
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
            {product.freeDelivery ? (
              <span className="font-medium text-emerald-600 flex items-center gap-1">
                <Truck className="w-3 h-3 text-emerald-500" /> Free Shipping
              </span>
            ) : (
              <span className="text-slate-400">Shipping ₹40</span>
            )}
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 truncate max-w-[90px]">{product.sellerName?.split(' ')[0] || 'Seller'}</span>
          </div>
        </div>

        {/* Dual Actions: Add to Bag + Buy Now */}
        <div className="grid grid-cols-2 gap-1.5 mt-2 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1 active:scale-95 border border-slate-200/80 cursor-pointer"
            title="Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span className="truncate">Add</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="py-2 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
            title="Instant Buy Now"
          >
            <Zap className="w-3.5 h-3.5 shrink-0 fill-current" />
            <span className="truncate">Buy Now</span>
          </button>
        </div>
      </div>

    </div>
  );
}
