import React from 'react';
import { Home, Building2, MapPin, Phone, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export default function AddressCard({ 
  address, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onSetDefault,
  showActions = true,
  selectable = true 
}) {
  if (!address) return null;

  const TypeIcon = address.type === 'Work' ? Building2 : address.type === 'Home' ? Home : MapPin;

  return (
    <div
      onClick={selectable && onSelect ? () => onSelect(address) : undefined}
      className={`rounded-2xl border p-4 sm:p-5 transition-all relative flex flex-col justify-between ${
        selectable ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? 'border-blue-600 bg-blue-50/20 ring-2 ring-blue-600/20 shadow-xs'
          : 'border-slate-200 hover:border-slate-300 bg-white'
      }`}
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              <TypeIcon className="w-3 h-3 text-blue-600" />
              {address.type || 'Home'}
            </span>
            {address.isDefault && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Default
              </span>
            )}
          </div>

          {selectable && (
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
              isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
            }`}>
              {isSelected && <CheckCircle2 className="w-4 h-4 fill-white text-blue-600" />}
            </div>
          )}
        </div>

        {/* Receiver Name */}
        <h4 className="font-bold text-sm text-slate-900 mb-1">
          {address.name}
        </h4>

        {/* Address Lines in Standard Format */}
        <div className="text-xs text-slate-600 space-y-0.5 leading-relaxed">
          <p className="font-medium text-slate-800">
            {address.flat || address.street?.split(',')?.[0] || address.street}
          </p>
          {(address.area || address.street?.split(',')?.slice(1)?.join(',')) && (
            <p>{address.area || address.street?.split(',')?.slice(1)?.join(',')}</p>
          )}
          {address.landmark && (
            <p className="text-slate-500 italic">Landmark: {address.landmark}</p>
          )}
          <p className="font-semibold text-slate-900 pt-0.5">
            {address.city}, {address.state} - <span className="font-mono">{address.pincode}</span>
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-slate-700 font-medium text-xs">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>Mobile: <span className="font-mono">{address.phone}</span></span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(address);
                }}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold py-1 px-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}

            {onDelete && !address.isDefault && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(address.id);
                }}
                className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            )}
          </div>

          {onSetDefault && !address.isDefault && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault(address.id);
              }}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Set as Default
            </button>
          )}
        </div>
      )}
    </div>
  );
}
