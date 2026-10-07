import React from 'react';
import { Link } from 'react-router-dom';

export default function DealSection() {
  const BEST_DEALS = [
    {
      title: "Small Appliances",
      subtitle: "Up to 40% off Kitchen Products.",
      link: "/category/kitchen",
      cta: "Shop Now",
      bgColor: "bg-[#dff5e5]",
      textColor: "text-[#1e613b]",
      image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Premium Beauty",
      subtitle: "Up to 25% off Hair Care Products.",
      link: "/category/beauty",
      cta: "Shop Now",
      bgColor: "bg-[#fde2e7]",
      textColor: "text-[#9d2b48]",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Indoor Furniture",
      subtitle: "Save 30% Today, Even on Furniture.",
      link: "/category/kitchen",
      cta: "Shop Now",
      bgColor: "bg-[#dceffe]",
      textColor: "text-[#1d5c96]",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Cell Phones & Smartphones",
      subtitle: "Up to 15% off Cell Phones Products.",
      link: "/category/mobiles",
      cta: "Shop Now",
      bgColor: "bg-[#faebd7]",
      textColor: "text-[#875525]",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="w-full max-w-[1536px] mx-auto select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Today's Best Deals
        </h2>
        <Link 
          to="/shop?filter=deals" 
          className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-blue-600 underline transition-colors"
        >
          See All Deals
        </Link>
      </div>

      {/* 4 Motta Pastel Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BEST_DEALS.map((deal, idx) => (
          <div
            key={idx}
            className={`${deal.bgColor} rounded-xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden relative group hover:shadow-md transition-all duration-300 min-h-[360px]`}
          >
            {/* Top Text Content */}
            <div className="space-y-1.5 z-10">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                {deal.title}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {deal.subtitle}
              </p>
              <div className="pt-2">
                <Link
                  to={deal.link}
                  className="text-xs font-bold text-slate-900 hover:text-blue-600 underline inline-block"
                >
                  {deal.cta}
                </Link>
              </div>
            </div>

            {/* Bottom Product Image */}
            <div className="w-full pt-4 flex items-center justify-center relative z-10">
              <img
                src={deal.image}
                alt={deal.title}
                className="max-h-48 w-auto object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
