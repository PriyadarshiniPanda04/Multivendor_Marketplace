import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, ShoppingCart, Sparkles, Tag } from 'lucide-react';
import { usePersonalization } from '../context/PersonalizationContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function FrequentlyBoughtTogether({ product }) {
  const { getFrequentlyBoughtTogether } = usePersonalization();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const bundleData = getFrequentlyBoughtTogether(product);

  // Track which items in the bundle are selected (defaults to all)
  const [selectedIds, setSelectedIds] = useState(() => {
    if (!bundleData) return [];
    return bundleData.bundleItems.map(item => item.id);
  });

  if (!bundleData || bundleData.bundleItems.length < 2) {
    return null;
  }

  const toggleItem = (itemId) => {
    setSelectedIds(prev => {
      if (prev.includes(itemId)) {
        if (prev.length === 1) {
          addToast('At least one item must remain selected', 'warning');
          return prev;
        }
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const selectedItems = bundleData.bundleItems.filter(item => selectedIds.includes(item.id));
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const originalSubtotal = selectedItems.reduce((acc, item) => acc + (item.originalPrice || Math.round(item.price * 1.25)), 0);
  const bundleDiscount = selectedItems.length >= 2 ? Math.round(subtotal * 0.08) : 0; // 8% extra bundle savings
  const finalBundlePrice = subtotal - bundleDiscount;

  const handleAddAllToCart = () => {
    selectedItems.forEach(item => {
      addToCart(item, 1);
    });
    addToast(`Added ${selectedItems.length} items to bag with bundle savings!`, 'success');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            Frequently Bought Together
          </h3>
          <p className="text-xs text-slate-500">
            Customers frequently bundle these authentic marketplace accessories with this item
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left: Product Cards & Plus signs */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 flex-1">
          {bundleData.bundleItems.map((item, index) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                )}

                <div 
                  onClick={() => toggleItem(item.id)}
                  className={`w-36 sm:w-40 p-3 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="aspect-square rounded-xl bg-white p-2 mb-2 flex items-center justify-center border border-slate-100 overflow-hidden">
                    <img
                      src={item.image || item.images?.[0]}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-108 transition-transform"
                    />
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-900 line-clamp-2 leading-snug">
                      {item.name}
                    </h4>
                    <span className="text-xs font-extrabold text-slate-900 block mt-1">
                      ₹{item.price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Price Total & Add All to Cart Box */}
        <div className="w-full lg:w-72 shrink-0 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Bundle Total ({selectedItems.length} items):
            </span>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-950">
                ₹{finalBundlePrice.toLocaleString('en-IN')}
              </span>
              {originalSubtotal > finalBundlePrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{originalSubtotal.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {bundleDiscount > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md mt-1.5 w-fit">
                <Tag className="w-3 h-3" />
                <span>Bundle savings: Save ₹{bundleDiscount.toLocaleString('en-IN')} extra!</span>
              </div>
            )}
          </div>

          <button
            onClick={handleAddAllToCart}
            className="w-full py-3 px-4 bg-[#2b59ff] hover:bg-[#1f4bf0] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add All {selectedItems.length} to Cart</span>
          </button>
        </div>

      </div>

    </div>
  );
}
