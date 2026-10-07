import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, X, Navigation, Loader2, CheckCircle2, AlertCircle, Compass, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  getLiveGPSCoordinates, 
  reverseGeocodeCoordinates, 
  resolvePincodeToLocation,
  getQuickPincodeInfo 
} from '../../services/locationService';

export default function LocationModal({ isOpen, onClose }) {
  const { deliveryLocation, updateDeliveryLocation, user } = useAuth();
  const { addToast } = useToast() || { addToast: () => {} };

  const [pincode, setPincode] = useState(deliveryLocation?.pincode || '560038');
  const [pinPreview, setPinPreview] = useState(null);
  const [isResolvingPin, setIsResolvingPin] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState(null);

  // Synchronize initial pincode on modal open
  useEffect(() => {
    if (isOpen && deliveryLocation?.pincode) {
      setPincode(deliveryLocation.pincode);
      const quick = getQuickPincodeInfo(deliveryLocation.pincode);
      if (quick) {
        setPinPreview(`${quick.city}, ${quick.state}`);
      }
    }
  }, [isOpen, deliveryLocation]);

  // Live preview as user types PIN code
  const handlePincodeChange = async (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setPincode(clean);

    if (clean.length === 6) {
      const quick = getQuickPincodeInfo(clean);
      if (quick) {
        setPinPreview(`${quick.city}, ${quick.state}`);
      }
      // Query API for exact district/city
      resolvePincodeToLocation(clean).then(info => {
        if (info && info.city) {
          setPinPreview(`${info.city}, ${info.state}`);
        }
      }).catch(() => {});
    } else {
      setPinPreview(null);
    }
  };

  if (!isOpen) return null;

  const handleDetectLiveLocation = async () => {
    setIsDetecting(true);
    setDetectError(null);
    try {
      const coords = await getLiveGPSCoordinates();
      const locationData = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      
      updateDeliveryLocation({
        city: locationData.city,
        district: locationData.city,
        pincode: locationData.pincode,
        state: locationData.state,
        area: locationData.area,
        country: locationData.country || 'India',
        latitude: coords.latitude,
        longitude: coords.longitude,
        isLiveLocation: true
      });

      if (addToast) {
        addToast(`Live location detected: ${locationData.city} (${locationData.pincode})`, 'success');
      }
      onClose();
    } catch (err) {
      console.error('Live location detection failed', err);
      setDetectError(err.message || 'Unable to detect live location. Please check browser permissions.');
      if (addToast) {
        addToast(err.message || 'Could not acquire GPS position', 'error');
      }
    } finally {
      setIsDetecting(false);
    }
  };

  const handleApplyPincode = async (e) => {
    e.preventDefault();
    const cleanPin = pincode.trim().replace(/\D/g, '');

    if (cleanPin.length === 6) {
      setIsResolvingPin(true);
      try {
        const info = await resolvePincodeToLocation(cleanPin);
        const resolvedCity = (info.city && info.city !== 'India') ? info.city : `PIN ${cleanPin}`;

        updateDeliveryLocation({
          city: resolvedCity,
          district: info.district || resolvedCity,
          pincode: cleanPin,
          state: info.state || 'India',
          area: info.area || '',
          country: 'India',
          isLiveLocation: false
        });

        if (addToast) {
          addToast(`Delivery destination set to ${resolvedCity} (${cleanPin})`, 'success');
        }
        onClose();
      } catch (err) {
        console.error('Pincode resolution failed', err);
        const quick = getQuickPincodeInfo(cleanPin);
        const cityFallback = quick ? quick.city : `PIN ${cleanPin}`;

        updateDeliveryLocation({
          city: cityFallback,
          pincode: cleanPin,
          state: quick ? quick.state : 'India',
          country: 'India',
          isLiveLocation: false
        });

        if (addToast) addToast(`Delivery destination updated to PIN ${cleanPin}`, 'info');
        onClose();
      } finally {
        setIsResolvingPin(false);
      }
    } else {
      if (addToast) addToast('Please enter a valid 6-digit Indian PIN code', 'warning');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <MapPin className="w-4 h-4" />
            </div>
            <span>Choose Delivery Destination</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Current Active Destination Banner */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Active Destination:</span>
              <span className="font-bold text-slate-900">
                {deliveryLocation?.city && deliveryLocation.city !== 'India'
                  ? `${deliveryLocation.city} - ${deliveryLocation.pincode}`
                  : deliveryLocation?.pincode
                  ? `PIN ${deliveryLocation.pincode}`
                  : 'India'}
              </span>
            </div>
            {deliveryLocation?.isLiveLocation && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live GPS
              </span>
            )}
          </div>

          {/* PRIMARY ACTION: Detect My Live Location (GPS) */}
          <div>
            <button
              onClick={handleDetectLiveLocation}
              disabled={isDetecting}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-800 active:scale-[0.99] transition-all cursor-pointer group disabled:opacity-70"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  {isDetecting ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Navigation className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-300" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm flex items-center gap-2">
                    <span>Use Current Live Location</span>
                    <span className="bg-emerald-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      GPS Live
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100">
                    {isDetecting ? 'Acquiring GPS coordinates & detecting area...' : 'Instant neighborhood & pincode detection'}
                  </p>
                </div>
              </div>
            </button>

            {detectError && (
              <div className="mt-2 text-[11px] text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{detectError}</span>
              </div>
            )}
          </div>

          {/* Saved Addresses (if any) */}
          {user?.addresses && user.addresses.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Saved Locations
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {user.addresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => {
                      updateDeliveryLocation({
                        city: addr.city || 'India',
                        pincode: addr.pincode,
                        state: addr.state,
                        country: 'India',
                        isLiveLocation: false
                      });
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-2xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                      deliveryLocation?.pincode === addr.pincode && !deliveryLocation?.isLiveLocation
                        ? 'border-blue-600 bg-blue-50/40 text-slate-900 font-medium ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">{addr.name}</span> ({addr.type || 'Home'}): {addr.flat || addr.street}, {addr.city} - {addr.pincode}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-slate-200/80 w-full" />
            <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider absolute">
              or enter Indian postal PIN
            </span>
          </div>

          {/* Manual PIN Code Form */}
          <form onSubmit={handleApplyPincode} className="space-y-2">
            <div className="flex gap-2.5">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                placeholder="e.g. 751001, 560038, 110001"
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
              />
              <button
                type="submit"
                disabled={isResolvingPin || pincode.length !== 6}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isResolvingPin ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Apply</span>
              </button>
            </div>

            {/* Dynamic PIN detected City / District preview pill */}
            {pinPreview && (
              <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 animate-in fade-in">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Detected Location: <strong>{pinPreview}</strong></span>
              </div>
            )}
          </form>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
