import React, { useState, useEffect } from 'react';
import { X, MapPin, Home, Building2, Phone, User, Compass, Check, Navigation, Loader2 } from 'lucide-react';
import { getLiveGPSCoordinates, reverseGeocodeCoordinates } from '../services/locationService';

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

// Quick PIN code prefix heuristics to auto-populate City and State
export function lookupPincode(pincode) {
  if (!pincode || pincode.length < 3) return null;
  const p3 = pincode.substring(0, 3);
  const p2 = pincode.substring(0, 2);

  if (p2 === '56') return { city: 'Bengaluru', state: 'Karnataka' };
  if (p2 === '57') return { city: 'Mangaluru', state: 'Karnataka' };
  if (p2 === '58') return { city: 'Hubli-Dharwad', state: 'Karnataka' };
  if (p2 === '11') return { city: 'New Delhi', state: 'Delhi' };
  if (p2 === '40') return { city: 'Mumbai', state: 'Maharashtra' };
  if (p2 === '41') return { city: 'Pune', state: 'Maharashtra' };
  if (p2 === '44') return { city: 'Nagpur', state: 'Maharashtra' };
  if (p2 === '60') return { city: 'Chennai', state: 'Tamil Nadu' };
  if (p2 === '64') return { city: 'Coimbatore', state: 'Tamil Nadu' };
  if (p2 === '50') return { city: 'Hyderabad', state: 'Telangana' };
  if (p2 === '70') return { city: 'Kolkata', state: 'West Bengal' };
  if (p2 === '38') return { city: 'Ahmedabad', state: 'Gujarat' };
  if (p2 === '39') return { city: 'Surat', state: 'Gujarat' };
  if (p2 === '30') return { city: 'Jaipur', state: 'Rajasthan' };
  if (p2 === '20') return { city: 'Noida', state: 'Uttar Pradesh' };
  if (p2 === '22') return { city: 'Lucknow', state: 'Uttar Pradesh' };
  if (p2 === '12') return { city: 'Gurugram', state: 'Haryana' };
  if (p2 === '16') return { city: 'Chandigarh', state: 'Chandigarh' };
  if (p2 === '68') return { city: 'Kochi', state: 'Kerala' };
  if (p2 === '80') return { city: 'Patna', state: 'Bihar' };
  if (p2 === '46') return { city: 'Bhopal', state: 'Madhya Pradesh' };
  if (p2 === '75') return { city: 'Bhubaneswar', state: 'Odisha' };
  return null;
}

