import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Award, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCarousel({ title, subtitle, products, viewAllLink = '/shop' }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const scrollRef = useRef(null);

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

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        <Link
          to={viewAllLink}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group shrink-0"
        >
          <span>See all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Horizontal Carousel */}
      <div className="relative group/carousel">
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/95 hover:bg-white shadow-xl border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-indigo-600 transition-all opacity-0 group-hover/carousel:opacity-100 active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto thin-scrollbar pb-3 pt-1 scroll-smooth"
        >
          {products.map((product, idx) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="w-44 sm:w-52 shrink-0 bg-slate-50/50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xl p-3.5 transition-all flex flex-col justify-between group modern-card"
            >
              <div>
                {/* Ranking Pill Tag */}
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full mb-2 inline-block">
                  #{idx + 1} Best Seller
                </span>

                <div className="w-full pt-[90%] relative bg-white rounded-xl mb-3 overflow-hidden border border-slate-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-slate-950 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                  {product.name}
                </h3>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-200/50">
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span className="font-semibold text-slate-700">{product.rating}</span>
                  <span>({product.reviewCount})</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-slate-950">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Instant Buy Now */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product, 1);
                    navigate('/checkout');
                  }}
                  className="w-full mt-2.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                >
                  <Zap className="w-3 h-3 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/95 hover:bg-white shadow-xl border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-indigo-600 transition-all opacity-0 group-hover/carousel:opacity-100 active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
