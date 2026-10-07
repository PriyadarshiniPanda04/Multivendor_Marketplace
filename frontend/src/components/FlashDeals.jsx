import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/mockData';

export default function FlashDeals() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const scrollRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 18, seconds: 56 });

  const flashProducts = PRODUCTS.filter((p) => p.isFlashSale || p.discount >= 30).slice(0, 8);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const VENDOR_DOT_COLORS = ['#2b59ff', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="w-full max-w-[1536px] mx-auto select-none pt-4">
      
      {/* Header: Title Left, Countdown + Link Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Flash Deals
        </h2>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Ends in</span>
            <div className="flex items-center gap-1 font-mono text-white text-xs font-bold">
              <span className="bg-slate-900 px-1.5 py-0.5 rounded">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-slate-900">:</span>
              <span className="bg-slate-900 px-1.5 py-0.5 rounded">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-slate-900">:</span>
              <span className="bg-slate-900 px-1.5 py-0.5 rounded">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          <Link
            to="/shop?filter=deals"
            className="text-slate-900 hover:text-blue-600 underline font-bold"
          >
            See All Products
          </Link>
        </div>
      </div>

      {/* Product Cards Row with Carousel Arrows */}
      <div className="relative group/carousel">
        
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          aria-label="Previous"
          className="absolute -left-3 top-1/3 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer transition-transform active:scale-90"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2"
        >
          {flashProducts.map((product, idx) => {
            const soldCount = (idx + 2) * 15;
            const dotColor = VENDOR_DOT_COLORS[idx % VENDOR_DOT_COLORS.length];
            return (
              <div
                key={product.id}
                className="w-48 sm:w-56 shrink-0 bg-white flex flex-col justify-between group snap-start"
              >
                <div>
                  {/* Image container + Sale Pill */}
                  <div className="w-full pt-[100%] relative bg-slate-50 rounded-lg mb-2.5 overflow-hidden border border-slate-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-[#ff3b30] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs uppercase">
                      Sale
                    </span>
                  </div>

                  {/* Colors / Meta variant text */}
                  <span className="text-[11px] text-slate-400 block mb-0.5 font-medium">
                    {product.brand || '3 Colors'}
                  </span>

                  {/* Title */}
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span>({product.reviewCount || 1})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-sm font-bold text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Vendor / Store Pill */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: dotColor }}
                    />
                    <span className="text-[11px] font-medium text-slate-600 truncate">
                      {product.sellerName || 'Motta Store'}
                    </span>
                  </div>
                </div>

                {/* Sold status & progress bar */}
                <div className="mt-3 pt-1">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-full"
                      style={{ width: `${Math.min(100, soldCount * 1.5)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                    {soldCount} Sold
                  </span>
                </div>

                {/* Instant Buy Now Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product, 1);
                    navigate('/checkout');
                  }}
                  className="w-full mt-2.5 py-1.5 px-3 bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-bold rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>Buy Now</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          aria-label="Next"
          className="absolute -right-3 top-1/3 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer transition-transform active:scale-90"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
}
