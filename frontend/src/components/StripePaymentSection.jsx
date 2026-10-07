import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Lock, ShieldCheck, CreditCard, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { getStripeConfig, createPaymentIntent } from '../services/paymentService';

// CardElement custom styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#0f172a',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '14px',
      '::placeholder': {
        color: '#94a3b8'
      }
    },
    invalid: {
      color: '#e11d48',
      iconColor: '#e11d48'
    }
  },
  hidePostalCode: true
};

/**
 * Inner Form that utilizes useStripe & useElements hooks
 */
function InnerStripeCardForm({
  amount,
  customerName,
  customerEmail,
  onPaymentSuccess,
  onPaymentProcessing,
  isProcessingParent
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolder, setCardHolder] = useState(customerName || 'Rahul Verma');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardChange = (event) => {
    if (event.error) {
      setErrorMessage(event.error.message);
    } else {
      setErrorMessage(null);
    }
  };

  const handlePay = async (e) => {
    e?.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsProcessing(true);
    if (onPaymentProcessing) onPaymentProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Create PaymentIntent on Backend
      const intentData = await createPaymentIntent({
        amount,
        currency: 'inr',
        customerName: cardHolder,
        customerEmail
      });

      if (!intentData.success) {
        throw new Error(intentData.message || 'Failed to create payment intent');
      }

      // 2. Confirm Card Payment via Stripe
      const result = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardHolder,
            email: customerEmail || undefined
          }
        }
      });

      if (result.error) {
        setErrorMessage(result.error.message);
        setIsProcessing(false);
        if (onPaymentProcessing) onPaymentProcessing(false);
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setIsProcessing(false);
        if (onPaymentProcessing) onPaymentProcessing(false);
        onPaymentSuccess({
          id: result.paymentIntent.id,
          status: 'succeeded',
          amount: result.paymentIntent.amount / 100,
          currency: result.paymentIntent.currency,
          paymentMethod: 'STRIPE'
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during Stripe payment');
      setIsProcessing(false);
      if (onPaymentProcessing) onPaymentProcessing(false);
    }
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Card Holder Name */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Name on Card
        </label>
        <input
          type="text"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          placeholder="e.g. Rahul Verma"
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-2xs"
          required
        />
      </div>

      {/* Stripe CardElement Container */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Card Information
        </label>
        <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl focus-within:border-indigo-600 focus-within:bg-white transition-all shadow-2xs">
          <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardChange} />
        </div>
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Security info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted with Stripe 256-bit SSL</span>
        </span>
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>PCI-DSS Compliant</span>
        </span>
      </div>

      {/* Submit Pay Button */}
      <button
        type="button"
        disabled={!stripe || isProcessing || isProcessingParent}
        onClick={handlePay}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
      >
        {isProcessing || isProcessingParent ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Authorizing Payment via Stripe...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Pay ₹{amount.toLocaleString('en-IN')} with Stripe</span>
          </>
        )}
      </button>
    </div>
  );
}

/**
 * Main Stripe Payment Section Component
 */
export default function StripePaymentSection({
  amount,
  customerName,
  customerEmail,
  onPaymentSuccess,
  isProcessingParent
}) {
  const [stripePromise, setStripePromise] = useState(null);
  const [config, setConfig] = useState({ isConfigured: false, publishableKey: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initStripe = async () => {
      try {
        const data = await getStripeConfig();
        if (isMounted) {
          setConfig(data);
          if (data.isConfigured && data.publishableKey) {
            setStripePromise(loadStripe(data.publishableKey));
          }
        }
      } catch (err) {
        console.error('Failed to load Stripe config:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initStripe();
    return () => {
      isMounted = false;
    };
  }, []);

  // Simulation handler when in test/placeholder mode
  const handleSimulatePayment = () => {
    const mockId = 'pi_test_' + Math.floor(100000 + Math.random() * 900000);
    onPaymentSuccess({
      id: mockId,
      status: 'succeeded',
      amount,
      currency: 'inr',
      paymentMethod: 'STRIPE (Test Mode)'
    });
  };

  if (loading) {
    return (
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-center gap-2 text-xs text-slate-500">
        <span className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
        <span>Connecting to Stripe secure gateway...</span>
      </div>
    );
  }

  // If live/test Stripe key is configured, load real Stripe Elements
  if (config.isConfigured && stripePromise) {
    return (
      <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-indigo-100 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-900">Stripe Secure Card Element</span>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Connected
          </span>
        </div>

        <Elements stripe={stripePromise}>
          <InnerStripeCardForm
            amount={amount}
            customerName={customerName}
            customerEmail={customerEmail}
            onPaymentSuccess={onPaymentSuccess}
            isProcessingParent={isProcessingParent}
          />
        </Elements>
      </div>
    );
  }

  // If Stripe keys are still placeholders, render friendly onboarding preview & test simulator
  return (
    <div className="bg-gradient-to-br from-indigo-50/50 via-slate-50 to-white p-4 sm:p-5 rounded-2xl border border-indigo-200/80 shadow-2xs space-y-3.5">
      <div className="flex items-center justify-between pb-2.5 border-b border-indigo-100">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-900">Stripe Card Gateway</span>
        </div>
        <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Ready to Connect
        </span>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs">
        <div className="flex items-start gap-2 text-slate-700">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800">Stripe Integration Ready</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              To process live transactions with your Stripe dashboard, paste your keys in:
            </p>
            <ul className="text-[11px] text-slate-600 font-mono mt-1 space-y-0.5 list-disc list-inside">
              <li><code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">backend/.env</code> &rarr; <span className="text-slate-500">STRIPE_SECRET_KEY</span></li>
              <li><code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">frontend/.env</code> &rarr; <span className="text-slate-500">VITE_STRIPE_PUBLISHABLE_KEY</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Simulated Card Preview */}
      <div className="space-y-3 pt-1">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value="•••• •••• •••• 4242  (Stripe Test Visa)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 shadow-2xs"
            />
            <span className="absolute right-3 top-2.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
              TEST CARD
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Expires
            </label>
            <input
              type="text"
              readOnly
              value="12 / 28"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              CVC
            </label>
            <input
              type="text"
              readOnly
              value="•••"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600"
            />
          </div>
        </div>

        {/* Instant test payment button */}
        <button
          type="button"
          disabled={isProcessingParent}
          onClick={handleSimulatePayment}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isProcessingParent ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Confirming with Stripe...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Simulate Stripe Checkout (₹{amount.toLocaleString('en-IN')})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
