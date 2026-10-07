import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  ChevronRight, 
  X, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/mockData';

export default function ShopPage() {
  const navigate = useNavigate();
  const { category: paramCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const filterQuery = searchParams.get('filter') || '';
  const queryCategory = searchParams.get('category') || '';

  const activeCategoryFromRoute = paramCategory || queryCategory || 'all';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(activeCategoryFromRoute);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sync state whenever URL param or query changes (e.g. from top navbar clicks)
  useEffect(() => {
    setSelectedCategory(activeCategoryFromRoute);
    setCurrentPage(1);
  }, [paramCategory, queryCategory]);

  const handleCategoryChange = (newCat) => {
    setSelectedCategory(newCat);
    setCurrentPage(1);
    const queryStr = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
    if (!newCat || newCat === 'all') {
      navigate(`/shop${queryStr}`);
    } else {
      navigate(`/category/${newCat}${queryStr}`);
    }
  };

  // Derive unique brands
  const availableBrands = useMemo(() => {
    const brandsSet = new Set(PRODUCTS.map((p) => p.brand).filter(Boolean));
    return Array.from(brandsSet);
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    const activeCat = selectedCategory;
    if (activeCat && activeCat !== 'all') {
      const target = activeCat.toLowerCase();
      const matchedCategoryObj = CATEGORIES.find(
        (c) => c.slug.toLowerCase() === target || c.id.toLowerCase() === target || c.name.toLowerCase() === target
      );
      const targetSlug = matchedCategoryObj ? matchedCategoryObj.slug.toLowerCase() : target;
      const targetName = matchedCategoryObj ? matchedCategoryObj.name.toLowerCase() : target;

      result = result.filter((p) => {
        const pCat = (p.category || '').toLowerCase();
        return pCat === targetSlug || 
               pCat === targetName || 
               p.subcategory?.toLowerCase().includes(target);
      });
    }

    // Special quick filters (from url queries)
    if (filterQuery === 'deals') {
      result = result.filter((p) => p.isDealOfDay || p.discount >= 40);
    } else if (filterQuery === 'bestseller') {
      result = result.filter((p) => p.isBestSeller);
    } else if (filterQuery === 'new') {
      result = result.filter((p) => p.discount > 0);
    }

    // Price range
    if (priceRange.min !== '') {
      result = result.filter((p) => p.price >= Number(priceRange.min));
    }
    if (priceRange.max !== '') {
      result = result.filter((p) => p.price <= Number(priceRange.max));
    }

    // Rating
    if (selectedRating !== null) {
      result = result.filter((p) => p.rating >= selectedRating);
    }

    // Brands
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Free delivery
    if (freeDeliveryOnly) {
      result = result.filter((p) => p.freeDelivery);
    }

    // Stock
    if (!onlyInStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
    }

    return result;
  }, [
    paramCategory,
    selectedCategory,
    searchQuery,
    filterQuery,
    priceRange,
    selectedRating,
    selectedBrands,
    freeDeliveryOnly,
    onlyInStock,
    sortBy
  ]);

  // Pagination slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedRating(null);
    setSelectedBrands([]);
    setOnlyInStock(false);
    setFreeDeliveryOnly(false);
    handleCategoryChange('all');
  };

  const categoryName = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') return 'All Products';
    const target = selectedCategory.toLowerCase();
    const found = CATEGORIES.find(
      (c) => c.slug.toLowerCase() === target ||
             c.id.toLowerCase() === target ||
             c.name.toLowerCase() === target
    );
    return found ? found.name : selectedCategory;
  }, [selectedCategory]);

  return (
    <div className="space-y-6 max-w-[1536px] mx-auto select-none">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 py-1">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
        {categoryName !== 'All Products' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">{categoryName}</span>
          </>
        )}
        {searchQuery && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 italic">"{searchQuery}"</span>
          </>
        )}
      </nav>

      {/* Top Banner / Search Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {searchQuery ? `Search results for "${searchQuery}"` : categoryName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> items in marketplace catalog
          </p>
        </div>

        {/* Sort Controls & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <label className="text-slate-500 font-medium whitespace-nowrap">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs cursor-pointer transition-colors"
            >
              <option value="featured">Featured First</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
              <option value="discount">Highest Discount %</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Prominent Left Sidebar + Products */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Filter Sidebar (Desktop) - Large, Prominent & Spacious */}
        <div className="hidden md:block md:col-span-4 lg:col-span-4 xl:col-span-3.5 sticky top-24">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceChange={(range) => {
              setPriceRange(range);
              setCurrentPage(1);
            }}
            selectedRating={selectedRating}
            onRatingChange={(rating) => {
              setSelectedRating(rating);
              setCurrentPage(1);
            }}
            selectedBrands={selectedBrands}
            onBrandToggle={handleBrandToggle}
            availableBrands={availableBrands}
            onlyInStock={onlyInStock}
            onStockToggle={() => setOnlyInStock(!onlyInStock)}
            freeDeliveryOnly={freeDeliveryOnly}
            onFreeDeliveryToggle={() => setFreeDeliveryOnly(!freeDeliveryOnly)}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Slide Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div 
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="relative w-full max-w-sm bg-slate-50 h-full shadow-2xl p-5 overflow-y-auto z-10">
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-200">
                <span className="font-extrabold text-base text-slate-900">Filter & Categories</span>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar
                selectedCategory={selectedCategory}
                onCategoryChange={(cat) => {
                  handleCategoryChange(cat);
                  setIsMobileFilterOpen(false);
                }}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                selectedRating={selectedRating}
                onRatingChange={setSelectedRating}
                selectedBrands={selectedBrands}
                onBrandToggle={handleBrandToggle}
                availableBrands={availableBrands}
                onlyInStock={onlyInStock}
                onStockToggle={() => setOnlyInStock(!onlyInStock)}
                freeDeliveryOnly={freeDeliveryOnly}
                onFreeDeliveryToggle={() => setFreeDeliveryOnly(!freeDeliveryOnly)}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>
        )}

        {/* Right: Products Listing (Balanced Width) */}
        <div className="md:col-span-8 lg:col-span-8 xl:col-span-8.5 space-y-6">
          
          {/* Active Filter Chips */}
          {(selectedBrands.length > 0 || selectedRating || priceRange.min || priceRange.max || freeDeliveryOnly || (selectedCategory && selectedCategory !== 'all')) && (
            <div className="flex items-center flex-wrap gap-2 py-1">
              <span className="text-xs font-bold text-slate-500">Active Filters:</span>
              
              {selectedCategory && selectedCategory !== 'all' && (
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <span>Category: {categoryName}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {selectedBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandToggle(brand)}
                  className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <span>Brand: {brand}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              ))}

              {selectedRating && (
                <button
                  onClick={() => setSelectedRating(null)}
                  className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{selectedRating}★ & Above</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {freeDeliveryOnly && (
                <button
                  onClick={() => setFreeDeliveryOnly(false)}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Free Shipping</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs text-blue-600 font-bold underline hover:text-blue-700 ml-1 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Product Grid - Spacious 3-4 column grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/90 shadow-xs space-y-4">
              <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                We couldn't find any items matching your current filters. Try selecting a different department, widening your price range, or clearing filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-[#2b59ff] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500">
                Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
                <span className="font-bold text-slate-900">{totalPages}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3.5 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-xl font-bold transition-all cursor-pointer ${
                      currentPage === i + 1
                        ? 'bg-[#2b59ff] text-white shadow-xs'
                        : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3.5 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