export default function AddressModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    flat: '',
    area: '',
    landmark: '',
    city: '',
    state: 'Karnataka',
    type: 'Home',
    isDefault: false
  });

  const [errors, setErrors] = useState({});
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationNotice, setLocationNotice] = useState(null);

  const handleLiveLocationAutoFill = async () => {
    setIsDetectingLocation(true);
    setLocationNotice(null);
    try {
      const coords = await getLiveGPSCoordinates();
      const loc = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      setFormData(prev => ({
        ...prev,
        pincode: loc.pincode || prev.pincode,
        city: loc.city || prev.city,
        state: loc.state || prev.state,
        area: loc.area ? `${loc.area}` : prev.area
      }));
      setLocationNotice(`Auto-filled: ${loc.city}, ${loc.state} (${loc.pincode})`);
      setErrors(prev => ({ ...prev, pincode: null, city: null, state: null, area: null }));
    } catch (err) {
      setLocationNotice(`Location error: ${err.message || 'Could not acquire GPS'}`);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone ? initialData.phone.replace(/[^0-9]/g, '').slice(-10) : '',
        pincode: initialData.pincode || '',
        flat: initialData.flat || initialData.street || '',
        area: initialData.area || '',
        landmark: initialData.landmark || '',
        city: initialData.city || '',
        state: initialData.state || 'Karnataka',
        type: initialData.type || 'Home',
        isDefault: !!initialData.isDefault
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        pincode: '',
        flat: '',
        area: '',
        landmark: '',
        city: '',
        state: 'Karnataka',
        type: 'Home',
        isDefault: false
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handlePincodeChange = (val) => {
    const numeric = val.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => {
      const updated = { ...prev, pincode: numeric };
      if (numeric.length === 6) {
        const auto = lookupPincode(numeric);
        if (auto) {
          if (!prev.city || prev.city.trim() === '') updated.city = auto.city;
          if (!prev.state || prev.state === 'Karnataka') updated.state = auto.state;
        }
      }
      return updated;
    });
    if (errors.pincode) {
      setErrors(prev => ({ ...prev, pincode: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) {
      errs.phone = 'Valid 10-digit mobile number is required';
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      errs.pincode = 'Valid 6-digit pincode is required';
    }
    if (!formData.flat.trim()) {
      errs.flat = 'Flat, house no., or building is required';
    }
    if (!formData.area.trim()) {
      errs.area = 'Area, street, or sector is required';
    }
    if (!formData.city.trim()) {
      errs.city = 'City / Town is required';
    }
    if (!formData.state.trim()) {
      errs.state = 'State is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedAddress = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: formData.name.trim(),
      phone: formData.phone.startsWith('+91') ? formData.phone : `+91 ${formData.phone}`,
      pincode: formData.pincode.trim(),
      flat: formData.flat.trim(),
      area: formData.area.trim(),
      street: `${formData.flat.trim()}, ${formData.area.trim()}`,
      landmark: formData.landmark.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      type: formData.type,
      isDefault: formData.isDefault
    };

    onSave(formattedAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {initialData ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <p className="text-xs text-slate-500">Standard delivery address format for fast dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Address Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Live GPS Auto-fill Action */}
          <div>
            <button
              type="button"
              onClick={handleLiveLocationAutoFill}
              disabled={isDetectingLocation}
              className="w-full py-2.5 px-3.5 bg-blue-50/90 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              {isDetectingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <Navigation className="w-4 h-4 text-blue-600" />
              )}
              <span>{isDetectingLocation ? 'Detecting GPS live location...' : 'Auto-fill PIN & City from Current Live Location (GPS)'}</span>
            </button>
            {locationNotice && (
              <p className="text-[11px] text-blue-600 mt-1.5 px-1 font-medium">{locationNotice}</p>
            )}
          </div>

          {/* Row 1: Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.name && <p className="text-[11px] text-rose-500 mt-0.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                10-Digit Mobile Number *
              </label>
              <div className="relative flex">
                <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-600 text-xs font-semibold">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, phone: val });
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-r-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-500 mt-0.5">{errors.phone}</p>}
            </div>
          </div>

          {/* Row 2: Pincode & City & State */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                6-Digit PIN Code *
              </label>
              <input
                type="text"
                placeholder="e.g. 560038"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono ${
                  errors.pincode ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.pincode && <p className="text-[11px] text-rose-500 mt-0.5">{errors.pincode}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Town / City *
              </label>
              <input
                type="text"
                placeholder="e.g. Bengaluru"
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: null });
                }}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.city && <p className="text-[11px] text-rose-500 mt-0.5">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Flat / House No / Building */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Flat, House No., Building, Company, Apartment *
            </label>
            <input
              type="text"
              placeholder="e.g. Flat 402, Lotus Residency, Tower B"
              value={formData.flat}
              onChange={(e) => {
                setFormData({ ...formData, flat: e.target.value });
                if (errors.flat) setErrors({ ...errors, flat: null });
              }}
              className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                errors.flat ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {errors.flat && <p className="text-[11px] text-rose-500 mt-0.5">{errors.flat}</p>}
          </div>

          {/* Row 4: Area / Street / Sector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Area, Street, Sector, Village *
            </label>
            <input
              type="text"
              placeholder="e.g. 12th Main Road, HAL 2nd Stage, Indiranagar"
              value={formData.area}
              onChange={(e) => {
                setFormData({ ...formData, area: e.target.value });
                if (errors.area) setErrors({ ...errors, area: null });
              }}
              className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                errors.area ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {errors.area && <p className="text-[11px] text-rose-500 mt-0.5">{errors.area}</p>}
          </div>

          {/* Row 5: Landmark (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Landmark (Optional)
            </label>
            <div className="relative">
              <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. Opposite BDA Complex / Near Indiranagar Metro"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Address Type Tag (Home / Work) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Address Type
            </label>
            <div className="flex items-center gap-3">
              {[
                { id: 'Home', label: 'Home (7 AM - 9 PM)', icon: Home },
                { id: 'Work', label: 'Work (9 AM - 6 PM)', icon: Building2 },
                { id: 'Other', label: 'Other', icon: MapPin }
              ].map(typeOpt => {
                const Icon = typeOpt.icon;
                const isSelected = formData.type === typeOpt.id;
                return (
                  <button
                    key={typeOpt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: typeOpt.id })}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-500/20'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{typeOpt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Set as Default Address Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              <span>Make this my default delivery address</span>
            </label>
          </div>

          {/* Submit & Cancel Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Update Address' : 'Save Address'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
