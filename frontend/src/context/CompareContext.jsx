import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext();

const STORAGE_KEY = 'bazaarhub_compare_items';
const MAX_COMPARE_ITEMS = 4;

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse compare items', e);
      return [];
    }
  });

  const { showToast } = useToast() || { showToast: () => {} };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
    } catch (e) {
      console.error('Failed to save compare items', e);
    }
  }, [compareItems]);

  const addToCompare = (product) => {
    if (!product || !product._id) return false;

    if (compareItems.some(item => item._id === product._id)) {
      if (showToast) showToast('Product is already in comparison list', 'info');
      return false;
    }

    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      if (showToast) showToast(`You can compare up to ${MAX_COMPARE_ITEMS} products at a time. Remove one first.`, 'warning');
      return false;
    }

    setCompareItems(prev => [...prev, product]);
    if (showToast) showToast(`Added "${product.name?.substring(0, 25)}..." to compare`, 'success');
    return true;
  };

  const removeFromCompare = (productId) => {
    setCompareItems(prev => prev.filter(item => item._id !== productId));
    if (showToast) showToast('Product removed from compare', 'info');
  };

  const clearCompare = () => {
    setCompareItems([]);
    if (showToast) showToast('Compare list cleared', 'info');
  };

  const isInCompare = (productId) => {
    return compareItems.some(item => item._id === productId);
  };

  const setComparisonList = (products) => {
    setCompareItems(products.slice(0, MAX_COMPARE_ITEMS));
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        compareCount: compareItems.length,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        setComparisonList,
        MAX_COMPARE_ITEMS
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
