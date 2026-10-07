import React, { useState } from 'react';
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
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    notifications, 
    unreadCount, 
    soundEnabled, 
    toggleSound, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll,
    resetToDefault,
    simulateNotification
  } = useNotifications();

  const getVisuals = (type) => {
    switch (type) {
      case 'order_placed':
        return {
          icon: Package,
          bg: 'bg-blue-50 text-blue-600 border-blue-200',
          badge: 'bg-blue-100 text-blue-800',
          label: 'Order Placed'
        };
      case 'order_shipped':
        return {
          icon: Truck,
          bg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
          badge: 'bg-indigo-100 text-indigo-800',
          label: 'Order Shipped'
        };
      case 'order_delivered':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-800',
          label: 'Order Delivered'
        };
      case 'coupon_available':
        return {
          icon: Tag,
          bg: 'bg-purple-50 text-purple-600 border-purple-200',
          badge: 'bg-purple-100 text-purple-800',
          label: 'Coupon Available'
        };
      case 'price_dropped':
        return {
          icon: TrendingDown,
          bg: 'bg-rose-50 text-rose-600 border-rose-200',
          badge: 'bg-rose-100 text-rose-800',
          label: 'Price Dropped'
        };
      case 'back_in_stock':
        return {
          icon: Zap,
          bg: 'bg-amber-50 text-amber-600 border-amber-200',
          badge: 'bg-amber-100 text-amber-800',
          label: 'Product Back in Stock'
        };
      case 'seller_approval':
        return {
          icon: ShieldCheck,
          bg: 'bg-teal-50 text-teal-600 border-teal-200',
          badge: 'bg-teal-100 text-teal-800',
          label: 'Seller Approval'
        };
      case 'new_message':
        return {
          icon: MessageSquare,
          bg: 'bg-sky-50 text-sky-600 border-sky-200',
          badge: 'bg-sky-100 text-sky-800',
          label: 'New Message'
        };
      default:
        return {
          icon: Bell,
          bg: 'bg-slate-50 text-slate-600 border-slate-200',
          badge: 'bg-slate-100 text-slate-800',
          label: 'Notification'
        };
    }
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return '';
    }
  };

  // Filtered and searched notifications
  const filtered = notifications.filter(item => {
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'unread' && !item.isRead) ||
      (selectedFilter === 'orders' && (item.category === 'orders' || item.type.startsWith('order_'))) ||
      (selectedFilter === 'offers' && (item.category === 'offers' || item.category === 'stock')) ||
      (selectedFilter === 'messages' && (item.category === 'messages' || item.category === 'seller'));

    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Bell className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Notification Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Stay updated on your orders, special discounts, price drops, and seller messages
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={toggleSound}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Chime Enabled' : 'Chime Muted'}</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
          )}

          <button
            onClick={resetToDefault}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Reset to default sample notifications"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-2 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulator Section: All 8 Features requested */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-purple-50/60 rounded-3xl p-5 sm:p-6 border border-blue-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Interactive Notification Trigger Simulator
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
            Click to test real-time alerts
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Test any of the 8 notification events instantly. You will hear an alert chime and see the notification bell badge update immediately:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { key: 'order_placed', label: 'Order placed', icon: Package, color: 'hover:border-blue-500 hover:bg-blue-50 text-blue-700' },
            { key: 'order_shipped', label: 'Order shipped', icon: Truck, color: 'hover:border-indigo-500 hover:bg-indigo-50 text-indigo-700' },
            { key: 'order_delivered', label: 'Order delivered', icon: CheckCircle2, color: 'hover:border-emerald-500 hover:bg-emerald-50 text-emerald-700' },
            { key: 'coupon_available', label: 'Coupon available', icon: Tag, color: 'hover:border-purple-500 hover:bg-purple-50 text-purple-700' },
            { key: 'price_dropped', label: 'Price dropped', icon: TrendingDown, color: 'hover:border-rose-500 hover:bg-rose-50 text-rose-700' },
            { key: 'back_in_stock', label: 'Product back in stock', icon: Zap, color: 'hover:border-amber-500 hover:bg-amber-50 text-amber-700' },
            { key: 'seller_approval', label: 'Seller approval', icon: ShieldCheck, color: 'hover:border-teal-500 hover:bg-teal-50 text-teal-700' },
            { key: 'new_message', label: 'New message', icon: MessageSquare, color: 'hover:border-sky-500 hover:bg-sky-50 text-sky-700' }
          ].map(btn => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.key}
                onClick={() => simulateNotification(btn.key)}
                className={`p-3 rounded-2xl bg-white border border-slate-200 text-left transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 flex flex-col gap-1.5 ${btn.color}`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-bold text-slate-400">+ Test</span>
                </div>
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {btn.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'all', label: `All (${notifications.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'orders', label: 'Orders' },
            { id: 'offers', label: 'Offers & Stock' },
            { id: 'messages', label: 'Messages & Seller' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                selectedFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No notifications found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You don't have any notifications matching this filter or search query. Try clicking one of the simulator buttons above!
            </p>
          </div>
        ) : (
          filtered.map(item => {
            const visuals = getVisuals(item.type);
            const Icon = visuals.icon;

            return (
              <div
                key={item.id}
                onClick={() => {
                  markAsRead(item.id);
                  if (item.link) navigate(item.link);
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 cursor-pointer group hover:shadow-md ${
                  !item.isRead
                    ? 'bg-white border-blue-300 ring-1 ring-blue-100'
                    : 'bg-white/80 border-slate-200/80 hover:bg-white'
                }`}
              >
                {/* Visual Icon Badge */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${visuals.bg}`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Body Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider ${visuals.badge}`}>
                      {visuals.label}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDate(item.createdAt)}
                    </span>
                    {!item.isRead && (
                      <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        NEW
                      </span>
                    )}
                  </div>

                  <h3 className={`text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors`}>
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  {item.link && (
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">
                      <span>View details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                  {!item.isRead && (
                    <button
                      onClick={() => markAsRead(item.id)}
                      title="Mark as read"
                      className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(item.id)}
                    title="Delete notification"
                    className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
