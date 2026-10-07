import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Star, Users, MapPin, Store, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { SELLERS, PRODUCTS } from '../data/mockData';

export default function SellerStorePage() {
  const { sellerId } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const seller = SELLERS.find((s) => s.id === sellerId) || SELLERS[0];
  
  // Filter products by this seller
  const sellerProducts = PRODUCTS.filter((p) => p.sellerId === seller.id);
  
  // Unique categories of this seller
  const sellerCategories = Array.from(new Set(sellerProducts.map((p) => p.category)));

  const displayProducts = selectedCategory === 'all'
    ? sellerProducts
    : sellerProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Seller Hero Banner & Info Card */}
      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
        
        {/* Banner Cover */}
        <div className="h-44 sm:h-64 relative bg-slate-900">
          <img
            src={seller.banner}
            alt={seller.name}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>

        {/* Profile Bar */}
        <div className="p-4 sm:p-6 -mt-12 sm:-mt-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          
          <div className="flex items-start sm:items-end gap-4">
            <img
              src={seller.logo}
              alt={seller.name}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl object-cover border-4 border-white shadow-lg bg-white shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {seller.name}
                </h1>
                {seller.verified && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Merchant
                  </span>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-bold text-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {seller.rating} Rating ({seller.reviewsCount} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {seller.followers} Followers
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  {seller.location}
                </span>
              </div>
            </div>
          </div>

          {/* Follow Store CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                isFollowing
                  ? 'bg-slate-100 text-slate-800 border border-slate-300'
                  : 'bg-orange-500 hover:bg-orange-600 text-slate-950'
              }`}
            >
              {isFollowing ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Following Store</span>
                </>
              ) : (
                <>
                  <Store className="w-4 h-4" />
                  <span>Follow Store</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Bio description */}
        <div className="px-4 sm:px-6 pb-6 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
          <p className="max-w-4xl">{seller.description}</p>
        </div>

      </div>

      {/* Seller Catalog Category Filter Pills */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2 overflow-x-auto thin-scrollbar">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0 mr-2">
          Store Departments:
        </span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
            selectedCategory === 'all'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Products ({sellerProducts.length})
        </button>
        {sellerCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 capitalize transition-colors ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Products from {seller.name} ({displayProducts.length})
        </h2>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500">No products available in this department.</p>
          </div>
        )}
      </div>

    </div>
  );
}
