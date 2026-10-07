import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass, History, Zap } from 'lucide-react';
import ProductCard from './ProductCard';
import { usePersonalization } from '../context/PersonalizationContext';
import { useAuth } from '../context/AuthContext';

export default function RecommendedSection() {
  const { getRecommendedProducts, preferredCategories, topInterestName, recentlyViewed } = usePersonalization();
  const { user, isAuthenticated } = useAuth();
  const [selectedCat, setSelectedCat] = useState('all');

  const allRecommendations = getRecommendedProducts(18);

  const filtered = selectedCat === 'all'
    ? allRecommendations
    : allRecommendations.filter(p => p.category === selectedCat);

  // Available category pills for quick filtering
  const categoryPills = [
    { id: 'all', label: 'All Recommended' },
    ...preferredCategories.map(cat => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized For {isAuthenticated ? user?.name?.split(' ')[0] : 'You'}</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Recommended For You
          </h2>

          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Based on your browsing history</span>
            {topInterestName && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700 font-semibold">Inspired by {topInterestName}</span>
              </>
            )}
          </p>
        </div>

        {/* View All & Category Count */}
        <div className="flex items-center gap-3">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 group transition-colors bg-blue-50/70 hover:bg-blue-100/70 px-3.5 py-2 rounded-xl"
          >
            <span>Explore All For You</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Category Pills Filter */}
      {categoryPills.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {categoryPills.map(pill => (
            <button
              key={pill.id}
              onClick={() => setSelectedCat(pill.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === pill.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      )}

      {/* Responsive Grid with personalized recommendation badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {filtered.slice(0, 12).map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

    </div>
  );
}
