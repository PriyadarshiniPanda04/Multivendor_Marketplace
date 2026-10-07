import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Lock, 
  MapPin, 
  CreditCard, 
  Heart, 
  Store, 
  ShieldCheck, 
  HelpCircle, 
  LogOut,
  UserCheck,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AddressModal from '../components/AddressModal';
import AddressCard from '../components/AddressCard';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, switchRole, addAddress, updateAddress, deleteAddress, setDefaultAddress, isSeller, isAdmin } = useAuth();
  const { addToast } = useToast() || { addToast: () => {} };

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const addresses = user?.addresses || [];

  const handleSaveAddress = (addrData) => {
    if (editingAddress) {
      if (updateAddress) updateAddress(editingAddress.id, addrData);
      if (addToast) addToast('Address updated successfully', 'success');
    } else {
      if (addAddress) addAddress(addrData);
      if (addToast) addToast('New address saved to your account!', 'success');
    }
    setEditingAddress(null);
  };

  const ACCOUNT_CARDS = [
    {
      title: 'Your Orders',
      desc: 'Track, return, or buy items again',
      icon: Package,
      link: '/orders',
      color: 'text-orange-600 bg-orange-50'
    },
    {
      title: 'Your Wishlist',
      desc: 'View saved items, price drop alerts & lists',
      icon: Heart,
      link: '/wishlist',
      color: 'text-rose-600 bg-rose-50'
    },
    {
      title: 'Your Addresses',
      desc: 'Manage delivery addresses and preferences',
      icon: MapPin,
      link: '/account#addresses',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Payment Options',
      desc: 'BazaarHub Pay, saved UPI IDs & credit cards',
      icon: CreditCard,
      link: '/account#payments',
      color: 'text-emerald-600 bg-emerald-50'
    },
    ...(isSeller ? [{
      title: 'Merchant Seller Hub',
      desc: 'Manage your multivendor store, catalog & inventory',
      icon: Store,
      link: '/seller/dashboard',
      color: 'text-amber-600 bg-amber-50',
      highlight: true
    }] : []),
    ...(isAdmin ? [{
      title: 'Platform Admin',
      desc: 'Review sellers, verify users and inspect sales ledger',
      icon: ShieldCheck,
      link: '/admin/dashboard',
      color: 'text-purple-600 bg-purple-50'
    }] : []),
    {
      title: 'Customer Service & Help',
      desc: 'Browse help guides, returns FAQs, or contact support',
      icon: HelpCircle,
      link: '/help',
      color: 'text-slate-600 bg-slate-100'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Your Account
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your profile, security, and marketplace preferences
          </p>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600">
              Role: <strong className="capitalize text-slate-900">{user.role}</strong>
            </span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-3 py-1.5 border border-slate-300 rounded-md text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACCOUNT_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className={`p-4 sm:p-5 rounded-xl border bg-white hover:shadow-md transition-all flex items-start gap-4 group ${
                card.highlight ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Saved Delivery Addresses Section */}
      <div id="addresses" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Delivery Addresses</h2>
              <p className="text-xs text-slate-500">Standardized address book for single-click checkout and dispatch</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingAddress(null);
              setIsAddressModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Address</span>
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p>No addresses saved yet. Click "Add New Address" above to add your first delivery address.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                selectable={false}
                showActions={true}
                onEdit={(a) => {
                  setEditingAddress(a);
                  setIsAddressModalOpen(true);
                }}
                onDelete={deleteAddress}
                onSetDefault={setDefaultAddress}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Switch Role bar for pairs and testing */}
      <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-slate-600 font-medium">
          Quick Demo Role Switcher:
        </span>
        <div className="flex gap-2">
          {['customer', 'seller', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-3 py-1.5 rounded font-bold capitalize transition-colors ${
                user?.role === r
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Address Form Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        initialData={editingAddress}
        onSave={handleSaveAddress}
      />

    </div>
  );
}
