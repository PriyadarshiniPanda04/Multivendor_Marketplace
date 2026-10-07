import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scale, 
  Trash2, 
  ShoppingCart, 
  Check, 
  X, 
  Star, 
  ArrowRight, 
  Plus, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles,
  Search,
  ChevronRight
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ComparePage() {
  const navigate = useNavigate();
  const { compareItems, removeFromCompare, clearCompare, addToCompare, setComparisonList } = useCompare();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [highlightDiff, setHighlightDiff] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  // Sample electronics for 1-click comparison demo
  const sampleProducts = [
    {
      _id: 'sample-p1',
      id: 'sample-p1',
      name: 'Apple iPhone 15 Pro (128 GB) - Natural Titanium',
      price: 129900,
      originalPrice: 134900,
      discount: 4,
      rating: 4.8,
      numReviews: 2450,
      brand: 'Apple',
      category: 'Electronics',
      inStock: true,
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80'],
      specifications: {
        Display: '6.1-inch Super Retina XDR OLED 120Hz',
        Processor: 'A17 Pro chip (3nm)',
        Camera: '48MP Main + 12MP Ultra-Wide + 12MP 3x Telephoto',
        Battery: '3274 mAh with 20W Fast Charging',
        Storage: '128 GB NVMe',
        OS: 'iOS 17 (Upgradable to iOS 18)',
        Weight: '187 grams'
      },
      warranty: '1 Year Apple Official India Warranty',
      returnPolicy: '7 Days Replacement Policy',
      freeShipping: true
    },
    {
      _id: 'sample-p2',
      id: 'sample-p2',
      name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)',
      price: 124999,
      originalPrice: 139999,
      discount: 11,
      rating: 4.7,
      numReviews: 1890,
      brand: 'Samsung',
      category: 'Electronics',
      inStock: true,
      images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80'],
      specifications: {
        Display: '6.8-inch Dynamic AMOLED 2X 120Hz QHD+',
        Processor: 'Snapdragon 8 Gen 3 for Galaxy',
        Camera: '200MP Main + 50MP 5x Periscope + 12MP Ultra-wide',
        Battery: '5000 mAh with 45W Fast Charging',
        Storage: '256 GB UFS 4.0',
        OS: 'Android 14 with One UI 6.1 (7 Years OS Updates)',
        Weight: '232 grams (Built-in S-Pen)'
      },
      warranty: '1 Year Comprehensive Brand Warranty',
      returnPolicy: '7 Days Replacement Policy',
      freeShipping: true
    },
    {
      _id: 'sample-p3',
      id: 'sample-p3',
      name: 'Google Pixel 9 Pro XL (Porcelain, 128 GB)',
      price: 109999,
      originalPrice: 124999,
      discount: 12,
      rating: 4.6,
      numReviews: 820,
      brand: 'Google',
      category: 'Electronics',
      inStock: true,
      images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80'],
      specifications: {
        Display: '6.8-inch Super Actua LTPO OLED 120Hz',
        Processor: 'Google Tensor G4 with Titan M2',
        Camera: '50MP Main + 48MP 5x Telephoto + 48MP Ultra-wide',
        Battery: '5060 mAh with 37W Fast Charging',
        Storage: '128 GB UFS 3.1',
        OS: 'Clean Android 15 with Gemini AI Pro',
        Weight: '221 grams'
      },
      warranty: '1 Year Google Hardware Warranty',
      returnPolicy: '10 Days Replacement Policy',
      freeShipping: true
    }
  ];

  // Fetch real catalog products when add modal opens
  useEffect(() => {
    if (showAddModal && catalogProducts.length === 0) {
      setLoadingCatalog(true);
      fetch('/api/products?limit=20')
        .then(res => res.json())
        .then(data => {
          if (data && data.products) {
            setCatalogProducts(data.products);
          } else if (Array.isArray(data)) {
            setCatalogProducts(data);
          }
        })
        .catch(err => {
          console.error('Failed to load products for comparison modal', err);
          // Fallback to sample items if API fails or DB empty
          setCatalogProducts(sampleProducts);
        })
        .finally(() => setLoadingCatalog(false));
    }
  }, [showAddModal]);

  const loadSamples = () => {
    setComparisonList(sampleProducts);
  };

  // Extract all unique specification keys across all compared products
  const allSpecKeys = Array.from(
    new Set(
      compareItems.flatMap(item => 
        item.specifications ? Object.keys(item.specifications) : ['Display', 'Processor', 'Camera', 'Battery', 'Storage', 'OS']
      )
    )
  );

  // Helper to check if a row has differing values among products
  const hasDifference = (getter) => {
    if (compareItems.length <= 1) return false;
    const firstVal = String(getter(compareItems[0]) ?? '').trim().toLowerCase();
    return compareItems.some(item => String(getter(item) ?? '').trim().toLowerCase() !== firstVal);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">Product Comparison</span>
        </div>

        {/* Header Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Compare Products</h1>
                <p className="text-sm text-slate-500">
                  Side-by-side technical specs, features, customer reviews, and pricing.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {compareItems.length > 1 && (
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/70 px-3 py-2 rounded-xl cursor-pointer transition-colors border border-slate-200/80">
                <input 
                  type="checkbox" 
                  checked={highlightDiff} 
                  onChange={(e) => setHighlightDiff(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Highlight Differences
              </label>
            )}

            {compareItems.length > 0 && (
              <>
                {compareItems.length < 4 && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Product ({compareItems.length}/4)
                  </button>
                )}

                <button
                  onClick={clearCompare}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100/80 transition-colors border border-rose-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Empty State */}
        {compareItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm my-8">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-blue-100">
              <Scale className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Products in Comparison</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              Add products from product detail pages or use our instant product picker to compare features, specs, and pricing side-by-side.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={loadSamples}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Load Flagship Smartphone Comparison
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Browse & Pick Products
              </button>
            </div>
          </div>
        ) : (
          /* Comparison Matrix Table */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  {/* Product Cards Row */}
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="p-4 w-52 sm:w-64 text-left font-semibold text-slate-700 text-xs uppercase tracking-wider bg-slate-100/60 sticky left-0 z-20 backdrop-blur-md">
                      Product Details
                    </th>
                    {compareItems.map(item => {
                      const id = item._id || item.id;
                      const image = item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
                      return (
                        <th key={id} className="p-5 min-w-[260px] max-w-[300px] align-top text-left font-normal relative">
                          <button
                            onClick={() => removeFromCompare(id)}
                            className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div className="flex flex-col items-center text-center">
                            <Link to={`/product/${id}`} className="group block mb-3 relative">
                              <div className="w-36 h-36 rounded-2xl bg-white border border-slate-200/80 p-2 flex items-center justify-center overflow-hidden shadow-xs group-hover:border-blue-400 transition-colors">
                                <img
                                  src={image}
                                  alt={item.name}
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            </Link>

                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                              {item.brand || 'BazaarHub'}
                            </span>

                            <Link 
                              to={`/product/${id}`} 
                              className="text-sm font-semibold text-slate-900 hover:text-blue-600 line-clamp-2 mb-2 leading-snug transition-colors"
                            >
                              {item.name}
                            </Link>

                            <div className="flex items-center gap-1.5 mb-3">
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-md border border-amber-200">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                {item.rating || 4.5}
                              </span>
                              <span className="text-xs text-slate-400">
                                ({item.numReviews || 120})
                              </span>
                            </div>

                            <div className="mb-4">
                              <div className="flex items-baseline justify-center gap-2">
                                <span className="text-xl font-bold text-slate-900">
                                  ₹{item.price?.toLocaleString()}
                                </span>
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <span className="text-xs text-slate-400 line-through">
                                    ₹{item.originalPrice?.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {item.discount > 0 && (
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                                  Save {item.discount}%
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => addToCart(item, 1)}
                              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              Add to Cart
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {/* SECTION 1: GENERAL OVERVIEW */}
                  <tr className="bg-slate-100/50">
                    <td colSpan={compareItems.length + 1} className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-slate-600">
                      General Overview
                    </td>
                  </tr>

                  <tr className={highlightDiff && hasDifference(item => item.brand) ? 'bg-amber-50/50' : ''}>
                    <td className="p-4 font-semibold text-slate-800 bg-slate-50/40 sticky left-0 z-10">Brand</td>
                    {compareItems.map(item => (
                      <td key={item._id || item.id} className="p-4 font-medium text-slate-900">
                        {item.brand || 'Generic'}
                      </td>
                    ))}
                  </tr>

                  <tr className={highlightDiff && hasDifference(item => item.category) ? 'bg-amber-50/50' : ''}>
                    <td className="p-4 font-semibold text-slate-800 bg-slate-50/40 sticky left-0 z-10">Category</td>
                    {compareItems.map(item => (
                      <td key={item._id || item.id} className="p-4 text-slate-600">
                        {item.category || 'General'}
                      </td>
                    ))}
                  </tr>

                  <tr className={highlightDiff && hasDifference(item => item.inStock !== false) ? 'bg-amber-50/50' : ''}>
                    <td className="p-4 font-semibold text-slate-800 bg-slate-50/40 sticky left-0 z-10">Stock Status</td>
                    {compareItems.map(item => (
                      <td key={item._id || item.id} className="p-4">
                        {item.inStock !== false ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            <Check className="w-3.5 h-3.5" /> In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                            <X className="w-3.5 h-3.5" /> Out of Stock
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* SECTION 2: SPECIFICATIONS */}
                  <tr className="bg-slate-100/50">
                    <td colSpan={compareItems.length + 1} className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-slate-600">
                      Technical Specifications
                    </td>
                  </tr>

                  {allSpecKeys.map(specKey => {
                    const isDiff = highlightDiff && hasDifference(item => item.specifications?.[specKey] || 'N/A');
                    return (
                      <tr key={specKey} className={isDiff ? 'bg-amber-50/60' : ''}>
                        <td className="p-4 font-semibold text-slate-800 bg-slate-50/40 sticky left-0 z-10">
                          {specKey}
                        </td>
                        {compareItems.map(item => (
                          <td key={item._id || item.id} className="p-4 text-slate-600 leading-relaxed">
                            {item.specifications?.[specKey] || (
                              <span className="text-slate-400 italic">Standard Specifications</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}

                  {/* SECTION 3: SERVICES & WARRANTY */}
                  <tr className="bg-slate-100/50">
                    <td colSpan={compareItems.length + 1} className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-slate-600">
                      Assurance, Warranty & Delivery
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-800 bg-slate-50/40 sticky left-0 z-10">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-blue-600" />
                        Free Delivery
                      </div>
                    </td>
                    {compareItems.map(item => (
                      <td key={item._id || item.id} className="p-4">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Included (2-4 Business Days)
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-800 bg-slate-50/40 sticky left-0 z-10">
                      <div className="flex items-center gap-1.5">
                        <RotateCcw className="w-4 h-4 text-blue-600" />
                        Return Policy
                      </div>
                    </td>
                    {compareItems.map(item => (
                      <td key={item._id || item.id} className="p-4 text-slate-600 text-xs">
                        {item.returnPolicy || '7 Days Replacement Policy'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-800 bg-slate-50/40 sticky left-0 z-10">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        Warranty
                      </div>
                    </td>
                    {compareItems.map(item => (
                      <td key={item._id || item.id} className="p-4 text-slate-600 text-xs">
                        {item.warranty || '1 Year Brand Manufacturer Warranty'}
                      </td>
                    ))}
                  </tr>

                  {/* Bottom Action Row */}
                  <tr className="bg-slate-50">
                    <td className="p-4 font-semibold text-slate-800 sticky left-0 z-10 bg-slate-100/70">
                      Action
                    </td>
                    {compareItems.map(item => (
                      <td key={item._id || item.id} className="p-4">
                        <button
                          onClick={() => addToCart(item, 1)}
                          className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: Pick a Product to Add */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-lg text-slate-900">Add Product to Compare</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="my-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search products by name or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* List */}
              <div className="overflow-y-auto flex-1 divide-y divide-slate-100 pr-1">
                {loadingCatalog ? (
                  <div className="py-12 text-center text-slate-400 text-sm">Loading available products...</div>
                ) : (
                  (catalogProducts.length > 0 ? catalogProducts : sampleProducts)
                    .filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(prod => {
                      const id = prod._id || prod.id;
                      const isAlready = compareItems.some(item => (item._id || item.id) === id);
                      const image = prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';

                      return (
                        <div key={id} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                          <div className="flex items-center gap-3">
                            <img
                              src={image}
                              alt={prod.name}
                              className="w-12 h-12 object-contain bg-slate-50 rounded-lg p-1 border border-slate-200/60"
                            />
                            <div>
                              <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{prod.name}</h4>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                                <span>{prod.brand || 'BazaarHub'}</span>
                                <span>•</span>
                                <span className="font-bold text-slate-800">₹{prod.price?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            disabled={isAlready}
                            onClick={() => {
                              addToCompare(prod);
                              setShowAddModal(false);
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                              isAlready
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                            }`}
                          >
                            {isAlready ? 'Already Added' : 'Compare'}
                          </button>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
