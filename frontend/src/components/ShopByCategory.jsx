import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function ShopByCategory() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        ref.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
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

  return (
    <div className="w-full max-w-[1536px] mx-auto select-none pt-2">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse our complete marketplace catalog of authentic products from verified sellers across India
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/shop" 
            className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-blue-600 underline transition-colors"
          >
            View All Products
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll categories left"
              className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
                canScrollLeft 
                  ? 'bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 shadow-xs cursor-pointer active:scale-95' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll categories right"
              className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
                canScrollRight 
                  ? 'bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 shadow-xs cursor-pointer active:scale-95' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Single Row Horizontal Carousel */}
      <div className="relative group/catrow">
        {/* Floating Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white/95 hover:bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all active:scale-90 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Scrollable Container with all categories in a single row */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="shrink-0 w-36 sm:w-44 group flex flex-col items-center text-center p-3.5 sm:p-4 rounded-xl bg-slate-50/60 hover:bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all duration-300"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white p-1 mb-2.5 shadow-xs border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 w-full px-1">
                {cat.name}
              </h3>
              
              <span className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>

        {/* Floating Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white/95 hover:bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all active:scale-90 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

    </div>
  );
}
