import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Lock, 
  QrCode, 
  Banknote,
  Building,
  ArrowRight,
  Plus,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import StripePaymentSection from '../components/StripePaymentSection';
import RazorpayPaymentSection from '../components/RazorpayPaymentSection';
import AddressModal from '../components/AddressModal';
import AddressCard from '../components/AddressCard';
import CouponSection from '../components/CouponSection';
import { sendOrderConfirmationEmailAPI } from '../services/paymentService';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { 
    items, 
    subtotal, 
    totalSavings, 
    deliveryFee, 
    appliedCoupon, 
    couponDiscount, 
    finalTotal, 
    clearCart 
  } = useCart();
  const { user, deliveryLocation, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { addToast } = useToast();
  const { addNotification } = useNotifications();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'card' | 'cod'
  const [isPlacing, setIsPlacing] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Address list
  const addresses = (user?.addresses && user.addresses.length > 0) ? user.addresses : [
    {
      id: 'addr-default-1',
      name: user?.name || 'Rahul Verma',
      phone: '+91 98765 43210',
      flat: 'Flat 402, Lotus Residency',
      area: '12th Main Road, Indiranagar',
      landmark: 'Opposite BDA Complex',
      city: deliveryLocation?.city || 'Bengaluru',
      state: 'Karnataka',
      pincode: deliveryLocation?.pincode || '560038',
      type: 'Home',
      isDefault: true
    }
  ];

  const handleSaveAddress = (addrData) => {
    if (editingAddress) {
      if (updateAddress) updateAddress(editingAddress.id, addrData);
      addToast('Address updated successfully', 'success');
    } else {
      if (addAddress) {
        addAddress(addrData);
        setSelectedAddressIndex(0);
      }
      addToast('New delivery address added and selected!', 'success');
    }
    setEditingAddress(null);
  };

  const handleRazorpaySuccess = (paymentResult) => {
    setIsPlacing(true);
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...items],
      total: finalTotal,
      coupon: appliedCoupon ? { code: appliedCoupon.code, discount: couponDiscount } : null,
      paymentMethod: paymentResult.paymentMethod || 'RAZORPAY',
      paymentId: paymentResult.id,
      address: addresses[selectedAddressIndex],
      status: 'Paid & Confirmed'
    };

    try {
      const existing = JSON.parse(localStorage.getItem('bazaarhub_orders') || '[]');
      localStorage.setItem('bazaarhub_orders', JSON.stringify([newOrder, ...existing]));
    } catch (err) {
      console.error(err);
    }

    // Trigger automated order confirmation email
    sendOrderConfirmationEmailAPI({
      order: newOrder,
      customerEmail: user?.email || 'customer@example.com',
      customerName: addresses[selectedAddressIndex]?.name || user?.name
    });

    addNotification({
      type: 'order_placed',
      title: 'Order Placed Successfully',
      message: `Razorpay Order #${orderId} for ₹${finalTotal.toLocaleString('en-IN')} has been placed. We are preparing it for dispatch!`,
      category: 'orders',
      link: `/orders/${orderId}`
    });

    clearCart();
    setIsPlacing(false);
    addToast(`Razorpay Payment of ₹${finalTotal.toLocaleString('en-IN')} Received! Confirmation email sent.`, 'success');
    navigate(`/orders/${orderId}`);
  };

  const handleStripeSuccess = (paymentResult) => {
    setIsPlacing(true);
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...items],
      total: finalTotal,
      coupon: appliedCoupon ? { code: appliedCoupon.code, discount: couponDiscount } : null,
      paymentMethod: paymentResult.paymentMethod || 'STRIPE',
      paymentId: paymentResult.id,
      address: addresses[selectedAddressIndex],
      status: 'Paid & Confirmed'
    };

    try {
      const existing = JSON.parse(localStorage.getItem('bazaarhub_orders') || '[]');
      localStorage.setItem('bazaarhub_orders', JSON.stringify([newOrder, ...existing]));
    } catch (err) {
      console.error(err);
    }

    // Trigger automated order confirmation email
    sendOrderConfirmationEmailAPI({
      order: newOrder,
      customerEmail: user?.email || 'customer@example.com',
      customerName: addresses[selectedAddressIndex]?.name || user?.name
    });

    addNotification({
      type: 'order_placed',
      title: 'Order Placed Successfully',
      message: `Stripe Order #${orderId} for ₹${finalTotal.toLocaleString('en-IN')} is authorized. Preparing for dispatch!`,
      category: 'orders',
      link: `/orders/${orderId}`
    });

    clearCart();
    setIsPlacing(false);
    addToast(`Stripe Payment of ₹${finalTotal.toLocaleString('en-IN')} Authorized! Confirmation email sent.`, 'success');
    navigate(`/orders/${orderId}`);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      addToast('Your bag is empty!', 'error');
      navigate('/cart');
      return;
    }

    setIsPlacing(true);

    setTimeout(() => {
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      
      // Save order in localStorage for orders page
      const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [...items],
        total: finalTotal,
        coupon: appliedCoupon ? { code: appliedCoupon.code, discount: couponDiscount } : null,
        paymentMethod: paymentMethod.toUpperCase(),
        address: addresses[selectedAddressIndex],
        status: 'Confirmed'
      };

      try {
        const existing = JSON.parse(localStorage.getItem('bazaarhub_orders') || '[]');
        localStorage.setItem('bazaarhub_orders', JSON.stringify([newOrder, ...existing]));
      } catch (err) {
        console.error(err);
      }

      // Trigger automated order confirmation email
      sendOrderConfirmationEmailAPI({
        order: newOrder,
        customerEmail: user?.email || 'customer@example.com',
        customerName: addresses[selectedAddressIndex]?.name || user?.name
      });

      addNotification({
        type: 'order_placed',
        title: 'Order Placed Successfully',
        message: `Order #${orderId} for ₹${finalTotal.toLocaleString('en-IN')} has been placed. We are preparing it for dispatch!`,
        category: 'orders',
        link: `/orders/${orderId}`
      });

      clearCart();
      setIsPlacing(false);
      addToast(`Order ${orderId} placed successfully! Confirmation email sent.`, 'success');
      navigate(`/orders/${orderId}`);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Express Checkout
            </h1>
            <p className="text-xs text-slate-500">Fast, encrypted multi-vendor order placement</p>
          </div>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit Escrow Protection</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Steps: 1. Address, 2. Payment, 3. Review Items */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Select Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Delivery Address
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingAddress(null);
                  setIsAddressModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {addresses.map((addr, idx) => (
                <AddressCard
                  key={addr.id || idx}
                  address={addr}
                  isSelected={selectedAddressIndex === idx}
                  onSelect={() => setSelectedAddressIndex(idx)}
                  onEdit={(a) => {
                    setEditingAddress(a);
                    setIsAddressModalOpen(true);
                  }}
                  onDelete={deleteAddress ? (id) => {
                    deleteAddress(id);
                    if (selectedAddressIndex >= addresses.length - 1) {
                      setSelectedAddressIndex(0);
                    }
                  } : null}
                  onSetDefault={setDefaultAddress}
                  selectable={true}
                  showActions={true}
                />
              ))}
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Payment Option
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Option: UPI */}
              {/* Option 1: Razorpay (UPI, Net Banking & Wallets) */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-indigo-600 bg-indigo-50/15 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <label className="flex items-start gap-3.5 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <span className="font-bold text-slate-900 flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-indigo-600" />
                        UPI, Net Banking & Wallets (Razorpay)
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                          Powered by Razorpay
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Instant
                        </span>
                      </div>
                    </div>
                  </div>
                </label>

                {paymentMethod === 'razorpay' && (
                  <div className="mt-3.5 pl-0 sm:pl-7">
                    <RazorpayPaymentSection
                      amount={finalTotal}
                      customerName={addresses[selectedAddressIndex]?.name || user?.name}
                      customerEmail={user?.email}
                      customerPhone={addresses[selectedAddressIndex]?.phone}
                      onPaymentSuccess={handleRazorpaySuccess}
                      isProcessingParent={isPlacing}
                    />
                  </div>
                )}
              </div>

              {/* Option 2: Credit / Debit Card (Stripe) */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  paymentMethod === 'card'
                    ? 'border-indigo-600 bg-indigo-50/15 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <label className="flex items-start gap-3.5 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <span className="font-bold text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                        Credit / Debit Card (Stripe Elements)
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                          Powered by Stripe
                        </span>
                        <span className="text-[10px] text-slate-400">Visa, MC, RuPay, Amex</span>
                      </div>
                    </div>
                  </div>
                </label>

                {paymentMethod === 'card' && (
                  <div className="mt-3.5 pl-0 sm:pl-7">
                    <StripePaymentSection
                      amount={finalTotal}
                      customerName={addresses[selectedAddressIndex]?.name || user?.name}
                      customerEmail={user?.email}
                      onPaymentSuccess={handleStripeSuccess}
                      isProcessingParent={isPlacing}
                    />
                  </div>
                )}
              </div>

              {/* Option: Cash on Delivery */}
              <label
                className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    Cash on Delivery (Pay in cash or UPI at delivery doorstep)
                  </span>
                </div>
              </label>

            </div>
          </div>

          {/* Step 3: Review Items in Order */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Review Items & Shipping
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-contain rounded-xl border border-slate-200 p-1 shrink-0 bg-slate-50"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 line-clamp-1">{product.name}</p>
                      <span className="text-slate-500">Qty: {quantity} • Sold by {product.sellerName}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Order Summary & Place Order Button */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          
          {/* Coupon Widget on Checkout */}
          <CouponSection compact />

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            {paymentMethod === 'card' ? (
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl text-center space-y-1.5">
                <p className="text-xs font-bold text-indigo-950 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  Stripe Payment Selected
                </p>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Use the secure <span className="font-semibold text-indigo-700">Pay with Stripe</span> button in the card form on the left to authorize.
                </p>
              </div>
            ) : paymentMethod === 'razorpay' ? (
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl text-center space-y-1.5">
                <p className="text-xs font-bold text-indigo-950 flex items-center justify-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                  Razorpay Selected
                </p>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Click the <span className="font-semibold text-indigo-700">Pay with Razorpay</span> button on the left to complete via UPI, Net Banking, or Wallets.
                </p>
              </div>
            ) : (
              <button
                disabled={isPlacing || items.length === 0}
                onClick={handlePlaceOrder}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPlacing ? (
                  <span>Securing your order...</span>
                ) : (
                  <span>Confirm Cash on Delivery Order</span>
                )}
              </button>
            )}

            <p className="text-[10px] text-slate-400 text-center leading-tight">
              By confirming, you agree to BazaarHub's Terms of Sale and Escrow Policy.
            </p>

            <div className="border-t border-slate-100 pt-3 space-y-2.5 text-xs text-slate-600">
              <h3 className="font-bold text-slate-900">Order Summary</h3>
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Savings:</span>
                  <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}

              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/80 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon ({appliedCoupon.code}):</span>
                  </span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE Express</span> : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline text-base font-bold text-slate-950">
                <span>Order Total:</span>
                <span className="text-2xl font-black text-slate-950">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 space-y-1 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-700 font-medium">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Estimated Delivery: Tomorrow by 2 PM</span>
              </div>
              <p>Insured courier dispatch with tracking ID generated instantly.</p>
            </div>
          </div>

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
