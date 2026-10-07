import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CheckCircle2, 
  Store, 
  MapPin, 
  Share2, 
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  Repeat,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCarousel from '../components/ProductCarousel';
import ProductReviews from '../components/ProductReviews';
import FrequentlyBoughtTogether from '../components/FrequentlyBoughtTogether';
import RecentlyViewedSection from '../components/RecentlyViewedSection';
import { usePersonalization } from '../context/PersonalizationContext';
import { PRODUCTS, SELLERS, INITIAL_REVIEWS } from '../data/mockData';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { deliveryLocation, user } = useAuth();
  const { addToast } = useToast();
  const { recordProductView, getSimilarProducts, getCustomersAlsoBought } = usePersonalization();

  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  const seller = SELLERS.find((s) => s.id === product.sellerId) || SELLERS[0];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImage(0);
    setQuantity(1);
    if (product) {
      recordProductView(product);
    }
  }, [id, product, recordProductView]);

  const inWishlist = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const similarProducts = getSimilarProducts(product, 8);
  const customersAlsoBought = getCustomersAlsoBought(product, 8);

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 6);

  return (
    <div className="space-y-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 py-1">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link to={`/category/${product.category}`} className="hover:text-indigo-600 capitalize transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 font-medium truncate max-w-md">{product.name}</span>
      </nav>

      {/* Main 3-Column Product View (Images, Details, Buy Box) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Col 1: Images Gallery (Left) */}
        <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-3">
          
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[460px] thin-scrollbar shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 rounded-xl border-2 p-1.5 bg-slate-50 overflow-hidden transition-all shrink-0 ${
                  selectedImage === idx
                    ? 'border-indigo-600 shadow-xs'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Main Large Display with Wishlist & Share */}
          <div className="flex-1 relative bg-slate-50/80 rounded-2xl border border-slate-200/80 p-6 flex items-center justify-center min-h-[350px] sm:min-h-[440px] group overflow-hidden">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="max-h-[380px] w-full object-contain transition-transform duration-500 group-hover:scale-108 cursor-crosshair"
            />

            {/* Quick Actions */}
            <div className="absolute top-3.5 right-3.5 flex flex-col gap-2 z-10">
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2.5 rounded-full border shadow-sm transition-all ${
                  inWishlist
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <button
                onClick={() => {
                  const id = product.id || product._id;
                  if (isInCompare(id)) {
                    removeFromCompare(id);
                  } else {
                    addToCompare(product);
                  }
                }}
                className={`p-2.5 rounded-full border shadow-sm transition-all ${
                  isInCompare(product.id || product._id)
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                }`}
                title={isInCompare(product.id || product._id) ? "Remove from Compare" : "Add to Compare"}
              >
                <Repeat className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  addToast('Product link copied to clipboard!', 'info');
                }}
                className="p-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm transition-all"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Col 2: Center Details (Title, Rating, Brand, Specs) */}
        <div className="lg:col-span-4 space-y-5">
          <div>
            <Link
              to={`/seller/${seller.id}`}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5 mb-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Direct from {seller.name}</span>
            </Link>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-950 leading-snug tracking-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-2 pt-1 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1 bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </div>
              <button
                onClick={() => {
                  setActiveTab('reviews');
                  document.getElementById('tabs-container')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs text-slate-600 hover:text-indigo-600 cursor-pointer font-medium"
              >
                {product.reviewCount?.toLocaleString('en-IN') || 48} verified reviews
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500">100+ answered Q&As</span>
            </div>
          </div>

          {/* Pricing & Deals */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2.5">
              <span className="text-rose-600 font-bold text-lg">-{product.discount}%</span>
              <span className="text-3xl font-extrabold text-slate-950">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              M.R.P.: <span className="line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Inclusive of all taxes. No-cost EMI starts at ₹{Math.round(product.price / 12)}/month.
            </div>
          </div>

          {/* Offers Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="border border-emerald-300 p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 text-xs shadow-2xs">
              <span className="font-extrabold text-emerald-950 flex items-center gap-1.5 mb-1">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Coupon Offer</span>
                <span className="font-mono text-[10px] bg-white border border-emerald-300 px-1.5 py-0.2 rounded text-emerald-900 font-bold ml-auto">
                  SAVE20
                </span>
              </span>
              <p className="text-[11px] text-emerald-800 leading-tight">
                Get <strong>20% OFF</strong> up to ₹500 with code <strong>SAVE20</strong>.
              </p>
            </div>
            <div className="border border-slate-200 p-3 rounded-2xl bg-slate-50/70 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">Card Offer</span>
              <p className="text-[11px] text-slate-500">Up to ₹1,500 instant discount on all major bank cards.</p>
            </div>
            <div className="border border-slate-200 p-3 rounded-2xl bg-slate-50/70 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">GST Invoice</span>
              <p className="text-[11px] text-slate-500">Save up to 28% with verified business purchasing.</p>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-[10px] text-slate-600 font-medium">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-indigo-600" />
              <span>Express Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-5 h-5 text-indigo-600" />
              <span>7 Days Returnable</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>1 Year Warranty</span>
            </div>
          </div>

          {/* Key Bullet Features */}
          <div className="space-y-2 pt-1">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Product Highlights
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside leading-relaxed">
              {product.features?.map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Col 3: Right Buy-Box */}
        <div className="lg:col-span-3 bg-slate-50/70 p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
          
          <div>
            <span className="text-2xl font-black text-slate-950">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <div className="text-xs text-slate-600 mt-1">
              <span className="font-bold text-emerald-600">FREE Express Delivery</span>{' '}
              <span className="font-bold text-slate-900">Tomorrow by 2 PM</span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Ship to {deliveryLocation?.city || 'India'} - {deliveryLocation?.pincode || '560038'}</span>
            </div>
          </div>

          {/* Stock status */}
          <div>
            {product.stock > 0 ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> In Stock & Ready to Dispatch
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-600">Currently Sold Out</span>
            )}
            <span className="text-[11px] text-slate-500 block mt-1">
              Dispatched from{' '}
              <Link to={`/seller/${seller.id}`} className="text-indigo-600 font-semibold hover:underline">
                {seller.name}
              </Link>{' '}
              via BazaarHub Logistics.
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-2 text-xs">
            <label className="font-bold text-slate-700">Quantity:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-semibold focus:outline-none focus:border-indigo-500 shadow-2xs cursor-pointer"
            >
              {[...Array(Math.min(product.stock || 5, 8))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Coupon Code inside Add to Cart Section */}
          <div className="p-3.5 rounded-2xl border border-dashed border-emerald-300 bg-gradient-to-r from-emerald-50/90 to-teal-50/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-950">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Coupon Code Available</span>
              </div>
              <span className="font-mono text-xs font-black bg-white border border-emerald-300 px-2 py-0.5 rounded text-slate-900 tracking-wider shadow-2xs">
                SAVE20
              </span>
            </div>

            <div className="text-[11px] text-slate-600 flex items-baseline justify-between">
              <span>Save 20% (~₹{Math.min(500, Math.round(product.price * 0.2)).toLocaleString('en-IN')})</span>
              <span className="font-semibold text-emerald-700">Min Order ₹500</span>
            </div>

            {appliedCoupon?.code === 'SAVE20' ? (
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  SAVE20 Applied!
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => applyCoupon('SAVE20')}
                className="w-full mt-0.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Apply SAVE20 to Cart</span>
              </button>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => addToCart(product, quantity)}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white text-white" />
              <span>Instant Buy Now</span>
            </button>
          </div>

          {/* Secure Transaction Guarantee */}
          <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit Escrow Security</span>
            </div>
            <p className="text-[10px] leading-tight text-slate-400">
              Payment is held safely in escrow until you inspect and accept delivery.
            </p>
          </div>

          {/* Wishlist & Compare buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className="py-2.5 text-xs text-slate-700 hover:text-rose-600 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{inWishlist ? 'Saved' : 'Wishlist'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const id = product.id || product._id;
                if (isInCompare(id)) {
                  removeFromCompare(id);
                } else {
                  addToCompare(product);
                }
              }}
              className={`py-2.5 text-xs border rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                isInCompare(product.id || product._id)
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-slate-700 hover:text-blue-600 border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>{isInCompare(product.id || product._id) ? 'Compared' : 'Compare'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Frequently Bought Together Bundle */}
      <FrequentlyBoughtTogether product={product} />

      {/* Specifications & Customer Reviews Tabs */}
      <div id="tabs-container" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Overview & Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-semibold">
              {product.reviewCount || 48}
            </span>
          </button>
        </div>

        {/* Tab 1: Specifications */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">About This Product</h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                {product.description}
              </p>
            </div>

            {product.specifications && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Technical Specifications</h3>
                <div className="max-w-2xl border border-slate-200/80 rounded-2xl overflow-hidden text-xs divide-y divide-slate-100">
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <div key={idx} className="grid grid-cols-2 p-3.5 bg-white even:bg-slate-50/50">
                      <span className="font-semibold text-slate-500">{key}</span>
                      <span className="text-slate-900 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Advanced Customer Reviews & Ratings */}
        {activeTab === 'reviews' && (
          <div id="reviews-section" className="pt-2">
            <ProductReviews product={product} initialReviews={INITIAL_REVIEWS} />
          </div>
        )}

      </div>

      {/* Similar Products Carousel */}
      {similarProducts.length > 0 && (
        <ProductCarousel
          title="Similar Products"
          subtitle="Explore comparable models and top alternatives in this category"
          products={similarProducts}
          viewAllLink={`/category/${product.category}`}
        />
      )}

      {/* Customers Also Bought Carousel */}
      {customersAlsoBought.length > 0 && (
        <ProductCarousel
          title="Customers Also Bought"
          subtitle="Frequently purchased together by verified customers who bought this item"
          products={customersAlsoBought}
          viewAllLink="/shop"
        />
      )}

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <ProductCarousel
          title="Related Items In This Category"
          subtitle="Discover complementary picks from our verified marketplace network"
          products={relatedProducts}
          viewAllLink={`/category/${product.category}`}
        />
      )}

      {/* Recently Viewed Items */}
      <RecentlyViewedSection />

    </div>
  );
}
