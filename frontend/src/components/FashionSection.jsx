import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FashionSection() {
  const FASHION_CATEGORIES = [
    { title: "Men's Luxury Wear", tag: "Min 50% Off", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80", link: "/category/fashion" },
    { title: "Women's Designer", tag: "New Season", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80", link: "/category/fashion" },
    { title: "Youth & Streetwear", tag: "Under ₹999", image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&auto=format&fit=crop&q=80", link: "/category/fashion" },
    { title: "Sneakers & Kicks", tag: "Up to 55% Off", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80", link: "/category/fashion" },
    { title: "Luxury Timepieces", tag: "Top Rated", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80", link: "/category/smartwatches" },
    { title: "Artisanal Leather Bags", tag: "Handcrafted", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80", link: "/category/fashion" }
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600">Style Showcase</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Fashion & Contemporary Wardrobe
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Explore runway styles, pure linens, silk sarees, and handcrafted footwear</p>
        </div>
        <Link 
          to="/category/fashion" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-indigo-600 group transition-colors"
        >
          <span>Explore All Fashion</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {FASHION_CATEGORIES.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className="group bg-slate-50/70 rounded-2xl overflow-hidden border border-slate-200/70 hover:border-slate-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="pt-[110%] relative overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                {item.tag}
              </span>
            </div>

            <div className="p-3 text-center">
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {item.title}
              </h3>
              <span className="text-[11px] text-slate-500 group-hover:text-indigo-600 font-medium group-hover:underline mt-0.5 inline-block">
                View Collection
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
