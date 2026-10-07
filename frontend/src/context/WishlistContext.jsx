import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';
import { PRODUCTS } from '../data/mockData';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { addToast } = useToast();
  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('bazaarhub_wishlist');
      return saved ? JSON.parse(saved) : [PRODUCTS[2], PRODUCTS[6]];
    } catch {
      return [PRODUCTS[2], PRODUCTS[6]];
    }
  });

  useEffect(() => {
    localStorage.setItem('bazaarhub_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        addToast(`Removed from your Wishlist.`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        addToast(`Added ${product.name.slice(0, 24)}... to Wishlist!`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    addToast('Removed from Wishlist.', 'info');
  };

  const moveToCart = (product) => {
    removeFromWishlist(product.id);
    addToCart(product, 1);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        moveToCart
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
