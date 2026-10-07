import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'order_placed',
    title: 'Order Placed Successfully',
    message: 'Order #ORD-84920 for ₹4,899 has been placed. We are preparing it for dispatch!',
    category: 'orders',
    link: '/orders',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'notif-2',
    type: 'order_shipped',
    title: 'Order Shipped',
    message: 'Your package for order #ORD-83910 is on the way via BlueDart Express (Track: BD829104).',
    category: 'orders',
    link: '/orders',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
  },
  {
    id: 'notif-3',
    type: 'coupon_available',
    title: 'New Coupon Available',
    message: 'Use coupon code MEGA25 to get flat 25% off up to ₹1,500 on all electronics & gadgets!',
    category: 'offers',
    link: '/shop',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'notif-4',
    type: 'price_dropped',
    title: 'Price Dropped on Wishlist Item',
    message: 'Price drop alert! Sony WH-1000XM5 ANC Headphones dropped by ₹3,500 in your wishlist.',
    category: 'offers',
    link: '/wishlist',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    id: 'notif-5',
    type: 'back_in_stock',
    title: 'Product Back in Stock',
    message: 'Apple iPhone 15 Pro (128GB - Natural Titanium) is back in stock. Limited units available!',
    category: 'stock',
    link: '/shop',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'notif-6',
    type: 'order_delivered',
    title: 'Order Delivered',
    message: 'Order #ORD-82845 has been delivered to your address. Please share your product review.',
    category: 'orders',
    link: '/orders',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
  {
    id: 'notif-7',
    type: 'seller_approval',
    title: 'Seller Account Approved',
    message: 'Congratulations! Your seller application for "Zenith Crafts Store" has been approved.',
    category: 'seller',
    link: '/seller/dashboard',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'notif-8',
    type: 'new_message',
    title: 'New Message Received',
    message: 'Seller AudioTech India sent a message: "Your warranty card and invoice have been generated."',
    category: 'messages',
    link: '/help',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  }
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('bazaarhub_notifications');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('bazaarhub_notif_sound') !== 'false';
  });

  // Save to local storage whenever notifications change
  useEffect(() => {
    try {
      localStorage.setItem('bazaarhub_notifications', JSON.stringify(notifications));
    } catch (err) {
      console.error('Error saving notifications to localStorage:', err);
    }
  }, [notifications]);

  // Optionally fetch initial list from backend on mount
  useEffect(() => {
    const fetchBackendNotifs = async () => {
      try {
        const res = await fetch(`${API_BASE}/notifications`);
        if (res.ok) {
          const data = await res.json();
          if (data?.notifications && data.notifications.length > 0) {
            // merge or sync if local is default
            const localSaved = localStorage.getItem('bazaarhub_notifications');
            if (!localSaved) {
              setNotifications(data.notifications);
            }
          }
        }
      } catch (err) {
        // Backend offline or dev mode, continue with local state
      }
    };
    fetchBackendNotifs();
  }, []);

  // Subtle Web Audio chime
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // ignore audio play restrictions
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('bazaarhub_notif_sound', String(next));
      return next;
    });
  };

  // Add new notification
  const addNotification = useCallback((notif) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: notif.type || 'system',
      title: notif.title || 'New Notification',
      message: notif.message || '',
      category: notif.category || 'orders',
      link: notif.link || '/notifications',
      metadata: notif.metadata || {},
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotif, ...prev]);
    playChime();

    // Async push to backend if available
    try {
      fetch(`${API_BASE}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotif)
      }).catch(() => {});
    } catch (e) {}

    return newNotif;
  }, [playChime]);

  // Mark single as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, isRead: true } : item))
    );
    try {
      fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' }).catch(() => {});
    } catch (e) {}
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
    try {
      fetch(`${API_BASE}/notifications/read-all`, { method: 'PATCH' }).catch(() => {});
    } catch (e) {}
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
    try {
      fetch(`${API_BASE}/notifications/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    try {
      fetch(`${API_BASE}/notifications`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
  }, []);

  // Reset to default sample notifications
  const resetToDefault = useCallback(() => {
    setNotifications(DEFAULT_NOTIFICATIONS);
  }, []);

  // Simulate any of the 8 notification types requested by user
  const simulateNotification = useCallback((type) => {
    const examples = {
      order_placed: {
        type: 'order_placed',
        title: 'Order Placed Successfully',
        message: `Order #ORD-${Math.floor(10000 + Math.random() * 90000)} has been placed! Total ₹${(Math.floor(Math.random() * 50) * 100 + 499).toLocaleString('en-IN')}.`,
        category: 'orders',
        link: '/orders'
      },
      order_shipped: {
        type: 'order_shipped',
        title: 'Order Shipped',
        message: `Order #ORD-${Math.floor(10000 + Math.random() * 90000)} has been dispatched via BlueDart Express. Track live!`,
        category: 'orders',
        link: '/orders'
      },
      order_delivered: {
        type: 'order_delivered',
        title: 'Order Delivered',
        message: `Package for Order #ORD-${Math.floor(10000 + Math.random() * 90000)} was safely delivered. How do you like your item?`,
        category: 'orders',
        link: '/orders'
      },
      coupon_available: {
        type: 'coupon_available',
        title: 'Coupon Available: SAVE30',
        message: 'Surprise! Apply code SAVE30 at checkout for an extra 30% discount on festive products.',
        category: 'offers',
        link: '/shop'
      },
      price_dropped: {
        type: 'price_dropped',
        title: 'Price Dropped!',
        message: 'An item on your wishlist dropped by ₹1,200. Grab it now while the sale lasts!',
        category: 'offers',
        link: '/wishlist'
      },
      back_in_stock: {
        type: 'back_in_stock',
        title: 'Product Back in Stock',
        message: 'The trending Wireless Noise-Cancelling Headphones are restocked in all colors!',
        category: 'stock',
        link: '/shop'
      },
      seller_approval: {
        type: 'seller_approval',
        title: 'Seller Application Approved',
        message: 'Your seller profile "Royal Artisan Studio" is verified! Start uploading products today.',
        category: 'seller',
        link: '/seller/dashboard'
      },
      new_message: {
        type: 'new_message',
        title: 'New Message from Seller',
        message: 'Seller Velvet Furnishings: "We have updated your shipping slot as requested."',
        category: 'messages',
        link: '/help'
      }
    };

    const target = examples[type] || examples.order_placed;
    return addNotification(target);
  }, [addNotification]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        soundEnabled,
        toggleSound,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        resetToDefault,
        simulateNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
