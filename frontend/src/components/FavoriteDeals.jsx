import React from 'react';
import { Link } from 'react-router-dom';

export default function FavoriteDeals() {
  const FAVORITES = [
    {
      tag: "KITCHEN & DINING",
      title: "Kitchen Tools & Accessories",
      subtitle: "Charming kitchenware & bohemian touches for everyday cooking.",
      link: "/category/kitchen",
      cta: "Shop Now",
      bgClass: "bg-[#5b8c99]",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"
    },
    {
      tag: "GAMES & CRAFTS",
      title: "Screen-Free Fun, Anyone?",
      subtitle: "Games, puzzles, arts & crafts for creative family time.",
      link: "/category/books",
      cta: "Shop Now",
      bgClass: "bg-[#937b9c]",
      image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80"
    },
    {
      tag: "SEASON SPECIAL",
      title: "The Spring Fling",
      subtitle: "Trending styles and vibrant wardrobe essentials on sale.",
      link: "/category/fashion",
      cta: "Shop Now",
      bgClass: "bg-[#458b61]",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="w-full max-w-[1536px] mx-auto select-none pt-2">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Our Favorite Deals This Week
        </h2>
        <Link 
          to="/shop?filter=deals" 
          className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-blue-600 underline transition-colors"
        >
          See All Deals
        </Link>
      </div>

      {/* 3 Lifestyle Feature Cards - Compact Small Box Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {FAVORITES.map((item, idx) => (
          <div
            key={idx}
            className={`${item.bgClass} rounded-2xl overflow-hidden relative group min-h-[175px] sm:min-h-[195px] flex flex-col justify-between p-5 sm:p-6 text-white shadow-xs hover:shadow-md transition-all duration-300`}
          >
            {/* Background Image with Gradient Overlay */}
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-40 mix-blend-multiply pointer-events-none"
              loading="lazy"
            />
            
            {/* Subtle Gradient for Extra Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent pointer-events-none" />

            {/* Content overlay */}
            <div className="relative z-10 space-y-1.5 max-w-[90%]">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/90 block">
                {item.tag}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold leading-tight tracking-tight drop-shadow-sm">
                {item.title}
              </h3>
              <p className="text-xs text-white/90 line-clamp-1 font-medium">
                {item.subtitle}
              </p>
            </div>

            {/* Bottom Button */}
            <div className="relative z-10 pt-3">
              <Link
                to={item.link}
                className="inline-block px-4 py-1.5 bg-white text-slate-950 font-bold text-xs rounded-lg shadow-sm hover:bg-slate-100 transition-all active:scale-95 cursor-pointer"
              >
                {item.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
