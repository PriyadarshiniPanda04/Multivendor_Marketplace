import React, { useState, useEffect } from 'react';
import { QrCode, ShieldCheck, Lock, AlertCircle, CheckCircle2, Sparkles, Smartphone, Landmark, Wallet } from 'lucide-react';
import {
  loadRazorpayScript,
  getRazorpayConfig,
  createRazorpayOrder,
  verifyRazorpayPayment
} from '../services/paymentService';

export default function RazorpayPaymentSection({
  amount,
  customerName,
  customerEmail,
  customerPhone = '+91 98765 43210',
  onPaymentSuccess,
  isProcessingParent
}) {
  const [config, setConfig] = useState({ isConfigured: false, keyId: '' });
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        await loadRazorpayScript();
        const data = await getRazorpayConfig();
        if (isMounted) {
          setConfig(data);
        }
      } catch (err) {
        console.error('Failed to initialize Razorpay config:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePay = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Create order on backend
      const orderData = await createRazorpayOrder({
        amount,
        currency: 'INR'
      });

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create Razorpay order');
      }

      // If running in test simulation mode (credentials pending)
      if (orderData.isMock || !config.isConfigured) {
        setTimeout(() => {
          setIsProcessing(false);
          const mockPaymentId = 'pay_rzp_mock_' + Math.floor(100000 + Math.random() * 900000);
          onPaymentSuccess({
            id: mockPaymentId,
            orderId: orderData.order?.id || `order_mock_${Date.now()}`,
            paymentMethod: 'RAZORPAY (Test Mode)'
          });
        }, 800);
        return;
      }

      // 2. Open official Razorpay Checkout modal
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const options = {
        key: config.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'BazaarHub Marketplace',
        description: 'Multi-Vendor Marketplace Checkout',
        image: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
        order_id: orderData.order.id,
        prefill: {
          name: customerName || 'Rahul Verma',
          email: customerEmail || 'customer@example.com',
          contact: customerPhone || '+919876543210'
        },
        theme: {
          color: '#4f46e5'
        },
        handler: async function (response) {
          try {
            // 3. Verify signature on backend
            const verifyRes = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.verified) {
              onPaymentSuccess({
                id: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                paymentMethod: 'RAZORPAY'
              });
            } else {
              setErrorMessage('Payment verification signature mismatch.');
            }
          } catch (err) {
            setErrorMessage(err.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        setErrorMessage(response.error.description || 'Payment failed');
        setIsProcessing(false);
      });
      razorpayInstance.open();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to initialize Razorpay payment');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-center gap-2 text-xs text-slate-500">
        <span className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
        <span>Loading Razorpay Checkout Gateway...</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50/40 via-slate-50 to-white p-4 sm:p-5 rounded-2xl border border-indigo-200/80 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-indigo-100">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-900">Razorpay All-in-One Checkout</span>
        </div>
        {config.isConfigured ? (
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Connected
          </span>
        ) : (
          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Ready to Connect
          </span>
        )}
      </div>

      {/* Badges of supported payment modes in Razorpay */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col items-center gap-1">
          <Smartphone className="w-4 h-4 text-indigo-600" />
          <span className="text-[11px] font-bold text-slate-800">UPI Instant</span>
          <span className="text-[9px] text-slate-400">GPay, PhonePe, Paytm</span>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col items-center gap-1">
          <Landmark className="w-4 h-4 text-emerald-600" />
          <span className="text-[11px] font-bold text-slate-800">Net Banking</span>
          <span className="text-[9px] text-slate-400">50+ Indian Banks</span>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col items-center gap-1">
          <Wallet className="w-4 h-4 text-amber-600" />
          <span className="text-[11px] font-bold text-slate-800">Wallets & Cards</span>
          <span className="text-[9px] text-slate-400">Cred, Mobikwik, RuPay</span>
        </div>
      </div>

      {/* Onboarding info card if placeholder keys */}
      {!config.isConfigured && (
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
          <div className="flex items-start gap-2 text-slate-700">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Razorpay Integration Active</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                To link your live/test Razorpay merchant account, paste your keys in:
              </p>
              <ul className="text-[11px] text-slate-600 font-mono mt-1 space-y-0.5 list-disc list-inside">
                <li><code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">backend/.env</code> &rarr; <span className="text-slate-500">RAZORPAY_KEY_ID</span> & <span className="text-slate-500">RAZORPAY_KEY_SECRET</span></li>
                <li><code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">frontend/.env</code> &rarr; <span className="text-slate-500">VITE_RAZORPAY_KEY_ID</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Error banner */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Security note */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Razorpay 256-bit Bank Grade Security</span>
        </span>
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>PCI-DSS Level 1</span>
        </span>
      </div>

      {/* Pay with Razorpay CTA */}
      <button
        type="button"
        disabled={isProcessing || isProcessingParent}
        onClick={handlePay}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProcessing || isProcessingParent ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Opening Razorpay Gateway...</span>
          </>
        ) : (
          <>
            <QrCode className="w-4 h-4" />
            <span>
              {config.isConfigured
                ? `Pay ₹${amount.toLocaleString('en-IN')} with Razorpay`
                : `Simulate Razorpay Checkout (₹${amount.toLocaleString('en-IN')})`}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
