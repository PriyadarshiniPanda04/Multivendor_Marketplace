import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ArrowRight, Download, Search, RotateCcw, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { returnService } from '../services/returnService';
import ReturnRequestModal from '../components/ReturnRequestModal';
import ReturnTrackingModal from '../components/ReturnTrackingModal';
import TaxInvoiceModal from '../components/TaxInvoiceModal';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [returnsList, setReturnsList] = useState([]);
  
  // Modals state
  const [requestModalData, setRequestModalData] = useState(null);
  const [trackingModalData, setTrackingModalData] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const loadData = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('bazaarhub_orders') || '[]');
      if (saved.length > 0) {
        setOrders(saved);
      } else {
        const sampleOrders = [
          {
            id: 'ORD-894120',
            date: '28 September 2026',
            items: [
              { product: PRODUCTS[0], quantity: 1 },
              { product: PRODUCTS[5], quantity: 1 }
            ],
            total: PRODUCTS[0].price + PRODUCTS[5].price,
            paymentMethod: 'UPI',
            status: 'Delivered'
          },
          {
            id: 'ORD-723019',
            date: '15 September 2026',
            items: [
              { product: PRODUCTS[12], quantity: 1 }
            ],
            total: PRODUCTS[12].price,
            paymentMethod: 'CARD',
            status: 'Delivered'
          }
        ];
        setOrders(sampleOrders);
      }
    } catch {
      setOrders([]);
    }

    setReturnsList(returnService.getReturns());
  };

  useEffect(() => {
    loadData();

    const handleReturnUpdate = () => {
      setReturnsList(returnService.getReturns());
    };
    window.addEventListener('bazaarhub_return_updated', handleReturnUpdate);
    return () => window.removeEventListener('bazaarhub_return_updated', handleReturnUpdate);
  }, []);

  const getReturnForItem = (orderId, productId) => {
    return returnsList.find(
      (r) => r.orderId === orderId && (r.product?.id === productId || r.product?.name === productId)
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'requested':
        return { label: 'Return: Requested', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'seller_review':
        return { label: 'Return: Seller Review', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'approved':
        return { label: 'Return: Approved', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'pickup':
        return { label: 'Return: Courier Pickup', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'refunded':
        return { label: 'Return: Refunded ✓', color: 'bg-emerald-200 text-emerald-900 border-emerald-300 font-extrabold' };
      default:
        return { label: `Return: ${status}`, color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
    o.items.some((item) => item.product.name.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Page Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Your Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track packages, request returns & refunds, or re-order past purchases
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search all orders..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
            >
              {/* Order Card Header */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Order Placed</span>
                    <span className="font-semibold text-slate-800">{order.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
                    <span className="font-bold text-slate-900">₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Ship To</span>
                    <span className="font-medium text-slate-800">Rahul Verma</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-700 text-xs font-semibold">
                    {order.id}
                  </span>
                  <button
                    onClick={() => setInvoiceOrder(order)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    title="View & Download GST Tax Invoice"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Tax Invoice</span>
                  </button>
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-orange-600 font-semibold hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Order Card Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {order.status || 'Confirmed'}
                    </span>
                    <span className="text-xs text-slate-500">
                      Package was handed directly to resident • 7-day hassle-free returns
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInvoiceOrder(order)}
                      className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 font-bold text-xs rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Download Flipkart-style GST Tax Invoice"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Invoice</span>
                    </button>

                    <Link
                      to={`/orders/${order.id}`}
                      className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Package</span>
                    </Link>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="divide-y divide-slate-100">
                  {order.items.map(({ product, quantity }) => {
                    const existingReturn = getReturnForItem(order.id, product.id);
                    const badge = existingReturn ? getStatusBadge(existingReturn.status) : null;

                    return (
                      <div key={product.id} className="py-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.images?.[0] || product.image}
                            alt={product.name}
                            className="w-14 h-14 object-contain rounded border border-slate-200 p-1 shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              to={`/product/${product.id}`}
                              className="font-semibold text-slate-900 hover:text-orange-600 line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <span className="text-slate-500 block">
                              Qty: {quantity} • Sold by {product.sellerName || 'TechWorld Store'} • ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            
                            {/* Return Status Indicator */}
                            {existingReturn && (
                              <div className="mt-1 flex items-center gap-2">
                                <span className={`inline-block border px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.color}`}>
                                  {badge.label}
                                </span>
                                <button
                                  onClick={() => setTrackingModalData(existingReturn)}
                                  className="text-blue-600 hover:underline text-[10px] font-bold cursor-pointer"
                                >
                                  View 5-Step Return Tracker →
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Item Actions: Return / Buy again */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          {existingReturn ? (
                            <button
                              onClick={() => setTrackingModalData(existingReturn)}
                              className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-md font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Track Return</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setRequestModalData({ orderId: order.id, product })}
                              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Select Wrong product, Damaged, Not as described, or Other"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                              <span>Request Return</span>
                            </button>
                          )}

                          <Link
                            to={`/product/${product.id}`}
                            className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Buy again
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't placed any orders yet. Discover trending deals and top-rated electronics now.
            </p>
            <Link
              to="/shop"
              className="inline-block px-5 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-md shadow"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Customer Return Request Modal */}
      {requestModalData && (
        <ReturnRequestModal
          isOpen={!!requestModalData}
          onClose={() => setRequestModalData(null)}
          orderId={requestModalData.orderId}
          product={requestModalData.product}
          onReturnSubmitted={(newReturn) => {
            setReturnsList(returnService.getReturns());
            setTrackingModalData(newReturn);
          }}
        />
      )}

      {/* 5-Step Return Tracking Modal */}
      {trackingModalData && (
        <ReturnTrackingModal
          isOpen={!!trackingModalData}
          onClose={() => setTrackingModalData(null)}
          returnItem={trackingModalData}
          onStatusUpdated={(updated) => {
            setReturnsList(returnService.getReturns());
            setTrackingModalData(updated);
          }}
        />
      )}

      {/* Flipkart-Style Official GST Tax Invoice Modal */}
      <TaxInvoiceModal
        isOpen={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
        order={invoiceOrder}
      />

    </div>
  );
}
