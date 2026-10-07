import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, Globe, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isSeller } = useAuth();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs select-none mt-16 border-t border-slate-800">
      
      {/* 1. Back to Top Bar */}
      <button
        onClick={scrollToTop}
        className="w-full py-3 bg-slate-900/90 hover:bg-slate-800 transition-colors text-center font-medium text-xs flex items-center justify-center gap-1.5 text-slate-400 hover:text-white border-b border-slate-800"
      >
        <ChevronUp className="w-4 h-4" />
        <span>Return to top</span>
      </button>

      {/* 2. Main 4-Column Links Area */}
      <div className="max-w-[1280px] mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 border-b border-slate-800/80">
        
        {/* Col 1: Get to Know Us */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">About BazaarHub</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li><Link to="/about" className="hover:text-white transition-colors">Our Philosophy</Link></li>
            <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link to="/press" className="hover:text-white transition-colors">Editorial & Press</Link></li>
            <li><Link to="/science" className="hover:text-white transition-colors">Community Grants</Link></li>
            <li><Link to="/gift" className="hover:text-white transition-colors">Artisan Fund</Link></li>
          </ul>
        </div>

        {/* Col 2: Make Money with Us */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Merchant Network</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li><Link to={isSeller ? "/seller/dashboard" : "/help"} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sell on BazaarHub</Link></li>
            <li><Link to={isSeller ? "/seller/dashboard" : "/help"} className="hover:text-white transition-colors">Merchant Accelerator</Link></li>
            <li><Link to="/brand-protection" className="hover:text-white transition-colors">Brand Registry & IP</Link></li>
            <li><Link to="/affiliates" className="hover:text-white transition-colors">Creator Affiliates</Link></li>
            <li><Link to="/fulfillment" className="hover:text-white transition-colors">Express Hub Logistics</Link></li>
            <li><Link to="/advertise" className="hover:text-white transition-colors">Promoted Listings</Link></li>
          </ul>
        </div>

        {/* Col 3: Payment Products */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Financing & Pay</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li><Link to="/pay" className="hover:text-white transition-colors">BazaarHub UPI Instant</Link></li>
            <li><Link to="/rewards" className="hover:text-white transition-colors">Cashback & Perks</Link></li>
            <li><Link to="/emi" className="hover:text-white transition-colors">0% Interest No-Cost EMI</Link></li>
            <li><Link to="/gift-cards" className="hover:text-white transition-colors">Digital Gift Vouchers</Link></li>
            <li><Link to="/wallet" className="hover:text-white transition-colors">Instant Wallet Top-up</Link></li>
          </ul>
        </div>

        {/* Col 4: Let Us Help You */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Support & Trust</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li><Link to="/account" className="hover:text-white transition-colors">Buyer Profile</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">Track Shipments</Link></li>
            <li><Link to="/protection" className="hover:text-white transition-colors">100% Escrow Protection</Link></li>
            <li><Link to="/download-app" className="hover:text-white transition-colors">iOS & Android Apps</Link></li>
            <li><Link to="/help" className="hover:text-white transition-colors">24/7 Concierge Support</Link></li>
          </ul>
        </div>

      </div>

      {/* 3. Middle Branding & Regional Settings */}
      <div className="py-8 bg-slate-950/80 border-b border-slate-900">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center font-black text-white text-xs shadow-md shadow-indigo-950">
              BH
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-white tracking-tight leading-none">BazaarHub</span>
              <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Marketplace IN</span>
            </div>
          </Link>

          {/* Regional Badges */}
          <div className="flex items-center flex-wrap justify-center gap-3 text-xs">
            <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>English (India)</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
              <span>₹ INR - Indian Rupee</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 flex items-center gap-1.5">
              <span>🇮🇳 India</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Bottom Legal & Copyright Notice */}
      <div className="py-8 text-center text-[11px] text-slate-500 space-y-2">
        <div className="flex items-center justify-center flex-wrap gap-4 text-slate-400">
          <Link to="/conditions" className="hover:text-white transition-colors">Terms of Sale</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Shield</Link>
          <span>•</span>
          <Link to="/interest-ads" className="hover:text-white transition-colors">Cookie Preferences</Link>
          <span>•</span>
          <Link to={isSeller ? "/seller/dashboard" : "/help"} className="text-indigo-400 hover:underline">Merchant Compliance</Link>
        </div>

        <p className="pt-2 text-slate-600">
          © 2026 BazaarHub Marketplace Private Limited. Designed for contemporary commerce across India.
        </p>
      </div>

    </footer>
  );
}
