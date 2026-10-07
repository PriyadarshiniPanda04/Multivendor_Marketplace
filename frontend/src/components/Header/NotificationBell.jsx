import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Package, 
  Truck, 
  CheckCircle2, 
  Tag, 
  TrendingDown, 
  Zap, 
  ShieldCheck, 
  MessageSquare, 
  CheckCheck, 
  Trash2, 
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showSimulator, setShowSimulator] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { 
    notifications, 
    unreadCount, 
    soundEnabled, 
    toggleSound, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    simulateNotification
  } = useNotifications();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowSimulator(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format relative timestamp
  const formatTime = (isoString) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // Helper for notification icons and styling based on type
  const getNotificationVisuals = (type) => {
    switch (type) {
      case 'order_placed':
        return {
          icon: Package,
          bgColor: 'bg-blue-50 text-blue-600 border-blue-200',
          badgeText: 'Order Placed',
          badgeColor: 'bg-blue-100 text-blue-700'
        };
      case 'order_shipped':
        return {
          icon: Truck,
          bgColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
          badgeText: 'Order Shipped',
          badgeColor: 'bg-indigo-100 text-indigo-700'
        };
      case 'order_delivered':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
          badgeText: 'Delivered',
          badgeColor: 'bg-emerald-100 text-emerald-700'
        };
      case 'coupon_available':
        return {
          icon: Tag,
          bgColor: 'bg-purple-50 text-purple-600 border-purple-200',
          badgeText: 'Coupon',
          badgeColor: 'bg-purple-100 text-purple-700'
        };
      case 'price_dropped':
        return {
          icon: TrendingDown,
          bgColor: 'bg-rose-50 text-rose-600 border-rose-200',
          badgeText: 'Price Drop',
          badgeColor: 'bg-rose-100 text-rose-700'
        };
      case 'back_in_stock':
        return {
          icon: Zap,
          bgColor: 'bg-amber-50 text-amber-600 border-amber-200',
          badgeText: 'Back in Stock',
          badgeColor: 'bg-amber-100 text-amber-700'
        };
      case 'seller_approval':
        return {
          icon: ShieldCheck,
          bgColor: 'bg-teal-50 text-teal-600 border-teal-200',
          badgeText: 'Seller Approved',
          badgeColor: 'bg-teal-100 text-teal-700'
        };
      case 'new_message':
        return {
          icon: MessageSquare,
          bgColor: 'bg-sky-50 text-sky-600 border-sky-200',
          badgeText: 'Message',
          badgeColor: 'bg-sky-100 text-sky-700'
        };
      default:
        return {
          icon: Bell,
          bgColor: 'bg-slate-50 text-slate-600 border-slate-200',
          badgeText: 'Notification',
          badgeColor: 'bg-slate-100 text-slate-700'
        };
    }
  };

  // Filter list by selected tab
  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'unread') return !item.isRead;
    if (activeTab === 'orders') return item.category === 'orders' || item.type.startsWith('order_');
    if (activeTab === 'offers') return item.category === 'offers' || item.category === 'stock' || item.type === 'coupon_available' || item.type === 'price_dropped' || item.type === 'back_in_stock';
    if (activeTab === 'messages') return item.category === 'messages' || item.category === 'seller' || item.type === 'new_message' || item.type === 'seller_approval';
    return true;
  });

  const handleNotificationClick = (item) => {
    markAsRead(item.id);
    setIsOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      
      {/* Notification Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className="flex items-center gap-1.5 text-slate-800 hover:text-blue-600 text-xs font-semibold cursor-pointer relative group transition-colors p-1 rounded-full hover:bg-slate-100"
      >
        <div className="relative">
          <Bell className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
          
          {unreadCount > 0 && (
            <>
              {/* Pulsing indicator circle */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></span>
              {/* Badge number */}
              <span className="absolute -top-1.5 -right-1.5 bg-[#ef4444] text-white font-extrabold text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center border border-white shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </>
          )}
        </div>
        <span className="hidden lg:inline text-xs font-semibold">Alerts</span>
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 sm:-right-8 top-full mt-2 w-[340px] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
              {unreadCount > 0 ? (
                <span className="bg-red-50 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-200">
                  {unreadCount} new
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-full">
                  All caught up
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Audio Chime */}
              <button
                onClick={toggleSound}
                title={soundEnabled ? "Mute notification sounds" : "Unmute notification sounds"}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Mark all as read */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark read</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 bg-white overflow-x-auto no-scrollbar text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'orders', label: 'Orders' },
              { id: 'offers', label: 'Offers & Stock' },
              { id: 'messages', label: 'Messages' },
              { id: 'unread', label: `Unread (${unreadCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer text-[11px] ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Test Simulator Drawer Toggle Bar */}
          <div className="px-3.5 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-700 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Simulate notification:</span>
            </span>
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
            >
              {showSimulator ? 'Hide test list' : 'Test examples'}
            </button>
          </div>

          {/* Simulator Chips (all 8 requested examples) */}
          {showSimulator && (
            <div className="p-2.5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-1.5 text-[10px]">
              {[
                { key: 'order_placed', label: '📦 Order placed' },
                { key: 'order_shipped', label: '🚚 Order shipped' },
                { key: 'order_delivered', label: '✅ Order delivered' },
                { key: 'coupon_available', label: '🎟️ Coupon available' },
                { key: 'price_dropped', label: '📉 Price dropped' },
                { key: 'back_in_stock', label: '⚡ Back in stock' },
                { key: 'seller_approval', label: '🛡️ Seller approval' },
                { key: 'new_message', label: '💬 New message' }
              ].map(sim => (
                <button
                  key={sim.key}
                  onClick={() => simulateNotification(sim.key)}
                  className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-800 font-medium text-left truncate transition-colors cursor-pointer shadow-2xs active:scale-95"
                >
                  {sim.label}
                </button>
              ))}
            </div>
          )}

          {/* Notification Items List */}
          <div className="overflow-y-auto divide-y divide-slate-100 flex-1 max-h-[380px]">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 stroke-[1.5]" />
                </div>
                <p className="text-xs font-bold text-slate-700">No notifications here</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[220px] mx-auto">
                  You have no notifications under this filter at the moment.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const visuals = getNotificationVisuals(item.type);
                const IconComponent = visuals.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3 sm:p-3.5 flex items-start gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer group relative ${
                      !item.isRead ? 'bg-blue-50/30' : 'bg-white'
                    }`}
                  >
                    {/* Visual Icon Badge */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${visuals.bgColor}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${visuals.badgeColor}`}>
                          {visuals.badgeText}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatTime(item.createdAt)}
                        </span>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                        )}
                      </div>

                      <h4 className={`text-xs font-bold truncate ${!item.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {item.message}
                      </p>
                    </div>

                    {/* Delete action button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item.id);
                      }}
                      title="Dismiss notification"
                      className="absolute right-2.5 top-3 text-slate-300 hover:text-red-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Navigation */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              <span>Notification Center</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            <span className="text-[11px] text-slate-400">
              {notifications.length} alerts saved
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
