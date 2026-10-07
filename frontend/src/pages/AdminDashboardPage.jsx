import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Store, 
  ShoppingBag, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  DollarSign, 
  ArrowLeft,
  Percent,
  Banknote,
  SlidersHorizontal,
  Building2,
  CreditCard,
  Save,
  CheckCircle2,
  Tag,
  Plus,
  Trash2,
  Calendar,
  X
} from 'lucide-react';
import { SELLERS, PRODUCTS, CATEGORIES } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { commissionService } from '../services/commissionService';
import { couponService, MOCK_COUPONS } from '../services/couponService';

export default function AdminDashboardPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('commission'); // 'commission' | 'sellers' | 'payouts'
  const [sellersList, setSellersList] = useState(SELLERS);

  // Commission Settings State
  const [commissionSettings, setCommissionSettings] = useState(() => 
    commissionService.getSettings()
  );
  const [globalRateInput, setGlobalRateInput] = useState(commissionSettings.globalRate || 10);
  const [categoryRatesInput, setCategoryRatesInput] = useState(commissionSettings.categoryRates || []);
  const [sellerRatesInput, setSellerRatesInput] = useState(commissionSettings.sellerRates || []);

  // Payouts State
  const [payoutsList, setPayoutsList] = useState(() => 
    commissionService.getPayouts(null)
  );

  // Coupons State
  const [couponsList, setCouponsList] = useState(MOCK_COUPONS);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '2028-12-31',
    usageLimit: '500'
  });

  const refreshData = () => {
    const s = commissionService.getSettings();
    setCommissionSettings(s);
    setGlobalRateInput(s.globalRate);
    setCategoryRatesInput(s.categoryRates);
    setSellerRatesInput(s.sellerRates);
    setPayoutsList(commissionService.getPayouts(null));
    couponService.getCoupons().then(data => {
      if (data && data.length > 0) setCouponsList(data);
    });
  };

  useEffect(() => {
    refreshData();
    const handleCommissionUpdate = () => refreshData();
    const handlePayoutUpdate = () => refreshData();

    window.addEventListener('bazaarhub_commission_updated', handleCommissionUpdate);
    window.addEventListener('bazaarhub_payout_updated', handlePayoutUpdate);

    return () => {
      window.removeEventListener('bazaarhub_commission_updated', handleCommissionUpdate);
      window.removeEventListener('bazaarhub_payout_updated', handlePayoutUpdate);
    };
  }, []);

  const toggleVerify = (id) => {
    setSellersList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, verified: !s.verified } : s))
    );
    addToast('Seller verification status updated!', 'success');
  };

  // Coupon Handlers
  const handleToggleCoupon = async (coupon) => {
    try {
      if (coupon._id) {
        await fetch(`http://localhost:5000/api/coupons/${coupon._id}/toggle`, { method: 'PATCH' });
      }
    } catch (e) {
      console.warn(e);
    }
    setCouponsList((prev) =>
      prev.map((c) => (c.code === coupon.code ? { ...c, isActive: !c.isActive } : c))
    );
    addToast(`Coupon "${coupon.code}" is now ${!coupon.isActive ? 'Active' : 'Inactive'}!`, 'info');
  };

  const handleDeleteCoupon = async (coupon) => {
    try {
      if (coupon._id) {
        await fetch(`http://localhost:5000/api/coupons/${coupon._id}`, { method: 'DELETE' });
      }
    } catch (e) {
      console.warn(e);
    }
    setCouponsList((prev) => prev.filter((c) => c.code !== coupon.code));
    addToast(`Coupon "${coupon.code}" removed.`, 'info');
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) {
      addToast('Please enter coupon code.', 'error');
      return;
    }
    if (!newCoupon.discountValue) {
      addToast('Please enter discount value.', 'error');
      return;
    }

    const payload = {
      code: newCoupon.code.trim().toUpperCase(),
      description:
        newCoupon.description.trim() ||
        (newCoupon.discountType === 'percentage'
          ? `${newCoupon.discountValue}% OFF on orders`
          : `Flat ₹${newCoupon.discountValue} OFF`),
      discountType: newCoupon.discountType,
      discountValue: Number(newCoupon.discountValue),
      minOrderAmount: Number(newCoupon.minOrderAmount) || 0,
      maxDiscountAmount: newCoupon.maxDiscountAmount ? Number(newCoupon.maxDiscountAmount) : null,
      startDate: newCoupon.startDate,
      endDate: newCoupon.endDate,
      usageLimit: newCoupon.usageLimit ? Number(newCoupon.usageLimit) : null,
      isActive: true,
      usedCount: 0
    };

    try {
      const res = await fetch('http://localhost:5000/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setCouponsList((prev) => [json.data, ...prev]);
        addToast(`Coupon "${payload.code}" created successfully!`, 'success');
        setShowCouponModal(false);
        setNewCoupon({
          code: '',
          description: '',
          discountType: 'percentage',
          discountValue: '',
          minOrderAmount: '',
          maxDiscountAmount: '',
          startDate: new Date().toISOString().slice(0, 10),
          endDate: '2028-12-31',
          usageLimit: '500'
        });
        return;
      } else if (json.message) {
        addToast(json.message, 'error');
        return;
      }
    } catch (e) {
      console.warn(e);
    }

    // Fallback in memory
    setCouponsList((prev) => [payload, ...prev]);
    addToast(`Coupon "${payload.code}" created successfully!`, 'success');
    setShowCouponModal(false);
    setNewCoupon({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '2028-12-31',
      usageLimit: '500'
    });
  };

  // 1. Save Percentage-based Global Rate
  const handleSaveGlobalRate = () => {
    const rateNum = Number(globalRateInput);
    if (rateNum < 0 || rateNum > 100) {
      addToast('Commission percentage must be between 0% and 100%.', 'error');
      return;
    }

    const updated = {
      ...commissionSettings,
      globalRate: rateNum
    };
    commissionService.updateSettings(updated);
    addToast(`Global Commission Rate updated to ${rateNum}%!`, 'success');
  };

  // 2. Save Category-based Rates
  const handleCategoryRateChange = (categorySlug, newRate) => {
    setCategoryRatesInput((prev) =>
      prev.map((c) =>
        c.categorySlug === categorySlug ? { ...c, rate: Number(newRate) } : c
      )
    );
  };

  const handleSaveCategoryRates = () => {
    const updated = {
      ...commissionSettings,
      categoryRates: categoryRatesInput
    };
    commissionService.updateSettings(updated);
    addToast('Category-based commission rates saved successfully!', 'success');
  };

  // 3. Save Seller-based Rates
  const handleSellerRateChange = (sellerId, newRate) => {
    setSellerRatesInput((prev) =>
      prev.map((s) =>
        s.sellerId === sellerId ? { ...s, rate: Number(newRate) } : s
      )
    );
  };

  const handleSaveSellerRates = () => {
    const updated = {
      ...commissionSettings,
      sellerRates: sellerRatesInput
    };
    commissionService.updateSettings(updated);
    addToast('Seller-specific custom commission rates saved successfully!', 'success');
  };

  // Admin Payout Action
  const handleDisbursePayout = (payoutId) => {
    commissionService.updatePayoutStatus(payoutId, 'completed');
    setPayoutsList(commissionService.getPayouts(null));
    addToast(`Payout #${payoutId} approved & funds disbursed to merchant!`, 'success');
  };

  const pendingPayoutsCount = payoutsList.filter((p) => p.status === 'requested' || p.status === 'processing').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-[#131921] text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              BazaarHub Administration Console
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multivendor network health, 3-Tier Commission configuration, and escrow settlements
          </p>
        </div>

        <Link
          to="/"
          className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </Link>
      </div>

      {/* Admin KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Users</span>
          <span className="text-2xl font-black text-slate-900 block">48,210</span>
          <span className="text-[11px] text-emerald-600 font-semibold">+1,240 this week</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Registered Sellers</span>
          <span className="text-2xl font-black text-slate-900 block">{sellersList.length} Stores</span>
          <span className="text-[11px] text-purple-600 font-semibold">100% KYC Approved</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Marketplace GMV</span>
          <span className="text-2xl font-black text-slate-900 block">₹3.82 Cr</span>
          <span className="text-[11px] text-blue-600 font-semibold">Across all sellers</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Admin Commission Cut</span>
          <span className="text-2xl font-black text-amber-600 block">₹38.2 Lakhs</span>
          <span className="text-[11px] text-amber-700 font-semibold">Platform Net Revenue (10%)</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Withdrawals</span>
          <span className="text-2xl font-black text-emerald-600 block">{pendingPayoutsCount}</span>
          <span className="text-[11px] text-slate-500 font-semibold">Awaiting settlement</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('commission')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'commission'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Commission Models</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'payouts'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Banknote className="w-4 h-4" />
          <span>Payout Disbursements</span>
          {pendingPayoutsCount > 0 && (
            <span className="ml-1 text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
              {pendingPayoutsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sellers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'sellers'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Seller Compliance</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'coupons'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Coupons & Deals</span>
          <span className="ml-1 text-[11px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
            {couponsList.length}
          </span>
        </button>
      </div>

      {/* TAB 1: COMMISSION MODELS (Percentage based, Category based, Seller based) */}
      {activeTab === 'commission' && (
        <div className="space-y-6">
          
          {/* Overview of 3 Commission Tiers */}
          <div className="bg-gradient-to-r from-amber-50/70 via-orange-50/50 to-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Percent className="w-4 h-4 text-orange-600" />
              <span>3-Tier Multivendor Commission Hierarchy</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              <strong>Calculation Precedence:</strong> When a customer buys a product, BazaarHub evaluates:
              <br />
              1. <strong>Seller-Based Override:</strong> Custom store take-rate (highest priority).
              <br />
              2. <strong>Category-Based Rate:</strong> Specific category margin (e.g. Fashion 15%, Mobiles 6%).
              <br />
              3. <strong>Percentage-Based Default:</strong> Global marketplace default take-rate (fallback).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 1. PERCENTAGE BASED (Global Default) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">1. Percentage Based</h4>
                  <p className="text-[11px] text-slate-500">Global fallback commission rate</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full">
                  Base Rule
                </span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Global Marketplace Cut (%)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={globalRateInput}
                      onChange={(e) => setGlobalRateInput(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-amber-500"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                  </div>
                  <button
                    onClick={handleSaveGlobalRate}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Applies to all products unless a category-level or seller-level override is configured.
                </p>
              </div>

              {/* Example Card from User's Prompt */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 text-[11px] block uppercase tracking-wider">Example Breakdown</span>
                <p className="text-slate-600">
                  Product Price = <strong>₹1,000</strong>
                </p>
                <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200">
                  <span className="text-amber-700 font-bold">Admin Fee ({globalRateInput}%): ₹{(1000 * (globalRateInput / 100)).toFixed(0)}</span>
                  <span className="text-emerald-700 font-bold">Seller Gets: ₹{(1000 - 1000 * (globalRateInput / 100)).toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* 3. SELLER BASED OVERRIDES */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">3. Seller Based Overrides</h4>
                  <p className="text-[11px] text-slate-500">Custom negotiated commission rates for specific merchant stores</p>
                </div>
                <button
                  onClick={handleSaveSellerRates}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Seller Rates
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Merchant Store</th>
                      <th className="py-2.5 px-3">Contract Notes</th>
                      <th className="py-2.5 px-3">Custom Rate (%)</th>
                      <th className="py-2.5 px-3 text-right">Example on ₹1,000 Sale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {sellerRatesInput.map((seller) => (
                      <tr key={seller.sellerId} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{seller.sellerName}</td>
                        <td className="py-2.5 px-3 text-slate-500">{seller.notes}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5 w-24">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={seller.rate}
                              onChange={(e) => handleSellerRateChange(seller.sellerId, e.target.value)}
                              className="w-16 p-1 border border-slate-300 rounded font-bold text-slate-900 text-center"
                            />
                            <span className="font-bold text-slate-400">%</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="font-bold text-emerald-700">₹{(1000 - 1000 * (seller.rate / 100)).toFixed(0)}</span>
                          <span className="text-[10px] text-slate-400 ml-1">(-₹{(1000 * (seller.rate / 100)).toFixed(0)})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* 2. CATEGORY BASED COMMISSION TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">2. Category Based Commission Rates</h4>
                <p className="text-xs text-slate-500">
                  Different margin take-rates assigned per product department (Mobiles 6%, Electronics 8%, Fashion 15%, etc.)
                </p>
              </div>

              <button
                onClick={handleSaveCategoryRates}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save Category Rates
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categoryRatesInput.map((cat) => (
                <div key={cat.categorySlug} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{cat.categoryName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">/{cat.categorySlug}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={cat.rate}
                      onChange={(e) => handleCategoryRateChange(cat.categorySlug, e.target.value)}
                      className="w-14 p-1.5 border border-slate-300 rounded-lg bg-white font-bold text-slate-900 text-center text-xs"
                    />
                    <span className="font-bold text-slate-500 text-xs">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PAYOUT DISBURSEMENTS */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Merchant Withdrawal Requests & Payout Settlement
              </h3>
              <p className="text-xs text-slate-500">
                Review and approve vendor net earnings disbursements to verified bank accounts / UPI
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total {payoutsList.length} requests
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Payout ID & Date</th>
                  <th className="py-3 px-4">Seller Store</th>
                  <th className="py-3 px-4">Withdrawal Amount</th>
                  <th className="py-3 px-4">Beneficiary Account</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Settlement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payoutsList.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{po.id || po.payoutNumber}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(po.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      {po.sellerName || 'TechWorld Store'}
                    </td>

                    <td className="py-3 px-4 font-black text-slate-950 text-sm">
                      ₹{(po.netAmount || po.amount).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-[11px]">
                      {po.destinationAccount?.bankName 
                        ? `${po.destinationAccount.bankName} (${po.destinationAccount.accountNumber})` 
                        : po.destinationAccount?.upiId || 'Verified Account'}
                    </td>

                    <td className="py-3 px-4 capitalize font-semibold">
                      {po.method.replace('_', ' ')}
                    </td>

                    <td className="py-3 px-4">
                      {po.status === 'completed' && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          Disbursed ✓
                        </span>
                      )}
                      {po.status === 'processing' && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                          Processing
                        </span>
                      )}
                      {po.status === 'requested' && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-[10px]">
                          Pending Approval
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {po.status !== 'completed' ? (
                        <button
                          onClick={() => handleDisbursePayout(po.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                        >
                          Approve & Disburse
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500">
                          {po.transactionReference || 'CMS-SETTLED'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SELLER COMPLIANCE & VERIFICATION */}
      {activeTab === 'sellers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Merchant Sellers & Compliance Audit
              </h2>
              <p className="text-xs text-slate-500">
                Manage merchant storefront status, ratings, and commission settlements
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Merchant Store</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Catalog Size</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sellersList.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={seller.logo}
                        alt={seller.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{seller.name}</span>
                        <span className="text-[10px] text-slate-400">{seller.slug}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{seller.location}</td>
                    <td className="py-3 px-4 font-bold text-amber-600">★ {seller.rating}</td>
                    <td className="py-3 px-4 font-semibold">{seller.productsCount.toLocaleString('en-IN')} items</td>
                    <td className="py-3 px-4">
                      {seller.verified ? (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleVerify(seller.id)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                          seller.verified
                            ? 'border border-slate-300 text-slate-600 hover:bg-slate-100'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {seller.verified ? 'Revoke Badge' : 'Approve Seller'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS & DISCOUNTS ENGINE */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  <span>Platform Promotional Coupons</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage percentage and fixed-amount discounts, cart thresholds, usage limits, and validity windows.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCouponModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            {/* Coupons Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3 px-3">Code & Description</th>
                    <th className="pb-3 px-3">Discount Type</th>
                    <th className="pb-3 px-3">Min Order</th>
                    <th className="pb-3 px-3">Max Cap</th>
                    <th className="pb-3 px-3">Redemption</th>
                    <th className="pb-3 px-3">Validity</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {couponsList.map((coupon) => (
                    <tr key={coupon.id || coupon._id || coupon.code} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md text-xs tracking-wider">
                            {coupon.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-xs line-clamp-1">{coupon.description}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          coupon.discountType === 'percentage'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT`}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">
                        ₹{(coupon.minOrderAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        {coupon.maxDiscountAmount ? `₹${coupon.maxDiscountAmount.toLocaleString('en-IN')}` : 'No Limit'}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        <span className="font-semibold text-slate-900">{coupon.usedCount || 0}</span>
                        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ' (Unlimited)'}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                        <div>{coupon.startDate ? new Date(coupon.startDate).toLocaleDateString('en-IN') : 'Now'}</div>
                        <div className="text-slate-400">to {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString('en-IN') : 'Permanent'}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          coupon.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleToggleCoupon(coupon)}
                          className="px-2.5 py-1 text-[11px] font-bold border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          {coupon.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(coupon)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors inline-flex align-middle cursor-pointer"
                          title="Delete coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Create New Coupon</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCouponModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SAVE20"
                    className="w-full px-3 py-2 uppercase font-black tracking-wider bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Type *</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Value * {newCoupon.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                    placeholder="20"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCoupon.minOrderAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })}
                    placeholder="500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCoupon.maxDiscountAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscountAmount: e.target.value })}
                    placeholder="500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newCoupon.startDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={newCoupon.endDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                    placeholder="500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <input
                  type="text"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  placeholder="e.g. 20% discount on order above ₹500"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save & Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
