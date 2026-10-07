import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Search, 
  Check, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { RETURN_STEPS, returnService } from '../services/returnService';
import { useToast } from '../context/ToastContext';

export default function ReturnTrackingModal({
  isOpen,
  onClose,
  returnItem,
  onStatusUpdated
}) {
  const { addToast } = useToast();
  const [isAdvancing, setIsAdvancing] = useState(false);

  if (!isOpen || !returnItem) return null;

  const currentStepKey = returnItem.status || 'requested';
  const stepKeys = RETURN_STEPS.map((s) => s.key);
  const currentStepIndex = Math.max(0, stepKeys.indexOf(currentStepKey));

  const handleSimulateNextStep = async () => {
    setIsAdvancing(true);
    try {
      const updated = await returnService.advanceNextStep(returnItem.id);
      if (updated) {
        addToast(`Return progressed to: ${updated.status.replace('_', ' ').toUpperCase()}!`, 'success');
        if (onStatusUpdated) onStatusUpdated(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdvancing(false);
    }
  };

  const getStepIcon = (key, isCompleted, isActive) => {
    if (isCompleted) return <Check className="w-4 h-4 text-white" />;
    switch (key) {
      case 'requested':
        return <RotateCcw className="w-4 h-4" />;
      case 'seller_review':
        return <Search className="w-4 h-4" />;
      case 'approved':
        return <ShieldCheck className="w-4 h-4" />;
      case 'pickup':
        return <Truck className="w-4 h-4" />;
      case 'refunded':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#131921] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-slate-950 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Return & Refund Tracker</h2>
                <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {returnItem.id || returnItem.returnNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Associated Order: <span className="font-mono text-slate-200">{returnItem.orderId}</span>
              </p>
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
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {/* Product Summary Card */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3.5 min-w-0">
              <img 
                src={returnItem.product?.image || returnItem.product?.images?.[0]} 
                alt={returnItem.product?.name}
                className="w-14 h-14 object-contain rounded-lg bg-white border border-slate-200 p-1 shrink-0" 
              />
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                  {returnItem.product?.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Reason: {returnItem.reason}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Sold by: <strong>{returnItem.product?.sellerName || 'TechWorld Store'}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Refund Amount</span>
              <span className="text-base sm:text-lg font-black text-emerald-600">
                ₹{returnItem.refundAmount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* 5-Step Return Pipeline (Exact User Request) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-orange-500" />
                Return & Refund Lifecycle
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Step {currentStepIndex + 1} of 5
              </span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="relative pt-2 pb-2">
              <div className="grid grid-cols-5 gap-2 relative z-10 text-center">
                {RETURN_STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStepIndex || (idx === currentStepIndex && currentStepKey === 'refunded');
                  const isActive = idx === currentStepIndex && currentStepKey !== 'refunded';

                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all shadow-2xs ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isActive
                            ? 'bg-orange-500 text-white ring-4 ring-orange-100 animate-pulse'
                            : 'bg-slate-100 border border-slate-200 text-slate-400'
                        }`}
                      >
                        {getStepIcon(step.key, isCompleted, isActive)}
                      </div>
                      
                      <span className={`text-[11px] font-bold leading-tight ${
                        isCompleted ? 'text-emerald-700' : isActive ? 'text-orange-600 font-extrabold' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Connecting Background Line */}
              <div className="absolute top-6.5 left-8 right-8 h-1 bg-slate-200 -z-0">
                <div 
                  className="bg-emerald-600 h-full transition-all duration-500"
                  style={{ width: `${(currentStepIndex / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Step Status Card */}
            <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/90 text-xs flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1 shrink-0 animate-ping" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">
                  Current Status: {RETURN_STEPS[currentStepIndex]?.label}
                </span>
                <p className="text-slate-600 mt-0.5 leading-relaxed text-[11px]">
                  {RETURN_STEPS[currentStepIndex]?.description}
                </p>
                {returnItem.status === 'approved' && (
                  <p className="text-emerald-700 font-semibold mt-1">
                    Pickup Scheduled: {returnItem.pickupDate || 'Tomorrow between 10 AM - 2 PM'} (Courier AWB: {returnItem.trackingAwb})
                  </p>
                )}
                {returnItem.status === 'refunded' && (
                  <p className="text-emerald-700 font-semibold mt-1">
                    ✓ Refund Completed: ₹{returnItem.refundAmount?.toLocaleString('en-IN')} credited. Reference ID: {returnItem.refundTxnId || 'UPI-REF-894102'}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Timeline Milestones Log */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Activity History & Verification Log
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-slate-50/50 p-4 max-h-48 overflow-y-auto space-y-3">
              {(returnItem.timeline || []).map((milestone, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{milestone.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(milestone.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Return Info Summary: Reason, Comments, Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">Customer Remarks</span>
              <p className="text-slate-600 italic">
                "{returnItem.customerComments || 'No extra remarks provided.'}"
              </p>
              {returnItem.images && returnItem.images.length > 0 && (
                <div className="flex gap-2 pt-2">
                  {returnItem.images.map((img, i) => (
                    <img key={i} src={img} alt="Evidence" className="w-12 h-12 rounded object-cover border border-slate-300" />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">Refund Destination</span>
              <p className="text-slate-700 font-medium">{returnItem.refundMethod}</p>
              <p className="text-slate-500">Pickup Location: {returnItem.pickupAddress || 'Verified customer address'}</p>
            </div>
          </div>

          {/* Quick Simulation / Testing Control Bar */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">Test Return Lifecycle Live</span>
                <span className="text-[11px] text-slate-500">
                  Advance step to view: Return Requested ➔ Seller Review ➔ Approved ➔ Pickup ➔ Refund
                </span>
              </div>
            </div>

            {currentStepKey !== 'refunded' ? (
              <button
                type="button"
                onClick={handleSimulateNextStep}
                disabled={isAdvancing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <span>Advance to Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">
                ✓ Full Lifecycle Completed
              </span>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
}
