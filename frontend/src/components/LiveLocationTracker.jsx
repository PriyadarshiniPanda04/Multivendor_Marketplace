import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  RotateCw, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export default function LiveLocationTracker({ destinationAddress, courierName = 'BazaarHub Express' }) {
  const [distanceKm, setDistanceKm] = useState(2.3);
  const [etaMins, setEtaMins] = useState(11);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(68);
  const [lastUpdated, setLastUpdated] = useState('Just now');

  // Rider position on simulated route
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressPercent(prev => (prev < 90 ? prev + 0.5 : 88));
      setDistanceKm(prev => (prev > 0.4 ? +(prev - 0.05).toFixed(2) : 0.4));
      setEtaMins(prev => (prev > 3 ? Math.max(3, Math.round(prev - 0.2)) : 3));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleRefreshGPS = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated('Just now');
    }, 800);
  };

  const deliveryCity = destinationAddress?.city || 'Bengaluru';
  const deliveryPincode = destinationAddress?.pincode || '560038';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
      
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 border-2 border-slate-900" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">Live Courier GPS Tracking</h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Feed
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Rider is currently on the move to your doorstep
            </p>
          </div>
        </div>

        <button
          onClick={handleRefreshGPS}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          <span>{isRefreshing ? 'Pinging GPS...' : 'Refresh Live GPS'}</span>
        </button>
      </div>

      {/* Simulated Live GPS Map View */}
      <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden select-none">
        
        {/* Map Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* Simulated Road Lines (SVG Vector Path) */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Main Road Trunk */}
          <path
            d="M 40 220 Q 180 180 260 120 T 480 90 T 700 60"
            fill="none"
            stroke="#1e293b"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M 40 220 Q 180 180 260 120 T 480 90 T 700 60"
            fill="none"
            stroke="#334155"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Navigation Polyline with animated dash */}
          <path
            d="M 80 210 Q 200 170 290 115 Q 420 90 560 70"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="5"
            strokeDasharray="8 6"
            className="animate-pulse"
          />
        </svg>

        {/* Courier Pin with Radar Pulse */}
        <div 
          className="absolute z-20 transition-all duration-1000 ease-out"
          style={{
            left: `${Math.min(progressPercent, 78)}%`,
            top: '32%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Animated Radar Pulse Rings */}
            <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-blue-500 opacity-40" />
            <span className="animate-pulse absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-60" />
            
            {/* Rider Icon Badge */}
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <Navigation className="w-5 h-5 rotate-45" />
            </div>

            {/* Rider Floating Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow-md">
              🛵 Rajesh (Express Rider) • 34 km/h
            </div>
          </div>
        </div>

        {/* Customer Destination Pin */}
        <div 
          className="absolute z-10"
          style={{ right: '12%', top: '24%', transform: 'translate(50%, -50%)' }}
        >
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="mt-1 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700 whitespace-nowrap">
              Your Doorstep ({deliveryPincode})
            </div>
          </div>
        </div>

        {/* Map Floating HUD: Live Status & ETA */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-20">
          <div className="bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-2xl border border-slate-700 shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Estimated Arrival</span>
                <span className="text-sm font-bold text-white">~{etaMins} mins ({distanceKm} km)</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Delivery OTP</span>
              <span className="font-mono text-sm font-extrabold text-amber-300 tracking-wider">7429</span>
            </div>
          </div>
        </div>

      </div>

      {/* Driver Contact & Verification Box */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Delivery Rider"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
            />
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900">Rajesh Sharma</h4>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                ★ 4.9
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Honda Activa 6G • <span className="font-mono font-semibold text-slate-700">KA-05-MR-8219</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="tel:+919876543210"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Rider</span>
          </a>

          <button
            type="button"
            onClick={() => alert('Connected with rider chat: Rajesh is 1.8km away on your main road.')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Message</span>
          </button>
        </div>

      </div>

    </div>
  );
}
