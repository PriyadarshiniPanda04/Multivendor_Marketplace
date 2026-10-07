import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ShoppingCard({ title, items, linkText = 'Explore collection', linkUrl = '/shop' }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full z-20 modern-card">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>

        {/* 2x2 Bento Mini Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {items.slice(0, 4).map((item, idx) => (
            <Link
              key={idx}
              to={item.url || linkUrl}
              className="group flex flex-col items-start block"
            >
              <div className="w-full pt-[85%] relative bg-slate-50/90 rounded-2xl overflow-hidden mb-1.5 border border-slate-100">
                <img
                  src={item.image}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <span className="text-[11px] text-slate-600 font-semibold group-hover:text-indigo-600 transition-colors line-clamp-1">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Modern Link */}
      <Link
        to={linkUrl}
        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group pt-1"
      >
        <span>{linkText}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
