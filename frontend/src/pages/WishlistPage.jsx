import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <span>Your Wishlist ({wishlist.length} items)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Items saved for future purchases or price drop alerts
        </p>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-4 flex flex-col justify-between"
            >
              <div>
                <Link to={`/product/${product.id}`} className="block relative pt-[85%] bg-slate-50 rounded-lg overflow-hidden mb-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-[#cc0c39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {product.discount}% off
                    </span>
                  )}
                </Link>

                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  {product.category}
                </span>

                <Link to={`/product/${product.id}`}>
                  <h3 className="text-xs font-semibold text-slate-900 hover:text-orange-600 line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-base font-bold text-slate-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 mt-3 border-t border-slate-100">
                <button
                  onClick={() => moveToCart(product)}
                  className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>

                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="w-full py-1.5 text-xs text-slate-500 hover:text-rose-600 font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Your Wishlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our vast catalog and tap the heart icon on any product to save it here for later.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-md shadow transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
