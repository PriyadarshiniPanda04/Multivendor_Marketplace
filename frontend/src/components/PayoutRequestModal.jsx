import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Banknote
} from 'lucide-react';
import { commissionService } from '../services/commissionService';
import { useToast } from '../context/ToastContext';

export default function PayoutRequestModal({
  isOpen,
  onClose,
  sellerId = 's-1',
  sellerName = 'TechWorld Store',
  availableBalance = 0,
  onPayoutSuccess
}) {
  const { addToast } = useToast();

  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank_transfer'); // 'bank_transfer' | 'upi'
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('50100481920481');
  const [accountHolder, setAccountHolder] = useState('TechWorld Retail Pvt Ltd');
  const [ifsc, setIfsc] = useState('HDFC0001824');
  const [upiId, setUpiId] = useState('techworld@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleQuickAmount = (amt) => {
    setPayoutAmount(Math.min(amt, availableBalance).toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNum = Number(payoutAmount);

    if (!amountNum || amountNum <= 0) {
      addToast('Please enter a valid payout amount.', 'error');
      return;
    }

    if (amountNum > availableBalance) {
      addToast(`Requested amount exceeds available balance of ₹${availableBalance.toLocaleString('en-IN')}`, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const destinationAccount = payoutMethod === 'bank_transfer' ? {
        bankName,
        accountHolder,
        accountNumber,
        ifsc
      } : {
        upiId
      };

      const newPayout = commissionService.requestPayout({
        sellerId,
        sellerName,
        amount: amountNum,
        method: payoutMethod,
        destinationAccount
      });

      addToast(`Payout request for ₹${amountNum.toLocaleString('en-IN')} submitted successfully!`, 'success');
      if (onPayoutSuccess) onPayoutSuccess(newPayout);
      onClose();
    } catch (err) {
      console.error(err);
      addToast('Failed to submit payout request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#131921] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Withdraw Net Earnings</h2>
              <p className="text-[11px] text-slate-400">Direct settlement to merchant bank or UPI</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-slate-700">
          
          {/* Available Balance Box */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-500 block">Available for Payout</span>
              <span className="text-2xl font-black text-slate-950">
                ₹{availableBalance.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
              Ready to Disburse
            </span>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-900 text-xs">
              Payout Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                ₹
              </span>
              <input
                type="number"
                min="100"
                max={availableBalance}
                required
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Enter withdrawal amount..."
                className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 font-bold text-slate-900 text-sm"
              />
            </div>

            {/* Quick chips */}
            <div className="flex gap-2 pt-1 flex-wrap">
              {[25000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAmount(amt)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleQuickAmount(availableBalance)}
                className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
              >
                Max Balance
              </button>
            </div>
          </div>

          {/* Payout Method Selection */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-900 text-xs">
              Disbursement Channel
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                payoutMethod === 'bank_transfer'
                  ? 'border-emerald-600 bg-emerald-50/50 font-bold text-slate-900 ring-1 ring-emerald-500'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}>
                <input
                  type="radio"
                  name="payoutMethod"
                  value="bank_transfer"
                  checked={payoutMethod === 'bank_transfer'}
                  onChange={() => setPayoutMethod('bank_transfer')}
                  className="hidden"
                />
                <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs">Bank Transfer (NEFT/IMPS)</span>
              </label>

              <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                payoutMethod === 'upi'
                  ? 'border-emerald-600 bg-emerald-50/50 font-bold text-slate-900 ring-1 ring-emerald-500'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}>
                <input
                  type="radio"
                  name="payoutMethod"
                  value="upi"
                  checked={payoutMethod === 'upi'}
                  onChange={() => setPayoutMethod('upi')}
                  className="hidden"
                />
                <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs">Instant UPI Payout</span>
              </label>
            </div>
          </div>

          {/* Destination Form Fields */}
          {payoutMethod === 'bank_transfer' ? (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <span className="font-bold text-slate-900 text-[11px] block">Verified Beneficiary Account</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="text-slate-500 block text-[10px]">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px]">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-slate-900 font-semibold uppercase"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-slate-500 block text-[10px]">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-slate-900 font-semibold font-mono"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-[11px] block">Verified Merchant UPI ID</span>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="merchant@upi"
                className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-semibold font-mono text-xs"
              />
              <span className="text-[10px] text-slate-500 block">Funds will be disbursed instantly via NPCI UPI network.</span>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/80">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Platform take-rate commission has already been settled from gross sales.</span>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || availableBalance <= 0}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Banknote className="w-4 h-4" />
              <span>{isSubmitting ? 'Processing...' : 'Confirm Withdrawal'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
