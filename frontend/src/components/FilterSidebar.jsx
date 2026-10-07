import React from 'react';
import { 
  Star, 
  RotateCcw, 
  Check, 
  ChevronRight, 
  Smartphone, 
  Headphones, 
  Laptop, 
  Watch, 
  Camera, 
  Tv, 
  WashingMachine, 
  Utensils, 
  Armchair, 
  Shirt, 
  Sparkles, 
  ShoppingBag, 
  BookOpen, 
  Dumbbell, 
  Gamepad2,
  SlidersHorizontal,
  Grid
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

const ICON_MAP = {
  Smartphone,
  Headphones,
  Laptop,
  Watch,
  Camera,
  Tv,
  WashingMachine,
  Utensils,
  Armchair,
  Shirt,
  Sparkles,
  ShoppingBag,
  BookOpen,
  Dumbbell,
  Gamepad2
};

export default function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  selectedRating,
  onRatingChange,
  selectedBrands,
  onBrandToggle,
  availableBrands = [],
  onlyInStock,
  onStockToggle,
  freeDeliveryOnly,
  onFreeDeliveryToggle,
  onResetFilters
}) {
  return (
    <div className="space-y-6 select-none">
      
      {/* 1. Large & Prominent "Shop by Category" Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Grid className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Shop by Category
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">All 15 departments</p>
            </div>
          </div>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => onCategoryChange('all')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories List (Spacious & Prominent) */}
        <div className="space-y-1.5 max-h-[520px] overflow-y-auto thin-scrollbar pr-1">
          {/* All Departments Button */}
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <Grid className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold">All Departments</span>
            </div>
            {selectedCategory === 'all' && (
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            )}
          </button>

          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || ShoppingBag;
            const isSelected = selectedCategory && selectedCategory !== 'all' && (
              selectedCategory.toLowerCase() === cat.slug.toLowerCase() ||
              selectedCategory.toLowerCase() === cat.id.toLowerCase() ||
              selectedCategory.toLowerCase() === cat.name.toLowerCase()
            );
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.slug)}
                className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer text-left group ${
                  isSelected
                    ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200/90 shadow-2xs ring-1 ring-blue-500/20'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-semibold truncate block">
                      {cat.name}
                    </span>
                    <span className={`text-[10px] block font-medium ${
                      isSelected ? 'text-blue-500' : 'text-slate-400'
                    }`}>
                      {cat.count}
                    </span>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                  isSelected 
                    ? 'text-blue-600 translate-x-0.5' 
                    : 'text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5'
                }`} />
              </button>
            );
          })}
        </div>

      </div>

      {/* 2. Refine & Filter Controls Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6 text-xs text-slate-800">
        
        {/* Filter Header with Clear All */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Filter Options
            </span>
          </div>
          <button
            onClick={onResetFilters}
            className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Customer Rating */}
        <div>
          <h4 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider">
            Customer Rating
          </h4>
          <div className="space-y-1.5">
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => onRatingChange(selectedRating === rating ? null : rating)}
                className={`flex items-center justify-between py-2 px-3 rounded-xl w-full text-left transition-all cursor-pointer ${
                  selectedRating === rating 
                    ? 'bg-blue-50/80 font-bold text-blue-700 border border-blue-200 shadow-2xs' 
                    : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-700">& Up</span>
                </div>
                {selectedRating === rating && (
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider">
            Price Range
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">₹</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
                  className="w-full pl-7 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
              <span className="text-slate-400 font-medium">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">₹</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
                  className="w-full pl-7 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[
                { label: '< ₹1,000', min: 0, max: 1000 },
                { label: '₹1k - ₹5k', min: 1000, max: 5000 },
                { label: '₹5k - ₹15k', min: 5000, max: 15000 },
                { label: '> ₹15,000', min: 15000, max: '' }
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => onPriceChange({ min: p.min, max: p.max })}
                  className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1.5 rounded-lg text-center transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Brands */}
        {availableBrands.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider">
              Brands
            </h4>
            <div className="space-y-2 max-h-44 overflow-y-auto thin-scrollbar pr-1">
              {availableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none group"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => onBrandToggle(brand)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs truncate group-hover:text-blue-600 transition-colors font-medium">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Offers & Availability */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <h4 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider">
            Availability & Shipping
          </h4>
          
          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={freeDeliveryOnly}
              onChange={onFreeDeliveryToggle}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs font-medium">Express Free Delivery</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={onStockToggle}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs font-medium">Include Out of Stock</span>
          </label>
        </div>

      </div>

    </div>
  );
}
