import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, Store, ArrowRight } from 'lucide-react';
import { SELLERS } from '../data/mockData';

export default function SellerSection() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Curated Merchants</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Verified Artisan & Brand Stores
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Direct from vetted independent craftsmen, designers, and certified brand outlets across India</p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-indigo-600 group transition-colors"
        >
          <span>Explore All 2,400+ Merchants</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SELLERS.slice(0, 4).map((seller) => (
          <div
            key={seller.id}
            className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/70 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Header: Logo, Name & Verified Badge */}
              <div className="flex items-start gap-3">
                <img
                  src={seller.logo}
                  alt={seller.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {seller.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Merchant" />
                  </div>
                  <p className="text-[11px] text-slate-500">{seller.location}</p>
                </div>
              </div>

              {/* Rating & Stats */}
              <div className="mt-4 flex items-center justify-between py-2 border-y border-slate-200/60 text-xs">
                <div className="flex items-center gap-1 text-slate-800 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{seller.rating} Rating</span>
                </div>
                <div className="text-slate-500 font-medium">
                  {seller.productsCount.toLocaleString('en-IN')} Products
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {seller.description}
              </p>
            </div>

            {/* Visit Store Button */}
            <div className="pt-4 mt-2">
              <Link
                to={`/seller/${seller.id}`}
                className="w-full py-2 px-3 bg-white hover:bg-slate-900 text-slate-800 hover:text-white text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <span>Visit Storefront</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
