import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Star, 
  ShoppingCart, 
  X,
  ArrowRight
} from 'lucide-react';
import { usePersonalization } from '../context/PersonalizationContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function RecentlyViewedSection({ title = "Recently Viewed", subtitle = "Pick up right where you left off in your shopping session" }) {
  const { recentlyViewed, removeFromHistory, clearHistory } = usePersonalization();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const scrollRef = useRef(null);

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatViewedTime = (timestamp) => {
    if (!timestamp) return 'Recently';
    const diffMins = Math.floor((Date.now() - timestamp) / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs relative">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h2>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {recentlyViewed.length} items
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              clearHistory();
              addToast('Browsing history cleared', 'info');
            }}
            className="text-xs font-semibold text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear History</span>
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative group/recent">
        {/* Left Navigation Chevron */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-blue-600 opacity-0 group-hover/recent:opacity-100 transition-all active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Horizontal Scrolling Items */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {recentlyViewed.map((prod) => (
            <div
              key={prod.id}
              className="shrink-0 w-44 sm:w-52 rounded-2xl bg-slate-50/60 border border-slate-200/80 p-3 flex flex-col justify-between group/card hover:bg-white hover:shadow-md transition-all duration-300 relative"
            >
              {/* Remove individual item button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(prod.id);
                }}
                title="Remove from history"
                className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center border border-slate-200 opacity-0 group-hover/card:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <Link to={`/product/${prod.id}`} className="block">
                {/* Product Image */}
                <div className="aspect-square rounded-xl bg-white p-3 mb-2.5 overflow-hidden flex items-center justify-center border border-slate-100">
                  <img
                    src={prod.image || prod.images?.[0]}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover/card:scale-108 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Relative timestamp */}
                <span className="text-[10px] font-bold text-slate-400 block mb-1">
                  Viewed {formatViewedTime(prod.viewedAt)}
                </span>

                {/* Product Title */}
                <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover/card:text-blue-600 transition-colors">
                  {prod.name}
                </h3>
              </Link>

              {/* Price & Add to Cart button */}
              <div className="pt-2.5 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    ₹{prod.price?.toLocaleString('en-IN')}
                  </span>
                  {prod.originalPrice && (
                    <span className="text-[10px] text-slate-400 line-through ml-1 block">
                      ₹{prod.originalPrice?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    addToCart(prod, 1);
                    addToast(`Added ${prod.name.slice(0, 18)}... to bag`, 'success');
                  }}
                  className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-2xs"
                  title="Add to cart"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Right Navigation Chevron */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-blue-600 opacity-0 group-hover/recent:opacity-100 transition-all active:scale-90 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
