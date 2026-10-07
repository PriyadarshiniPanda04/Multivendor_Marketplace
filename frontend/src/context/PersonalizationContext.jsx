import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { PRODUCTS } from '../data/mockData';

const PersonalizationContext = createContext();

// Pre-seeded initial browsing history for realistic first-time personalization
const DEFAULT_INITIAL_HISTORY = [
  { productId: 'prod-1', viewedAt: Date.now() - 1000 * 60 * 15 }, // 15 mins ago: Sony WH-1000XM5 (electronics)
  { productId: 'prod-2', viewedAt: Date.now() - 1000 * 60 * 45 }, // 45 mins ago: Apple iPhone 15 Pro (mobiles)
  { productId: 'prod-3', viewedAt: Date.now() - 1000 * 60 * 120 } // 2 hrs ago: MacBook Pro M3 (laptops)
];

export function PersonalizationProvider({ children }) {
  const [historyItems, setHistoryItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bazaarhub_browsing_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_INITIAL_HISTORY;
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bazaarhub_browsing_history', JSON.stringify(historyItems));
    } catch (e) {}
  }, [historyItems]);

  // Record a product view
  const recordProductView = useCallback((product) => {
    if (!product || !product.id) return;
    setHistoryItems(prev => {
      // Remove any existing entry for this product and place at front
      const filtered = prev.filter(item => item.productId !== product.id);
      return [{ productId: product.id, viewedAt: Date.now() }, ...filtered].slice(0, 30);
    });
  }, []);

  // Remove a single product from history
  const removeFromHistory = useCallback((productId) => {
    setHistoryItems(prev => prev.filter(item => item.productId !== productId));
  }, []);

  // Clear all browsing history
  const clearHistory = useCallback(() => {
    setHistoryItems([]);
  }, []);

  // Resolved list of Recently Viewed product objects
  const recentlyViewedProducts = useMemo(() => {
    return historyItems
      .map(entry => {
        const prod = PRODUCTS.find(p => p.id === entry.productId);
        if (!prod) return null;
        return {
          ...prod,
          viewedAt: entry.viewedAt
        };
      })
      .filter(Boolean);
  }, [historyItems]);

  // Calculate user's preferred categories based on browsing frequency
  const preferredCategories = useMemo(() => {
    const counts = {};
    recentlyViewedProducts.forEach(prod => {
      if (prod.category) {
        counts[prod.category] = (counts[prod.category] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);
  }, [recentlyViewedProducts]);

  // Top inferred interest title
  const topInterestName = useMemo(() => {
    if (recentlyViewedProducts.length > 0) {
      return recentlyViewedProducts[0].name;
    }
    return 'Electronics & Gadgets';
  }, [recentlyViewedProducts]);

  // 1. Recommended For You: Dynamic algorithm based on user's viewed categories & brands
  const getRecommendedProducts = useCallback((limit = 12) => {
    const viewedIds = new Set(historyItems.map(h => h.productId));
    const targetCategories = preferredCategories.length > 0
      ? preferredCategories
      : ['electronics', 'mobiles', 'fashion', 'smartwatches'];

    // Products in user's favorite categories that they haven't seen yet
    const categoryMatches = PRODUCTS.filter(p => 
      targetCategories.includes(p.category) && !viewedIds.has(p.id)
    );

    // Highly rated fallback
    const popularFallback = PRODUCTS.filter(p => !viewedIds.has(p.id) && !categoryMatches.some(m => m.id === p.id))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));

    const combined = [...categoryMatches, ...popularFallback];
    return combined.slice(0, limit);
  }, [historyItems, preferredCategories]);

  // 2. Similar Products: Direct alternatives in the exact same category
  const getSimilarProducts = useCallback((targetProduct, limit = 8) => {
    if (!targetProduct) return [];
    return PRODUCTS.filter(p => 
      p.id !== targetProduct.id && 
      (p.category === targetProduct.category || p.brand === targetProduct.brand)
    ).slice(0, limit);
  }, []);

  // 3. Frequently Bought Together: Smart bundle generator
  const getFrequentlyBoughtTogether = useCallback((mainProduct) => {
    if (!mainProduct) return null;

    // Smart pairing based on product category
    let companions = [];

    if (mainProduct.category === 'mobiles' || mainProduct.category === 'electronics') {
      // Pair with audio / smartwatches / accessories
      companions = PRODUCTS.filter(p => 
        p.id !== mainProduct.id && 
        (p.category === 'smartwatches' || p.category === 'electronics' || p.category === 'laptops')
      ).slice(0, 2);
    } else if (mainProduct.category === 'fashion') {
      // Pair with other fashion / beauty / accessories
      companions = PRODUCTS.filter(p => 
        p.id !== mainProduct.id && 
        (p.category === 'fashion' || p.category === 'beauty' || p.category === 'smartwatches')
      ).slice(0, 2);
    } else if (mainProduct.category === 'home' || mainProduct.category === 'kitchen') {
      companions = PRODUCTS.filter(p => 
        p.id !== mainProduct.id && 
        (p.category === 'home' || p.category === 'kitchen' || p.category === 'appliances')
      ).slice(0, 2);
    } else {
      // Generic top rated companions
      companions = PRODUCTS.filter(p => p.id !== mainProduct.id && p.isBestSeller).slice(0, 2);
    }

    if (companions.length < 2) {
      companions = PRODUCTS.filter(p => p.id !== mainProduct.id).slice(0, 2);
    }

    const bundleItems = [mainProduct, ...companions];
    const originalTotal = bundleItems.reduce((acc, item) => acc + (item.originalPrice || item.price * 1.2), 0);
    const regularTotal = bundleItems.reduce((acc, item) => acc + item.price, 0);
    const bundleDiscount = Math.round(regularTotal * 0.1); // extra 10% bundle coupon
    const bundlePrice = regularTotal - bundleDiscount;

    return {
      mainProduct,
      companions,
      bundleItems,
      originalTotal,
      regularTotal,
      bundleDiscount,
      bundlePrice
    };
  }, []);

  // 4. Customers Also Bought: Collaborative filtering recommendations
  const getCustomersAlsoBought = useCallback((targetProduct, limit = 8) => {
    if (!targetProduct) return [];
    // Cross-category popular products
    return PRODUCTS.filter(p => 
      p.id !== targetProduct.id && (p.isBestSeller || p.rating >= 4.6)
    ).slice(0, limit);
  }, []);

  return (
    <PersonalizationContext.Provider
      value={{
        recentlyViewed: recentlyViewedProducts,
        preferredCategories,
        topInterestName,
        recordProductView,
        removeFromHistory,
        clearHistory,
        getRecommendedProducts,
        getSimilarProducts,
        getFrequentlyBoughtTogether,
        getCustomersAlsoBought
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
}
