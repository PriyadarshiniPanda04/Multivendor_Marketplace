import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { 
  X, 
  User, 
  ChevronRight, 
  Flame, 
  Sparkles, 
  Store, 
  ShoppingBag, 
  HelpCircle, 
  LogOut,
  ShieldCheck,
  Package,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/mockData';

export default function AllDrawerMenu({ isOpen, onClose }) {
  const { user, isAuthenticated, logout, isSeller, isAdmin } = useAuth();

  // Prevent background scrolling while drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] h-screen w-screen flex select-none overflow-hidden">
      
      {/* 1. Full-screen Dimmed Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* 2. Slide-out Drawer (Full Screen Height, Overlapping Entire Page) */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white h-screen shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
        
        {/* User Greeting Header */}
        <div className="bg-slate-950 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <Link 
            to={isAuthenticated ? "/account" : "/login"} 
            onClick={onClose}
            className="flex items-center gap-3.5 hover:opacity-90 transition-opacity"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-xs" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white shadow-xs">
                <User className="w-5 h-5 text-indigo-400" />
              </div>
            )}
            <div>
              <span className="text-[11px] text-slate-400 block font-normal">Welcome to BazaarHub,</span>
              <span className="text-base font-bold tracking-tight block text-white">
                {isAuthenticated ? user.name : 'Sign in to your account'}
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Content (Spacious & Prominent) */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-sm text-slate-800 pb-12 thin-scrollbar">
          
          {/* Trending & Highlights */}
          <div className="py-4">
            <h3 className="px-6 py-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Trending & Highlights
            </h3>
            
            <Link
              to="/shop?filter=bestseller"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">Best Sellers</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/shop?filter=deals"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">Today's Deals</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/shop?filter=new"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">New Arrivals</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Shop by Department */}
          <div className="py-4">
            <h3 className="px-6 py-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Shop by Department
            </h3>
            
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={onClose}
                className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-800">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-normal">{cat.count}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </Link>
            ))}

            <Link
              to="/shop"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-3 mt-2 bg-blue-50/50 text-blue-600 font-bold hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <span>Explore All Products</span>
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </Link>
          </div>

          {/* Programs & Portals */}
          {(isSeller || isAdmin) && (
            <div className="py-4">
              <h3 className="px-6 py-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Merchant Portals
              </h3>

              {isSeller && (
                <Link
                  to="/seller/dashboard"
                  onClick={onClose}
                  className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-slate-800">Seller Dashboard</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={onClose}
                  className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-slate-800">Admin Console</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              )}
            </div>
          )}

          {/* Help & Settings */}
          <div className="py-4">
            <h3 className="px-6 py-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Help & Settings
            </h3>

            <Link
              to="/notifications"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="font-medium text-slate-800">Notifications & Alerts</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/account"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="font-medium text-slate-800">Your Account</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/orders"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="font-medium text-slate-800">Returns & Orders</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="font-medium text-slate-800">Your Wishlist</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/help"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="font-medium text-slate-800">Customer Support</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-6 py-3 mt-2 text-rose-600 font-semibold hover:bg-rose-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </div>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-between px-6 py-3 mt-2 bg-blue-50/50 text-blue-600 font-bold hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <span>Sign In</span>
                <ChevronRight className="w-4 h-4 text-blue-600" />
              </Link>
            )}
          </div>

        </div>

      </div>

    </div>,
    document.body
  );
}
