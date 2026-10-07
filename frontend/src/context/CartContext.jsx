import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { PRODUCTS } from '../data/mockData';
import { couponService } from '../services/couponService';

const CartContext = createContext(null);

const INITIAL_CART = [
  {
    product: PRODUCTS[0], // AeroWave Pro Headphones
    quantity: 1
  },
  {
    product: PRODUCTS[5], // Horizon Active 2 Smartwatch
    quantity: 1
  }
];

export function CartProvider({ children }) {
  const { addToast } = useToast();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bazaarhub_cart');
      return saved ? JSON.parse(saved) : INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      const saved = localStorage.getItem('bazaarhub_saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('bazaarhub_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('bazaarhub_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('bazaarhub_saved', JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('bazaarhub_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('bazaarhub_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock || 10)
        };
        addToast(`Updated ${product.name.slice(0, 28)}... quantity in Cart!`, 'success');
        return updated;
      } else {
        addToast(`Added to Cart! Apply coupon SAVE20 for 20% OFF.`, 'success');
        return [...prev, { product, quantity }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const item = items.find((i) => i.product.id === productId);
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
    if (item) {
      addToast(`Removed item from Cart.`, 'info');
    }
  };

  const saveForLaterItem = (productId) => {
    const item = items.find((i) => i.product.id === productId);
    if (!item) return;
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    setSavedForLater((prev) => {
      if (prev.some((p) => p.product.id === productId)) return prev;
      return [...prev, item];
    });
    addToast('Item moved to Save for Later.', 'info');
  };

  const moveToCartFromSaved = (productId) => {
    const item = savedForLater.find((i) => i.product.id === productId);
    if (!item) return;
    setSavedForLater((prev) => prev.filter((i) => i.product.id !== productId));
    addToCart(item.product, item.quantity || 1);
  };

  const removeSavedItem = (productId) => {
    setSavedForLater((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      addToast('Please enter a coupon code.', 'error');
      return { success: false, message: 'Please enter a coupon code.' };
    }
    const result = await couponService.validateCoupon(code, subtotal);
    if (result.valid) {
      setAppliedCoupon(result.coupon);
      addToast(result.message, 'success');
      return { success: true, ...result };
    } else {
      addToast(result.message, 'error');
      return { success: false, ...result };
    }
  };

  const removeCoupon = () => {
    if (appliedCoupon) {
      const code = appliedCoupon.code;
      setAppliedCoupon(null);
      addToast(`Coupon "${code}" removed.`, 'info');
    }
  };

  // Calculations
  const itemsCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const originalSubtotal = items.reduce(
    (acc, curr) => acc + (curr.product.originalPrice || curr.product.price) * curr.quantity,
    0
  );
  const totalSavings = originalSubtotal - subtotal;
  const freeDeliveryThreshold = 499;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold || items.length === 0;
  const deliveryFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : 40;

  // Coupon calculations
  let couponDiscount = 0;
  let isCouponValidForSubtotal = true;
  let couponMinAmountRequired = 0;

  if (appliedCoupon && items.length > 0) {
    if (appliedCoupon.minOrderAmount && subtotal < appliedCoupon.minOrderAmount) {
      isCouponValidForSubtotal = false;
      couponMinAmountRequired = appliedCoupon.minOrderAmount;
      couponDiscount = 0;
    } else {
      couponDiscount = couponService.calculateDiscount(appliedCoupon, subtotal);
    }
  }

  const finalTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        items,
        savedForLater,
        itemsCount,
        subtotal,
        originalSubtotal,
        totalSavings,
        freeDeliveryThreshold,
        isFreeDelivery,
        deliveryFee,
        appliedCoupon,
        couponDiscount,
        isCouponValidForSubtotal,
        couponMinAmountRequired,
        finalTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        saveForLaterItem,
        moveToCartFromSaved,
        removeSavedItem,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
