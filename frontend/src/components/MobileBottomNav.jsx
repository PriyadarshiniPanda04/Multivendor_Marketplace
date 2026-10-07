import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Package, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { itemsCount } = useCart();
  const { isAuthenticated } = useAuth();

  const NAV_ITEMS = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore', path: '/shop', icon: Grid },
    { label: 'Bag', path: '/cart', icon: ShoppingBag, badge: itemsCount },
    { label: 'Orders', path: '/orders', icon: Package },
    { label: 'Account', path: isAuthenticated ? '/account' : '/login', icon: User }
  ];

  return (
    <nav className="fixed bottom-3 inset-x-4 max-w-md mx-auto z-40 bg-slate-950/90 backdrop-blur-lg text-white rounded-2xl border border-white/10 shadow-2xl py-2 px-3 md:hidden select-none">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-white font-bold bg-white/10' : 'text-slate-400 hover:text-white font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-indigo-400' : 'stroke-2'}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
