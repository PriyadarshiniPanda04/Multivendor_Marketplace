import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Store, 
  Edit, 
  Trash2, 
  ArrowLeft,
  X,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
  CreditCard,
  AlertCircle,
  Eye,
  Check,
  ArrowRight,
  Banknote,
  Percent,
  Calculator,
  Download
} from 'lucide-react';
import { PRODUCTS, SELLERS } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { returnService, RETURN_STEPS } from '../services/returnService';
import { commissionService } from '../services/commissionService';
import ReturnTrackingModal from '../components/ReturnTrackingModal';
import PayoutRequestModal from '../components/PayoutRequestModal';

export default function SellerDashboardPage() {
  const { user, isSeller } = useAuth();

  // Customers should never view the seller dashboard
  if (user && user.role === 'customer') {
    return <Navigate to="/account" replace />;
  }

  const { addToast } = useToast();
  const currentSeller = SELLERS[0]; // TechWorld Store

  const [activeTab, setActiveTab] = useState('financials'); // 'financials' | 'catalog' | 'returns'
  const [productsList, setProductsList] = useState(
    PRODUCTS.filter((p) => p.sellerId === currentSeller.id)
  );

  // Financials & Commission State
  const [financials, setFinancials] = useState(() => 
    commissionService.getSellerFinancials(currentSeller.id)
  );
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // Commission Calculator Simulation State (Pre-filled with User's Example)
  const [simPrice, setSimPrice] = useState('1000');
  const [simCategory, setSimCategory] = useState('electronics');
  const [simResult, setSimResult] = useState(() => 
    commissionService.calculateCommission(1000, 'electronics', currentSeller.id)
  );

  // Returns state
  const [returnsList, setReturnsList] = useState([]);
  const [returnSearch, setReturnSearch] = useState('');
  const [returnStatusFilter, setReturnStatusFilter] = useState('all');
  const [selectedTrackingReturn, setSelectedTrackingReturn] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'electronics',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  });

  const refreshAllData = () => {
    setReturnsList(returnService.getReturns());
    setFinancials(commissionService.getSellerFinancials(currentSeller.id));
  };

  useEffect(() => {
    refreshAllData();

    const handleReturnUpdate = () => refreshAllData();
    const handlePayoutUpdate = () => refreshAllData();
    const handleCommissionUpdate = () => refreshAllData();

    window.addEventListener('bazaarhub_return_updated', handleReturnUpdate);
    window.addEventListener('bazaarhub_payout_updated', handlePayoutUpdate);
    window.addEventListener('bazaarhub_commission_updated', handleCommissionUpdate);

    return () => {
      window.removeEventListener('bazaarhub_return_updated', handleReturnUpdate);
      window.removeEventListener('bazaarhub_payout_updated', handlePayoutUpdate);
      window.removeEventListener('bazaarhub_commission_updated', handleCommissionUpdate);
    };
  }, []);

  // Update simulator whenever price or category changes
  useEffect(() => {
    const res = commissionService.calculateCommission(
      Number(simPrice) || 0,
      simCategory,
      currentSeller.id
    );
    setSimResult(res);
  }, [simPrice, simCategory]);

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const created = {
      id: 'prod-' + Date.now(),
      name: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newProduct.category,
      brand: currentSeller.name.split(' ')[0],
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice || newProduct.price * 1.3),
      discount: Math.round(((Number(newProduct.originalPrice) - Number(newProduct.price)) / Number(newProduct.originalPrice)) * 100) || 20,
      rating: 4.8,
      reviewCount: 1,
      stock: Number(newProduct.stock) || 25,
      images: [newProduct.image],
      sellerId: currentSeller.id,
      sellerName: currentSeller.name,
      freeDelivery: true,
      description: newProduct.description || 'High performance genuine product with warranty.'
    };

    setProductsList([created, ...productsList]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      category: 'electronics',
      price: '',
      originalPrice: '',
      stock: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    });
    addToast('Product listed successfully on BazaarHub!', 'success');
  };

  const handleDeleteProduct = (id) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id));
    addToast('Product removed from catalog.', 'info');
  };

  const handleUpdateReturnStatus = async (returnId, newStatus, message) => {
    try {
      await returnService.updateReturnStatus(returnId, newStatus);
      refreshAllData();
      addToast(message || `Return updated to ${newStatus.replace('_', ' ')}!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to update return status.', 'error');
    }
  };

  // Filter returns
  const filteredReturns = returnsList.filter((r) => {
    const matchesSearch = 
      (r.id && r.id.toLowerCase().includes(returnSearch.toLowerCase())) ||
      (r.orderId && r.orderId.toLowerCase().includes(returnSearch.toLowerCase())) ||
      (r.product?.name && r.product.name.toLowerCase().includes(returnSearch.toLowerCase())) ||
      (r.customerName && r.customerName.toLowerCase().includes(returnSearch.toLowerCase())) ||
      (r.reason && r.reason.toLowerCase().includes(returnSearch.toLowerCase()));

    const matchesStatus = returnStatusFilter === 'all' || r.status === returnStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingReviewCount = returnsList.filter((r) => r.status === 'requested' || r.status === 'seller_review').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-[#131921] text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-orange-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {currentSeller.name} • Merchant Portal
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Verified Indian Seller • 3-Tier Commission Settled • Escrow Protected
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/seller/${currentSeller.id}`}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            View Public Storefront
          </Link>
          <button
            onClick={() => setShowPayoutModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Banknote className="w-4 h-4" /> Withdraw Funds
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-slate-950 shadow flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* EXACT USER REQUEST: Total Sales → Commission → Net Earnings → Payout */}
      {/* ============================================================ */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Seller Revenue & Settlement Pipeline
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            3-Tier Commission: Percentage &bull; Category &bull; Seller Negotiated
          </span>
        </div>

        {/* The 4-Stage Connected Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          
          {/* STAGE 1: Total Sales */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2 relative group hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">1. Total Sales</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                ₹
              </div>
            </div>
            <span className="text-2xl font-black text-slate-950 block">
              ₹{financials.pipeline.totalSales.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Gross sales across {financials.ledger.length} verified orders
            </span>
            {/* Arrow on desktop */}
            <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-xs items-center justify-center text-slate-400">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* STAGE 2: Commission */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4.5 space-y-2 relative group hover:border-amber-300 transition-colors">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs font-bold uppercase tracking-wider">2. Commission</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-amber-700 block">
              -₹{financials.pipeline.totalCommission.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-amber-900/80 block">
              Marketplace fee (Category / Store rate)
            </span>
            {/* Arrow on desktop */}
            <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-xs items-center justify-center text-slate-400">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* STAGE 3: Net Earnings */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4.5 space-y-2 relative group hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-xs font-bold uppercase tracking-wider">3. Net Earnings</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Check className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-emerald-700 block">
              ₹{financials.pipeline.netEarnings.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-900/80 block">
              Seller retainable earnings (Sales - Fee)
            </span>
            {/* Arrow on desktop */}
            <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-xs items-center justify-center text-slate-400">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* STAGE 4: Payout */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-4.5 space-y-2 relative group">
            <div className="flex items-center justify-between text-teal-800">
              <span className="text-xs font-bold uppercase tracking-wider">4. Payout Balance</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <Banknote className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-950 block">
                ₹{financials.pipeline.availableBalance.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-emerald-700">Available</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500">
                Paid: ₹{financials.pipeline.totalPaidOut.toLocaleString('en-IN')}
              </span>
              <button
                onClick={() => setShowPayoutModal(true)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                Withdraw &rarr;
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('financials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'financials'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Banknote className="w-4 h-4" />
          <span>Earnings & Payouts</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Product Catalog</span>
          <span className="ml-1 text-[11px] bg-slate-700 text-white px-2 py-0.5 rounded-full">
            {productsList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'returns'
              ? 'bg-orange-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Returns & Refunds</span>
          {pendingReviewCount > 0 && (
            <span className="ml-1 text-[11px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
              {pendingReviewCount} Action Needed
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: FINANCIALS & COMMISSION BREAKDOWN */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          
          {/* Interactive Commission Simulator Card (Visualizing the User's exact prompt example) */}
          <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 border border-blue-200 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-blue-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Live Commission Calculator & Rule Engine
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Test product pricing against the 3 commission tiers: Percentage &bull; Category &bull; Seller
                  </p>
                </div>
              </div>

              <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
                Live Rule Engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              
              {/* Inputs */}
              <div className="md:col-span-5 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Price (₹)</label>
                  <input
                    type="number"
                    value={simPrice}
                    onChange={(e) => setSimPrice(e.target.value)}
                    placeholder="1000"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={simCategory}
                    onChange={(e) => setSimCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 text-xs focus:outline-none focus:border-blue-600"
                  >
                    <option value="electronics">Electronics (8%)</option>
                    <option value="mobiles">Mobiles (6%)</option>
                    <option value="fashion">Fashion (15%)</option>
                    <option value="beauty">Beauty (12%)</option>
                    <option value="kitchen">Home & Kitchen (10%)</option>
                    <option value="books">Books (5%)</option>
                  </select>
                </div>
              </div>

              {/* Simulation Result Boxes: Prompt Example Showcase */}
              <div className="md:col-span-7 bg-white p-4 rounded-xl border border-blue-200/80 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Applied Rule: <strong className="text-blue-700">{simResult.ruleApplied}</strong></span>
                  <span>Take-Rate: <strong>{simResult.rate}%</strong></span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Product Price</span>
                    <span className="text-base font-black text-slate-900 block mt-0.5">
                      ₹{simResult.grossPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                    <span className="text-[10px] text-amber-700 block font-medium">Marketplace Fee</span>
                    <span className="text-base font-black text-amber-700 block mt-0.5">
                      ₹{simResult.commissionAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-emerald-800 block font-bold">Seller Receives</span>
                    <span className="text-base font-black text-emerald-700 block mt-0.5">
                      ₹{simResult.netEarnings.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Itemized Sales & Commission Deductions Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Itemized Sales & Commission Settlement Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Every order item, gross sale, applied admin commission rate, and your net payout entitlement
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Ledger
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order & Date</th>
                    <th className="py-3 px-4">Sold Product</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4">Gross Sale</th>
                    <th className="py-3 px-4">Commission Rule</th>
                    <th className="py-3 px-4">Admin Cut</th>
                    <th className="py-3 px-4 font-black text-slate-900">Net Seller Earning</th>
                    <th className="py-3 px-4 text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {financials.ledger.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{row.orderId}</span>
                        <span className="text-[10px] text-slate-400">{row.date}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block truncate max-w-xs">{row.product.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{row.category}</span>
                      </td>

                      <td className="py-3 px-4 font-semibold">{row.quantity}</td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₹{row.grossSale.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.ruleType === 'seller'
                            ? 'bg-purple-100 text-purple-800'
                            : row.ruleType === 'category'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {row.ruleApplied}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-amber-700">
                        -₹{row.commissionAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 font-black text-emerald-600 text-sm">
                        ₹{row.netEarnings.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          Settled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payout & Withdrawal History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span>Withdrawal & Payout History</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Transfers initiated to your registered bank account and UPI
                </p>
              </div>

              <button
                onClick={() => setShowPayoutModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Request New Payout
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Payout ID</th>
                    <th className="py-3 px-4">Requested On</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Transaction Ref</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {financials.payouts.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{po.id || po.payoutNumber}</td>
                      <td className="py-3 px-4">
                        {new Date(po.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4 font-black text-slate-950 text-sm">
                        ₹{(po.netAmount || po.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-[11px]">
                        {po.destinationAccount?.bankName 
                          ? `${po.destinationAccount.bankName} (${po.destinationAccount.accountNumber})` 
                          : po.destinationAccount?.upiId || 'Merchant Bank'}
                      </td>
                      <td className="py-3 px-4 capitalize font-semibold">
                        {po.method.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {po.transactionReference || 'Pending'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {po.status === 'completed' && (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                            Disbursed ✓
                          </span>
                        )}
                        {po.status === 'processing' && (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] animate-pulse">
                            Processing
                          </span>
                        )}
                        {po.status === 'requested' && (
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-[10px]">
                            Pending Admin
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PRODUCT CATALOG */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Manage Your Product Catalog
              </h2>
              <p className="text-xs text-slate-500">Update pricing, replenish stocks, or remove discontinued inventory</p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Total {productsList.length} products
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Est. Net Earning</th>
                  <th className="py-3 px-4">Inventory</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {productsList.map((prod) => {
                  const quote = commissionService.calculateCommission(prod.price, prod.category, currentSeller.id);
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-10 object-contain rounded border border-slate-200 p-0.5 shrink-0 bg-white"
                        />
                        <div className="min-w-0 max-w-sm">
                          <span className="font-bold text-slate-900 truncate block">{prod.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {prod.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize font-medium">{prod.category}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{prod.price.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">
                        ₹{quote.netEarnings.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">(-{quote.rate}%)</span>
                      </td>
                      <td className="py-3 px-4 font-semibold">{prod.stock || 20} units</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RETURNS & REFUNDS */}
      {activeTab === 'returns' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-orange-500" />
                  <span>Customer Return & Refund Requests</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Review return claims, inspect customer photo proofs, schedule courier pickup, and release refunds
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search returns..."
                    value={returnSearch}
                    onChange={(e) => setReturnSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-orange-500 w-44"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={returnStatusFilter}
                  onChange={(e) => setReturnStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-orange-500 bg-white"
                >
                  <option value="all">All Stages</option>
                  <option value="requested">1. Return Requested</option>
                  <option value="seller_review">2. Seller Review</option>
                  <option value="approved">3. Approved</option>
                  <option value="pickup">4. Pickup</option>
                  <option value="refunded">5. Refunded</option>
                </select>
              </div>
            </div>

            {filteredReturns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Claim ID & Date</th>
                      <th className="py-3 px-4">Product & Customer</th>
                      <th className="py-3 px-4">Return Reason</th>
                      <th className="py-3 px-4">Customer Proof & Notes</th>
                      <th className="py-3 px-4">Refund Amount</th>
                      <th className="py-3 px-4">5-Step Status</th>
                      <th className="py-3 px-4 text-right">Seller Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredReturns.map((ret) => {
                      const currentStatus = ret.status || 'requested';

                      return (
                        <tr key={ret.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 align-top">
                            <span className="font-mono font-bold text-slate-900 block">{ret.id}</span>
                            <span className="text-[10px] text-slate-400 font-mono block">Order: {ret.orderId}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(ret.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </td>

                          <td className="py-3 px-4 align-top">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={ret.product?.image || ret.product?.images?.[0]}
                                alt={ret.product?.name}
                                className="w-10 h-10 object-contain rounded border border-slate-200 p-0.5 shrink-0 bg-white"
                              />
                              <div className="min-w-0 max-w-xs">
                                <span className="font-bold text-slate-900 block truncate">{ret.product?.name}</span>
                                <span className="text-[10px] text-slate-500 block">Customer: {ret.customerName}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 align-top">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              ret.reason === 'Wrong product'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : ret.reason === 'Damaged product'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : ret.reason === 'Product not as described'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-slate-100 text-slate-800 border border-slate-200'
                            }`}>
                              {ret.reason}
                            </span>
                          </td>

                          <td className="py-3 px-4 align-top max-w-xs">
                            <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                              "{ret.customerComments || 'No remarks added'}"
                            </p>
                            {ret.images && ret.images.length > 0 && (
                              <div className="flex gap-1.5 mt-1.5">
                                {ret.images.map((img, i) => (
                                  <img key={i} src={img} alt="Proof" className="w-7 h-7 rounded object-cover border border-slate-300" />
                                ))}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4 align-top">
                            <span className="font-bold text-emerald-700 text-sm block">
                              ₹{ret.refundAmount?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 block">{ret.refundMethod}</span>
                          </td>

                          <td className="py-3 px-4 align-top">
                            {currentStatus === 'requested' && (
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-[10px] font-bold block w-fit">
                                1. Return Requested
                              </span>
                            )}
                            {currentStatus === 'seller_review' && (
                              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-[10px] font-bold block w-fit animate-pulse">
                                2. Seller Review
                              </span>
                            )}
                            {currentStatus === 'approved' && (
                              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-bold block w-fit">
                                3. Approved
                              </span>
                            )}
                            {currentStatus === 'pickup' && (
                              <span className="px-2.5 py-1 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-[10px] font-bold block w-fit">
                                4. In Pickup
                              </span>
                            )}
                            {currentStatus === 'refunded' && (
                              <span className="px-2.5 py-1 bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-extrabold block w-fit">
                                5. Refunded ✓
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 align-top text-right space-y-1.5">
                            {currentStatus === 'requested' && (
                              <button
                                onClick={() => handleUpdateReturnStatus(ret.id, 'seller_review', 'Moved to Seller Review.')}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[11px] shadow-2xs transition-colors cursor-pointer"
                              >
                                Start Review
                              </button>
                            )}

                            {currentStatus === 'seller_review' && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleUpdateReturnStatus(ret.id, 'approved', 'Return Approved! Pickup scheduled.')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-2xs transition-colors cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateReturnStatus(ret.id, 'rejected', 'Return request declined.')}
                                  className="px-2 py-1 border border-slate-300 text-slate-600 hover:text-rose-600 rounded-lg text-[11px] cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            )}

                            {currentStatus === 'approved' && (
                              <button
                                onClick={() => handleUpdateReturnStatus(ret.id, 'pickup', 'Courier pickup completed!')}
                                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[11px] shadow-2xs transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                              >
                                <Truck className="w-3 h-3" />
                                <span>Mark Picked Up</span>
                              </button>
                            )}

                            {currentStatus === 'pickup' && (
                              <button
                                onClick={() => handleUpdateReturnStatus(ret.id, 'refunded', `Refund of ₹${ret.refundAmount.toLocaleString('en-IN')} issued!`)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-2xs transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                              >
                                <CreditCard className="w-3 h-3" />
                                <span>Issue Refund</span>
                              </button>
                            )}

                            {currentStatus === 'refunded' && (
                              <span className="text-[11px] font-bold text-emerald-700 block">
                                Settled ({ret.refundTxnId || 'UPI-REF'})
                              </span>
                            )}

                            <button
                              onClick={() => setSelectedTrackingReturn(ret)}
                              className="text-[10px] text-blue-600 hover:underline block font-bold cursor-pointer ml-auto mt-1"
                            >
                              Inspect 5-Step Tracker →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl space-y-2">
                <RotateCcw className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No return requests match filter</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  All customer claims have been reviewed or no return requests have been raised yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-base font-bold text-slate-900">List New Marketplace Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Pro ANC Earbuds"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full border rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border rounded-xl p-2.5"
                  >
                    <option value="electronics">Electronics (8% Admin Cut)</option>
                    <option value="mobiles">Mobiles (6% Admin Cut)</option>
                    <option value="fashion">Fashion (15% Admin Cut)</option>
                    <option value="kitchen">Home & Kitchen (10% Admin Cut)</option>
                    <option value="beauty">Beauty (12% Admin Cut)</option>
                    <option value="books">Books (5% Admin Cut)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full border rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="2499"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full border rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">M.R.P. Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="4999"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="w-full border rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  placeholder="Key features and specifications..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full border rounded-xl p-2.5 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl shadow cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payout Withdrawal Modal */}
      {showPayoutModal && (
        <PayoutRequestModal
          isOpen={showPayoutModal}
          onClose={() => setShowPayoutModal(false)}
          sellerId={currentSeller.id}
          sellerName={currentSeller.name}
          availableBalance={financials.pipeline.availableBalance}
          onPayoutSuccess={() => refreshAllData()}
        />
      )}

      {/* 5-Step Return Tracking Modal */}
      {selectedTrackingReturn && (
        <ReturnTrackingModal
          isOpen={!!selectedTrackingReturn}
          onClose={() => setSelectedTrackingReturn(null)}
          returnItem={selectedTrackingReturn}
          onStatusUpdated={() => {
            refreshAllData();
            const refreshed = returnService.getReturnById(selectedTrackingReturn.id);
            setSelectedTrackingReturn(refreshed);
          }}
        />
      )}

    </div>
  );
}
