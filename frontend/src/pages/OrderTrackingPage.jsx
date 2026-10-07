import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  ArrowLeft, 
  Download, 
  HelpCircle,
  Clock,
  RotateCcw,
  Search,
  ShieldCheck,
  CreditCard,
  Check,
  ChevronRight,
  FileText
} from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import LiveLocationTracker from '../components/LiveLocationTracker';
import { returnService, RETURN_STEPS } from '../services/returnService';
import ReturnRequestModal from '../components/ReturnRequestModal';
import ReturnTrackingModal from '../components/ReturnTrackingModal';
import TaxInvoiceModal from '../components/TaxInvoiceModal';

export default function OrderTrackingPage() {
  const { id } = useParams();

  // Retrieve saved order or fallback
  let orderData = null;
  try {
    const saved = JSON.parse(localStorage.getItem('bazaarhub_orders') || '[]');
    orderData = saved.find((o) => o.id === id);
  } catch (err) {
    console.error(err);
  }

  if (!orderData) {
    orderData = {
      id: id || 'ORD-894120',
      date: '1 October 2026',
      items: [
        { product: PRODUCTS[0], quantity: 1 },
        { product: PRODUCTS[5], quantity: 1 }
      ],
      total: PRODUCTS[0].price + PRODUCTS[5].price,
      paymentMethod: 'UPI',
      address: {
        name: 'Rahul Verma',
        street: 'Flat 402, Lotus Residency, 12th Main Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        phone: '+91 98765 43210'
      },
      status: 'Delivered'
    };
  }

  const [orderReturns, setOrderReturns] = useState([]);
  const [requestModalProduct, setRequestModalProduct] = useState(null);
  const [trackingModalItem, setTrackingModalItem] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const refreshReturns = () => {
    const all = returnService.getReturnsByOrder(orderData.id);
    setOrderReturns(all);
  };

  useEffect(() => {
    refreshReturns();
    const handleUpdate = () => refreshReturns();
    window.addEventListener('bazaarhub_return_updated', handleUpdate);
    return () => window.removeEventListener('bazaarhub_return_updated', handleUpdate);
  }, [orderData.id]);

  const TIMELINE_STEPS = [
    { title: 'Order Placed', time: '1 Oct, 10:15 AM', completed: true },
    { title: 'Order Confirmed', time: '1 Oct, 10:30 AM', completed: true },
    { title: 'Packed & In Transit', time: '1 Oct, 02:45 PM', completed: true },
    { title: 'Shipped from Hub', time: '1 Oct, 06:10 PM', completed: true },
    { title: 'Out for Delivery', time: '1 Oct, 08:30 PM', completed: true },
    { title: 'Delivered', time: '2 Oct, 11:15 AM', completed: true }
  ];

  const getStepIcon = (key, isCompleted) => {
    if (isCompleted) return <Check className="w-3.5 h-3.5 text-white" />;
    switch (key) {
      case 'requested': return <RotateCcw className="w-3.5 h-3.5" />;
      case 'seller_review': return <Search className="w-3.5 h-3.5" />;
      case 'approved': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'pickup': return <Truck className="w-3.5 h-3.5" />;
      case 'refunded': return <CreditCard className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Your Orders
        </Link>
        <button
          onClick={() => setIsInvoiceOpen(true)}
          className="text-xs font-semibold text-slate-800 hover:text-indigo-600 border border-slate-300 hover:border-indigo-400 rounded-lg px-3.5 py-1.5 bg-white flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          <span>Download Tax Invoice</span>
        </button>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-6">
        
        {/* Header with Order ID & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {orderData.status || 'Delivered'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Order {orderData.id}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {orderData.date} • Paid via {orderData.paymentMethod}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Amount</span>
            <span className="text-2xl font-black text-slate-950">
              ₹{orderData.total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Amazon-style Step Timeline */}
        <div className="py-2">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
            Delivery Shipment Progress
          </h2>

          <div className="relative">
            {/* Horizontal Timeline (Desktop) */}
            <div className="hidden sm:grid sm:grid-cols-6 gap-2 text-center relative z-10">
              {TIMELINE_STEPS.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all shadow-xs ${
                      step.completed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {step.title}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    {step.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Connecting Bar */}
            <div className="hidden sm:block absolute top-4 left-10 right-10 h-1 bg-slate-200 -z-0">
              <div className="bg-emerald-600 h-full w-full" />
            </div>

            {/* Vertical Timeline (Mobile) */}
            <div className="sm:hidden space-y-4 pl-4 border-l-2 border-emerald-500">
              {TIMELINE_STEPS.map((step, idx) => (
                <div key={idx} className="relative pl-3">
                  <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-slate-500">{step.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIVE RETURN & REFUND PIPELINE CARD (If return exists) */}
        {orderReturns.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 rounded-2xl border-2 border-orange-200 p-5 space-y-4 shadow-sm">
            {orderReturns.map((ret) => {
              const currentStepKey = ret.status || 'requested';
              const stepKeys = RETURN_STEPS.map((s) => s.key);
              const currentStepIndex = Math.max(0, stepKeys.indexOf(currentStepKey));

              return (
                <div key={ret.id} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-orange-100 gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-sm text-slate-900">
                            Return & Refund in Progress ({ret.id})
                          </h3>
                          <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Reason: {ret.reason}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Item: <strong className="text-slate-800">{ret.product?.name}</strong> • Refund: <strong className="text-emerald-700">₹{ret.refundAmount?.toLocaleString('en-IN')}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setTrackingModalItem(ret)}
                      className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <span>Interactive 5-Step Tracker</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 5-Step Stepper Display */}
                  <div className="relative pt-1 pb-1">
                    <div className="grid grid-cols-5 gap-1.5 text-center relative z-10">
                      {RETURN_STEPS.map((step, idx) => {
                        const isCompleted = idx < currentStepIndex || (idx === currentStepIndex && currentStepKey === 'refunded');
                        const isActive = idx === currentStepIndex && currentStepKey !== 'refunded';

                        return (
                          <div key={step.key} className="flex flex-col items-center">
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs mb-1.5 transition-all shadow-2xs ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : isActive
                                  ? 'bg-orange-500 text-white ring-4 ring-orange-200 animate-pulse'
                                  : 'bg-slate-100 border border-slate-200 text-slate-400'
                              }`}
                            >
                              {getStepIcon(step.key, isCompleted)}
                            </div>
                            <span className={`text-[10px] sm:text-[11px] font-bold leading-tight ${
                              isCompleted ? 'text-emerald-700' : isActive ? 'text-orange-600 font-extrabold' : 'text-slate-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Connecting Bar */}
                    <div className="absolute top-4.5 sm:top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-500"
                        style={{ width: `${(currentStepIndex / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="bg-white/90 border border-orange-200/80 rounded-xl p-3 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                      <span className="text-slate-700">
                        Current Milestone: <strong>{RETURN_STEPS[currentStepIndex]?.label}</strong> — {RETURN_STEPS[currentStepIndex]?.description}
                      </span>
                    </div>
                    {ret.status === 'refunded' ? (
                      <span className="text-emerald-700 font-extrabold text-xs shrink-0">
                        ✓ Refund Credited
                      </span>
                    ) : (
                      <button
                        onClick={() => returnService.advanceNextStep(ret.id)}
                        className="text-blue-600 hover:underline font-bold text-[11px] shrink-0 cursor-pointer"
                        title="Simulate workflow progression"
                      >
                        Advance Step (Demo) →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Live Courier GPS Tracking Map */}
        <LiveLocationTracker 
          destinationAddress={orderData.address} 
          courierName="BazaarHub Express Logistics" 
        />

        {/* Shipment Details: Destination & Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-500" /> Delivery Address
            </span>
            <p className="font-bold text-slate-800">{orderData.address.name}</p>
            <p className="text-slate-600">{orderData.address.street}</p>
            <p className="text-slate-600">
              {orderData.address.city}, {orderData.address.state} - {orderData.address.pincode}
            </p>
            <p className="text-slate-500">Phone: {orderData.address.phone}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" /> Courier & Fulfillment
            </span>
            <p className="text-slate-700">Courier: <strong>BazaarHub Express Logistics</strong></p>
            <p className="text-slate-700">Tracking AWB: <strong className="font-mono text-slate-900">BZH-IN-9874102</strong></p>
            <p className="text-slate-700">Payment: <strong>{orderData.paymentMethod} (Completed)</strong></p>
            <p className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 7-Day Hassle-Free Returns Guaranteed
            </p>
          </div>

        </div>

        {/* Items in this Order */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-3">
            Items in this Shipment ({orderData.items.length})
          </h3>

          <div className="divide-y divide-slate-100">
            {orderData.items.map(({ product, quantity }) => {
              const existingReturn = orderReturns.find(
                (r) => r.product?.id === product.id || r.product?.name === product.name
              );

              return (
                <div key={product.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      className="w-14 h-14 object-contain rounded border border-slate-200 p-1 shrink-0"
                    />
                    <div>
                      <Link
                        to={`/product/${product.id}`}
                        className="font-bold text-slate-900 hover:text-orange-600 line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <span className="text-slate-500 block">
                        Qty: {quantity} • Sold by {product.sellerName || 'TechWorld Store'}
                      </span>
                      {existingReturn ? (
                        <span className="inline-block mt-1 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                          Return Status: {existingReturn.status.replace('_', ' ').toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Eligible for return within 7 days of delivery
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <span className="font-bold text-slate-950 text-sm">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>

                    {existingReturn ? (
                      <button
                        onClick={() => setTrackingModalItem(existingReturn)}
                        className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Track Return</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setRequestModalProduct(product)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                        <span>Request Return</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Return Request Modal */}
      {requestModalProduct && (
        <ReturnRequestModal
          isOpen={!!requestModalProduct}
          onClose={() => setRequestModalProduct(null)}
          orderId={orderData.id}
          product={requestModalProduct}
          onReturnSubmitted={(newReturn) => {
            refreshReturns();
            setTrackingModalItem(newReturn);
          }}
        />
      )}

      {/* Return Tracking Modal */}
      {trackingModalItem && (
        <ReturnTrackingModal
          isOpen={!!trackingModalItem}
          onClose={() => setTrackingModalItem(null)}
          returnItem={trackingModalItem}
          onStatusUpdated={() => refreshReturns()}
        />
      )}

      {/* Official GST Tax Invoice Modal */}
      <TaxInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={orderData}
      />

    </div>
  );
}
