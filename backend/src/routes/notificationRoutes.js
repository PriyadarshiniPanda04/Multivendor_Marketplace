const express = require('express');
const router = express.Router();

// In-memory / Mock Notification store with sample data for all required examples
let notifications = [
  {
    id: 'notif-1',
    type: 'order_placed',
    title: 'Order Placed Successfully',
    message: 'Order #ORD-84920 for ₹4,899 has been placed. We are preparing it for dispatch!',
    category: 'orders',
    link: '/orders',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
  },
  {
    id: 'notif-2',
    type: 'order_shipped',
    title: 'Order Shipped',
    message: 'Your package for order #ORD-83910 is on the way via BlueDart Express (Track: BD829104).',
    category: 'orders',
    link: '/orders',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(), // 1 hour ago
  },
  {
    id: 'notif-3',
    type: 'coupon_available',
    title: 'New Coupon Available',
    message: 'Use coupon code MEGA25 to get flat 25% off up to ₹1,500 on all electronics & gadgets!',
    category: 'offers',
    link: '/shop',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
  },
  {
    id: 'notif-4',
    type: 'price_dropped',
    title: 'Price Dropped on Wishlist Item',
    message: 'Price drop alert! Sony WH-1000XM5 ANC Headphones dropped by ₹3,500.',
    category: 'offers',
    link: '/wishlist',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
  },
  {
    id: 'notif-5',
    type: 'back_in_stock',
    title: 'Product Back in Stock',
    message: 'Apple iPhone 15 Pro (128GB - Natural Titanium) is back in stock. Limited units available!',
    category: 'stock',
    link: '/shop',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'notif-6',
    type: 'order_delivered',
    title: 'Order Delivered',
    message: 'Order #ORD-82845 has been delivered to your address. Please share your product review.',
    category: 'orders',
    link: '/orders',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 1 day ago
  },
  {
    id: 'notif-7',
    type: 'seller_approval',
    title: 'Seller Account Approved',
    message: 'Congratulations! Your seller application for "Zenith Crafts Store" has been approved.',
    category: 'seller',
    link: '/seller/dashboard',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: 'notif-8',
    type: 'new_message',
    title: 'New Message Received',
    message: 'Seller AudioTech India sent a message: "Your warranty card and invoice have been generated."',
    category: 'messages',
    link: '/help',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  }
];

// GET /api/notifications - List all notifications
router.get('/', (req, res) => {
  const { category, unreadOnly } = req.query;
  let filtered = [...notifications];

  if (category && category !== 'all') {
    filtered = filtered.filter(n => n.category === category);
  }

  if (unreadOnly === 'true') {
    filtered = filtered.filter(n => !n.isRead);
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  res.status(200).json({
    success: true,
    unreadCount,
    total: filtered.length,
    notifications: filtered
  });
});

// POST /api/notifications - Create / Trigger a new notification
router.post('/', (req, res) => {
  const { type, title, message, category, link, metadata } = req.body;

  if (!type || !title || !message) {
    return res.status(400).json({
      success: false,
      message: 'type, title, and message are required fields'
    });
  }

  const newNotification = {
    id: `notif-${Date.now()}`,
    type,
    title,
    message,
    category: category || 'system',
    link: link || '/notifications',
    metadata: metadata || {},
    isRead: false,
    createdAt: new Date().toISOString()
  };

  // Add to top of list
  notifications.unshift(newNotification);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    notification: newNotification,
    unreadCount
  });
});

// PATCH /api/notifications/read-all - Mark all as read
router.patch('/read-all', (req, res) => {
  notifications = notifications.map(n => ({ ...n, isRead: true }));

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
    unreadCount: 0
  });
});

// PATCH /api/notifications/:id/read - Mark single notification as read
router.patch('/:id/read', (req, res) => {
  const { id } = req.params;
  const index = notifications.findIndex(n => n.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  notifications[index].isRead = true;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  res.status(200).json({
    success: true,
    notification: notifications[index],
    unreadCount
  });
});

// DELETE /api/notifications/:id - Delete single notification
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const beforeCount = notifications.length;
  notifications = notifications.filter(n => n.id !== id);

  if (notifications.length === beforeCount) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  res.status(200).json({
    success: true,
    message: 'Notification deleted',
    unreadCount
  });
});

// DELETE /api/notifications - Clear all notifications
router.delete('/', (req, res) => {
  notifications = [];
  res.status(200).json({
    success: true,
    message: 'All notifications cleared',
    unreadCount: 0
  });
});

module.exports = router;
