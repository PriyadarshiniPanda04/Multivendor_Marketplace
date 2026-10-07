import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  AlertCircle, 
  UploadCloud, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2,
  HelpCircle,
  Truck,
  CreditCard
} from 'lucide-react';
import { RETURN_REASONS, returnService } from '../services/returnService';
import { useToast } from '../context/ToastContext';

export default function ReturnRequestModal({
  isOpen,
  onClose,
  orderId,
  product,
  onReturnSubmitted
}) {
  const { addToast } = useToast();

  const [selectedReason, setSelectedReason] = useState('Wrong product');
  const [comments, setComments] = useState('');
  const [refundMethod, setRefundMethod] = useState('Original Payment Method (UPI / Card)');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason) {
      addToast('Please select a valid return reason.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newReturn = await returnService.createReturnRequest({
        orderId: orderId || 'ORD-894120',
        product,
        reason: selectedReason,
        customerComments: comments,
        images: uploadedImages,
        refundAmount: product.price,
        refundMethod,
        pickupAddress: 'Customer Delivery Address (Confirmed on Order)'
      });

      addToast('Return request submitted! Seller review will begin shortly.', 'success');
      if (onReturnSubmitted) {
        onReturnSubmitted(newReturn);
      }
      onClose();
    } catch (err) {
      console.error(err);
      addToast('Failed to submit return request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Request Return & Refund</h2>
              <p className="text-[11px] text-slate-400">Order #{orderId || 'ORD-894120'} • 7-Day Guarantee</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-slate-700">
          
          {/* Selected Product Card */}
          <div className="flex items-center gap-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <img 
              src={product.images?.[0] || product.image} 
              alt={product.name} 
              className="w-14 h-14 object-contain rounded-lg bg-white border border-slate-200 p-1 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-slate-900 line-clamp-1 text-xs sm:text-sm">
                {product.name}
              </span>
              <div className="flex items-center gap-2 mt-0.5 text-slate-500">
                <span>Sold by: <strong className="text-slate-800">{product.sellerName || 'TechWorld Store'}</strong></span>
                <span>•</span>
                <span className="font-bold text-slate-900 text-xs">
                  Refund: ₹{product.price?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Return Reason Selection (Exact 4 options requested by user) */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span>Why are you returning this item?</span>
              <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {RETURN_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/60 text-slate-950 font-bold ring-1 ring-orange-500 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-xs">{reason}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comments / Details */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-900 text-xs">
              Additional Details & Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="e.g. Received incorrect model number; seal was damaged on arrival..."
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 text-xs text-slate-800 transition-colors"
            />
          </div>

          {/* Photo Evidence Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 text-xs flex items-center gap-1">
                <span>Upload Product Photos</span>
                <span className="text-slate-400 font-normal">(Speeds up seller review)</span>
              </label>
              <span className="text-[10px] text-slate-400">Max 3 images</span>
            </div>

            <div className="flex flex-wrap gap-2.5 items-center">
              {uploadedImages.map((img, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-lg border border-slate-200 overflow-hidden group">
                  <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute inset-0 bg-slate-950/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {uploadedImages.length < 3 && (
                <label className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 hover:border-orange-500 flex flex-col items-center justify-center text-slate-400 hover:text-orange-500 transition-colors cursor-pointer bg-slate-50">
                  <UploadCloud className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-bold">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Refund Mode Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-900 text-xs">
              Preferred Refund Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className={`flex items-center gap-2.5 p-2.5 border rounded-xl cursor-pointer ${
                refundMethod.includes('Original') ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200'
              }`}>
                <input
                  type="radio"
                  name="refundMethod"
                  value="Original Payment Method (UPI / Card)"
                  checked={refundMethod.includes('Original')}
                  onChange={(e) => setRefundMethod(e.target.value)}
                  className="text-blue-600 focus:ring-0"
                />
                <CreditCard className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">Original Payment Method</span>
                  <span className="text-[10px] text-slate-500">Credited in 3-5 business days</span>
                </div>
              </label>

              <label className={`flex items-center gap-2.5 p-2.5 border rounded-xl cursor-pointer ${
                refundMethod.includes('Wallet') ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200'
              }`}>
                <input
                  type="radio"
                  name="refundMethod"
                  value="BazaarHub Wallet Instant Credit"
                  checked={refundMethod.includes('Wallet')}
                  onChange={(e) => setRefundMethod(e.target.value)}
                  className="text-emerald-600 focus:ring-0"
                />
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">BazaarHub Wallet</span>
                  <span className="text-[10px] text-slate-500">Instant credit after pickup</span>
                </div>
              </label>
            </div>
          </div>

          {/* 5-Step Pipeline Notice */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div className="text-[11px] text-amber-900 leading-relaxed">
              <span className="font-bold">Next steps in our return process:</span>
              <p className="mt-0.5 text-amber-800">
                1. Return Requested ➔ 2. Seller Review ➔ 3. Approved ➔ 4. Courier Pickup ➔ 5. Instant Refund.
              </p>
            </div>
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
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Confirm Return Request'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
