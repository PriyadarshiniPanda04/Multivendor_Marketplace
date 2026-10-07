import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Cpu } from 'lucide-react';
import ProductCard from './ProductCard';
import { PRODUCTS } from '../data/mockData';

export default function ElectronicsSection() {
  const electronicsProducts = PRODUCTS.filter(
    (p) => p.category === 'electronics' || p.category === 'laptops' || p.category === 'smartwatches'
  ).slice(0, 4);

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Electronics & Smart Tech
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Top-rated tech from authorized Indian distributors</p>
        </div>
        <Link to="/category/electronics" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
          <span>Explore All Tech</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Large Editorial Banner */}
        <div className="lg:col-span-4 rounded-2xl overflow-hidden relative min-h-[320px] flex flex-col justify-end p-7 bg-slate-950 text-white shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
            alt="Electronics sale"
            className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="relative z-10 space-y-3">
            <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 text-indigo-300 text-[10px] font-black px-3 py-1 rounded-full tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" /> UP TO 60% OFF
            </span>
            <h3 className="text-2xl font-black leading-tight text-white">
              Next-Gen Audio & Computing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Active noise cancelling headphones, 165Hz displays, and flagship laptops with 100% manufacturer warranty.
            </p>
            <div className="pt-2">
              <Link
                to="/category/electronics"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-full shadow-lg transition-all"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right: 4-Product Grid */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {electronicsProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
}
