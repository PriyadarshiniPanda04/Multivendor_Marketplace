import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Search, 
  Package, 
  RotateCcw, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Store, 
  ChevronDown, 
  ChevronRight, 
  Phone, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  X, 
  Clock, 
  FileText,
  LifeBuoy
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function HelpCenterPage() {
  const { showToast } = useToast() || { showToast: () => {} };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Live Chat state
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hi there! Welcome to BazaarHub Support. How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Ticket Form state
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    orderId: '',
    issueType: 'Order & Delivery',
    message: ''
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(null);

  const categories = [
    {
      id: 'orders',
      title: 'Orders & Tracking',
      icon: Package,
      desc: 'Track packages, modify order items, or cancel purchases.',
      color: 'blue'
    },
    {
      id: 'returns',
      title: 'Returns & Refunds',
      icon: RotateCcw,
      desc: 'Return policies, reverse pickup status, and refund SLA.',
      color: 'emerald'
    },
    {
      id: 'payments',
      title: 'Payments & Invoices',
      icon: CreditCard,
      desc: 'UPI, credit/debit cards, EMI, and GST tax invoice downloads.',
      color: 'indigo'
    },
    {
      id: 'shipping',
      title: 'Shipping & Delivery',
      icon: Truck,
      desc: 'Delivery speeds, pincode serviceability, and courier updates.',
      color: 'amber'
    },
    {
      id: 'account',
      title: 'Account & Security',
      icon: ShieldCheck,
      desc: 'Manage profile, passwords, addresses, and 2-step verification.',
      color: 'purple'
    },
    {
      id: 'seller',
      title: 'Sell on BazaarHub',
      icon: Store,
      desc: 'Vendor onboarding, seller policies, commission, and payouts.',
      color: 'rose'
    }
  ];

  const faqs = [
    {
      category: 'orders',
      question: 'How do I track my order status in real time?',
      answer: 'You can track your order directly by visiting the "Track Order" link in the top bar or going to Account > Orders. Every stage from Order Confirmed, Packed, Shipped to Out for Delivery has live courier tracking with courier partner links.'
    },
    {
      category: 'orders',
      question: 'Can I cancel an order after it has been placed?',
      answer: 'Yes! You can cancel your order anytime before it is dispatched from the warehouse. Navigate to "My Orders", choose the item, and click "Cancel Item". If already dispatched, you can decline delivery at your doorstep for an instant refund.'
    },
    {
      category: 'returns',
      question: 'What is the return and replacement window?',
      answer: 'Most electronics, gadgets, and apparel have a 7-day to 10-day replacement window. If the product arrives damaged, defective, or incorrect, you can request a hassle-free replacement or full refund directly from the order details page.'
    },
    {
      category: 'returns',
      question: 'How long does it take to receive my refund?',
      answer: 'Refunds for prepaid orders (UPI, Card, Net Banking) are initiated instantly upon courier pickup and credited to your original payment method within 2 to 4 business days. For Cash on Delivery, refunds are sent via direct bank transfer or UPI ID within 24 hours.'
    },
    {
      category: 'payments',
      question: 'Where can I download my GST tax invoice?',
      answer: 'Once your order is delivered, you can download the official GST invoice PDF by going to "My Orders" > selecting your order > clicking "Download GST Invoice". It includes itemized tax breakdowns and vendor GSTIN.'
    },
    {
      category: 'shipping',
      question: 'What are the delivery charges and timelines?',
      answer: 'Standard delivery is 100% Free on all orders over ₹499. Orders below ₹499 incur a nominal ₹40 shipping fee. Most metro deliveries arrive within 24-48 hours, while other regional destinations take 3-5 business days.'
    },
    {
      category: 'account',
      question: 'How do I update my registered phone number or shipping address?',
      answer: 'Head to "My Account" > "Addresses" to add, edit, or set default delivery addresses. To update personal info like mobile number and email, navigate to "Account Settings" and verify via SMS OTP.'
    },
    {
      category: 'seller',
      question: 'How do I register as a seller and list products on BazaarHub?',
      answer: 'Click "Become a Seller" in the navigation bar. You only need your GSTIN, PAN card, and active bank account. Approval takes less than 24 hours, after which you get complete access to the Seller Dashboard to upload products and manage inventory.'
    }
  ];

  // Filter FAQs based on category and search query
  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    // Simulated intelligent bot reply
    setTimeout(() => {
      let botResponse = "Thank you for reaching out! A customer support representative has been notified and will review your inquiry shortly.";
      const query = userText.toLowerCase();

      if (query.includes('track') || query.includes('where is my order') || query.includes('status')) {
        botResponse = "You can track any active order by clicking 'Track Order' in the top header or visiting /orders. Courier dispatch tracking updates every few hours.";
      } else if (query.includes('refund') || query.includes('return') || query.includes('money')) {
        botResponse = "Returns are valid up to 7-10 days from delivery date. Once picked up, refunds are credited within 24-48 business hours to your original payment method.";
      } else if (query.includes('cancel')) {
        botResponse = "To cancel an order before dispatch, go to My Orders > Select Item > Cancel Order. Prepaid amounts are refunded immediately.";
      } else if (query.includes('human') || query.includes('agent') || query.includes('call')) {
        botResponse = "You can call our 24x7 toll-free helpline directly at 1800-208-9898 for immediate assistance from our senior support desk.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
    setTicketSubmitted({
      id: ticketId,
      ...ticketForm
    });
    if (showToast) showToast(`Support ticket ${ticketId} created successfully!`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* HERO SECTION WITH SEARCH */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
            <LifeBuoy className="w-3.5 h-3.5" />
            24x7 Customer Help Desk
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            How can we help you today?
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Find answers to common questions, track shipments, manage refunds, or get in touch with our live support staff.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative shadow-2xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search help topics (e.g., track order, return policy, refund status)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-blue-500/30 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* QUICK CATEGORIES */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Explore Help Topics</h2>
              <p className="text-xs text-slate-500">Select a category to view relevant guides and answers</p>
            </div>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Show All Categories
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white group hover:shadow-md ${
                    isSelected 
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm' 
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                          {cat.title}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
                <p className="text-xs text-slate-500">
                  Showing {filteredFaqs.length} help articles
                  {selectedCategory !== 'all' ? ` for "${selectedCategory}"` : ''}
                </p>
              </div>
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-800">No matching help articles found</h4>
                <p className="text-xs text-slate-500 mt-1">Try another keyword or raise a support ticket below.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden transition-all shadow-xs"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                      >
                        <span className="font-semibold text-sm sm:text-base text-slate-800">
                          {faq.question}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/30">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SIDEBAR: CONTACT QUICK CARDS */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Live Chat Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md shadow-blue-500/10">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-base mb-1">Live Chat Assistance</h3>
              <p className="text-xs text-blue-100 mb-4 leading-relaxed">
                Connect with our automated virtual assistant or request an immediate agent callback.
              </p>
              <button
                onClick={() => setShowChatModal(true)}
                className="w-full py-2.5 px-4 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl transition-all shadow-xs"
              >
                Start Live Chat Now
              </button>
            </div>

            {/* Helpline Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">24x7 Customer Care</h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Call our toll-free customer support desk anytime for instant telephone support.
              </p>
              <a
                href="tel:18002089898"
                className="inline-flex items-center gap-2 font-mono text-sm font-bold text-emerald-600 hover:text-emerald-700"
              >
                <Phone className="w-4 h-4" /> 1800-208-9898
              </a>
            </div>

            {/* Quick Links */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Self-Service Actions</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                <li>
                  <Link to="/orders" className="flex items-center justify-between hover:text-blue-600 transition-colors">
                    <span>View & Track Orders</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link to="/compare" className="flex items-center justify-between hover:text-blue-600 transition-colors">
                    <span>Compare Products</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="flex items-center justify-between hover:text-blue-600 transition-colors">
                    <span>Manage Account & Security</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* TICKET SUBMISSION FORM */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Need further assistance?</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">Submit a Support Ticket</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Can't find what you need? Send our specialized grievance desk an inquiry and we'll reply within 4 hours.
            </p>
          </div>

          {ticketSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center max-w-lg mx-auto animate-in fade-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-emerald-900">Support Ticket Created</h4>
              <p className="text-xs text-emerald-700 mt-1 mb-4">
                Your ticket has been logged under reference number:
              </p>
              <div className="inline-block bg-white px-4 py-2 rounded-xl border border-emerald-300 font-mono font-bold text-sm text-emerald-800 shadow-xs mb-4">
                {ticketSubmitted.id}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                A confirmation has been dispatched to <b>{ticketSubmitted.email}</b>. Our customer advocacy team will respond within 4 hours.
              </p>
              <button
                onClick={() => {
                  setTicketSubmitted(null);
                  setTicketForm({
                    name: '',
                    email: '',
                    orderId: '',
                    issueType: 'Order & Delivery',
                    message: ''
                  });
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.name}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={ticketForm.email}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="you@domain.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Order ID (Optional)</label>
                <input
                  type="text"
                  value={ticketForm.orderId}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, orderId: e.target.value }))}
                  placeholder="e.g. ORD-98124"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category *</label>
                <select
                  value={ticketForm.issueType}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, issueType: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Order & Delivery">Order & Delivery</option>
                  <option value="Return & Replacement">Return & Replacement</option>
                  <option value="Refund Not Credited">Refund Not Credited</option>
                  <option value="Payment / Double Deduction">Payment / Double Deduction</option>
                  <option value="Seller Grievance">Seller Grievance</option>
                  <option value="Account Access">Account Access</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Describe your query or issue *</label>
                <textarea
                  required
                  rows={4}
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Please provide full details so we can resolve this as quickly as possible..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 inline-flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Support Ticket
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

      {/* LIVE CHAT MODAL */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-end sm:justify-end sm:pr-8 sm:pb-8 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm h-[520px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    BH
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">BazaarHub Support</h4>
                  <span className="text-[10px] text-blue-100 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> Online Now
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Pills */}
            <div className="p-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto text-[11px] text-slate-600">
              <button
                onClick={() => setChatInput('Where is my order?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
              >
                Track Order
              </button>
              <button
                onClick={() => setChatInput('How do refunds work?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
              >
                Refund SLA
              </button>
              <button
                onClick={() => setChatInput('Talk to a human agent')}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
              >
                Human Agent
              </button>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
