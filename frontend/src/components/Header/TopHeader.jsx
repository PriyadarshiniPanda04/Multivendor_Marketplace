import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  ChevronDown, 
  User, 
  Store, 
  Package, 
  Heart, 
  LogOut,
  ArrowRight,
  Globe,
  HelpCircle,
  Repeat,
  Bell,
  Camera
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import VisualSearchModal from './VisualSearchModal';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { CATEGORIES, PRODUCTS } from '../../data/mockData';

export default function TopHeader({ onOpenLocationModal }) {
  const { user, isAuthenticated, logout, deliveryLocation, isSeller } = useAuth();
  const { itemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);

  const accountRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocomplete live search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matches = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      ).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <div className="w-full bg-white select-none">
      
      {/* 1. Motta Top Announcement Bar */}
      <div className="bg-[#faeed6] text-slate-800 text-[11px] sm:text-xs py-1.5 px-4 text-center border-b border-[#ebd7b2]">
        <span>Limited Time Only: Up to 60% off Dining Furniture</span>{' '}
        <Link to="/shop?filter=deals" className="font-bold underline ml-1 hover:text-blue-600 transition-colors">
          Shop Now
        </Link>
      </div>

      {/* 2. Motta Utility Meta Bar */}
      <div className="border-b border-slate-200 text-slate-500 text-[11px] py-1.5 px-4 sm:px-8">
        <div className="max-w-[1536px] mx-auto flex items-center justify-between">
          
          {/* Left: Language & Currency */}
          <div className="flex items-center gap-4">
            
            {/* Language */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-32 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                  {['English', 'हिन्दी', 'తెలుగు', 'தமிழ்'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setIsLangOpen(false);
                      }}
                      className="w-full text-left px-3 py-1 text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency */}
            <div className="relative">
              <button 
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <span>{selectedCurrency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCurrencyOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-24 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                  {['INR', 'USD', 'EUR', 'GBP'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setSelectedCurrency(curr);
                        setIsCurrencyOpen(false);
                      }}
                      className="w-full text-left px-3 py-1 text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery Location Indicator */}
            <button
              onClick={onOpenLocationModal}
              className="hidden md:flex items-center gap-1.5 text-slate-600 hover:text-blue-600 cursor-pointer pl-2 border-l border-slate-200 transition-colors"
              title="Click to change delivery location or use live GPS"
            >
              {deliveryLocation?.isLiveLocation && (
                <span className="relative flex h-2 w-2" title="Live GPS Location Active">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
              <span>Deliver to:</span>
              <span className="font-semibold text-slate-800">
                {deliveryLocation?.city && deliveryLocation.city !== 'India'
                  ? deliveryLocation.city
                  : deliveryLocation?.pincode
                  ? `PIN ${deliveryLocation.pincode}`
                  : 'India'}
              </span>
            </button>

          </div>

          {/* Right: Track Order, Help, Compare, Wishlist */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/orders" className="flex items-center gap-1 hover:text-slate-900 transition-colors">
              <Package className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Track Order</span>
            </Link>
            <Link to="/help" className="flex items-center gap-1 hover:text-slate-900 transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Help Center</span>
            </Link>
            <Link to="/compare" className="flex items-center gap-1 hover:text-slate-900 transition-colors relative">
              <Repeat className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compare</span>
              {compareCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 rounded-full">
                  {compareCount}
                </span>
              )}
            </Link>
            <Link to="/wishlist" className="flex items-center gap-1 hover:text-slate-900 transition-colors">
              <Heart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-1.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/notifications" className="flex items-center gap-1 hover:text-slate-900 transition-colors">
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Notifications</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 3. Main Motta Header Bar */}
      <div className="border-b border-slate-200 py-4 px-4 sm:px-8">
        <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-6">
          
          {/* Logo with Motta-style dots */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-serif">
                  Bazaar<span className="font-sans font-extrabold text-slate-900">Hub</span>
                </span>
                {/* Motta Signature 4-dots cluster */}
                <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                  <div className="w-1.5 h-1.5 rounded-xs bg-[#2b59ff]"></div>
                  <div className="w-1.5 h-1.5 rounded-xs bg-[#f59e0b]"></div>
                  <div className="w-1.5 h-1.5 rounded-xs bg-[#ef4444]"></div>
                  <div className="w-1.5 h-1.5 rounded-xs bg-[#10b981]"></div>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-medium tracking-wider -mt-1 uppercase">
                Best For Shopping
              </span>
            </div>
          </Link>

          {/* Centered Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative hidden sm:block">
            <form 
              onSubmit={handleSearchSubmit}
              className="flex w-full h-11 border border-slate-300 rounded-md overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Search for anything"
                className="flex-1 px-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-white"
              />

              {/* Visual Search (Camera Icon) */}
              <button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="px-2.5 text-slate-400 hover:text-blue-600 transition-colors flex items-center justify-center cursor-pointer group"
                title="Search by image (Upload product photo)"
              >
                <Camera className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              </button>

              {/* Motta Signature Royal Blue Search Button */}
              <button
                type="submit"
                className="w-12 bg-[#2b59ff] hover:bg-[#1f4bf0] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="Search"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100 text-slate-800 text-xs animate-in fade-in">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(`/product/${item.id}`);
                      setShowSuggestions(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-8 h-8 object-contain rounded border border-slate-200 p-0.5 bg-slate-50"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-slate-900">{item.name}</p>
                      <span className="text-[11px] text-slate-500">
                        in <span className="text-blue-600 font-medium capitalize">{item.category}</span> • ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
                <div 
                  onClick={handleSearchSubmit}
                  className="px-4 py-2 bg-slate-50 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer text-center"
                >
                  View all results for "{searchQuery}" →
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons: Notification Bell, Account & Cart Logo */}
          <div className="flex items-center gap-3.5 sm:gap-5 shrink-0">
            
            {/* Visual Search Mobile Trigger */}
            <button
              type="button"
              onClick={() => setIsVisualSearchOpen(true)}
              className="sm:hidden p-1.5 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
              title="Search by image"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Notification Bell Dropdown */}
            <NotificationBell />

            {/* Account */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center gap-2 text-slate-800 hover:text-blue-600 text-xs font-semibold cursor-pointer transition-colors"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-5 h-5 rounded-full object-cover border border-slate-300" />
                ) : (
                  <User className="w-4 h-4 text-slate-700" />
                )}
                <span className="hidden sm:inline">
                  {isAuthenticated ? (user.name?.split(' ')[0] || 'Account') : 'Account'}
                </span>
              </button>

              {/* Account Dropdown */}
              {isAccountOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 z-50 p-4 text-xs animate-in fade-in">
                  {!isAuthenticated ? (
                    <div className="text-center pb-3 border-b border-slate-100">
                      <Link
                        to="/login"
                        onClick={() => setIsAccountOpen(false)}
                        className="block w-full py-2 bg-[#2b59ff] hover:bg-[#1f4bf0] text-white font-bold rounded text-xs transition-colors"
                      >
                        Sign In
                      </Link>
                      <p className="mt-2 text-[11px] text-slate-500">
                        New customer?{' '}
                        <Link
                          to="/register"
                          onClick={() => setIsAccountOpen(false)}
                          className="text-blue-600 font-bold hover:underline"
                        >
                          Register
                        </Link>
                      </p>
                    </div>
                  ) : (
                    <div className="pb-3 border-b border-slate-100 flex items-center gap-3">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-xs shrink-0">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

                  <ul className="space-y-2 pt-3 text-slate-600">
                    <li>
                      <Link to="/notifications" onClick={() => setIsAccountOpen(false)} className="hover:text-blue-600 flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5" /> Notifications
                      </Link>
                    </li>
                    <li>
                      <Link to="/orders" onClick={() => setIsAccountOpen(false)} className="hover:text-blue-600 flex items-center gap-2">
                        <Package className="w-3.5 h-3.5" /> My Orders
                      </Link>
                    </li>
                    <li>
                      <Link to="/wishlist" onClick={() => setIsAccountOpen(false)} className="hover:text-blue-600 flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5" /> Wishlist
                      </Link>
                    </li>
                    {isSeller && (
                      <li>
                        <Link to="/seller/dashboard" onClick={() => setIsAccountOpen(false)} className="hover:text-blue-600 flex items-center gap-2 font-medium text-amber-600">
                          <Store className="w-3.5 h-3.5" /> Seller Dashboard
                        </Link>
                      </li>
                    )}
                    {isAuthenticated && (
                      <li className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            logout();
                            setIsAccountOpen(false);
                          }}
                          className="text-red-600 font-semibold hover:underline flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Cart Button: Logo only with count badge as requested */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="flex items-center gap-1.5 text-slate-800 hover:text-blue-600 text-xs font-semibold cursor-pointer relative group transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="w-4.5 h-4.5 text-slate-800 group-hover:text-blue-600 transition-colors" />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#2b59ff] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>

          </div>

        </div>
      </div>

      {/* Visual Search Modal (AI Lens) */}
      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
      />

    </div>
  );
}
