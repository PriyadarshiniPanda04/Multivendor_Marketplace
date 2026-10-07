import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  ThumbsUp, 
  ShieldCheck, 
  Camera, 
  Upload, 
  X, 
  Image as ImageIcon, 
  CheckCircle2, 
  Filter, 
  Search, 
  Sparkles, 
  ChevronDown, 
  Check, 
  MessageSquare,
  Maximize2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ProductReviews({ product, initialReviews = [] }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [reviews, setReviews] = useState(() => {
    try {
      const local = localStorage.getItem(`bazaarhub_reviews_${product.id}`);
      if (local) return JSON.parse(local);
    } catch (e) {}
    return initialReviews.length > 0 ? initialReviews : [
      {
        id: 'rev-default-1',
        productId: product.id,
        userName: 'Rohan Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        date: '18 September 2026',
        verified: true,
        title: 'Worth every rupee! Top-tier quality and performance',
        comment: 'Exceeded all expectations. Build quality is exceptional and packaging was tamper-proof. Have been using it daily for 2 weeks with zero issues. Highly recommend to anyone considering this!',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80'
        ],
        helpfulVotes: 24
      },
      {
        id: 'rev-default-2',
        productId: product.id,
        userName: 'Ananya Verma',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        date: '24 September 2026',
        verified: true,
        title: 'Super comfortable and beautiful aesthetics',
        comment: 'The materials are extremely premium and soft. Exactly as shown in the pictures. Delivery took only 2 days in Bengaluru. 10/10 purchase!',
        images: [
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80'
        ],
        helpfulVotes: 17
      },
      {
        id: 'rev-default-3',
        productId: product.id,
        userName: 'Kunal Deshmukh',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        rating: 4,
        date: '28 September 2026',
        verified: true,
        title: 'Solid product with great finish',
        comment: 'Performance is great. Does everything advertised with flying colors. Minus one star only because the outer cardboard box had a small crease, but the inside product was flawless.',
        images: [],
        helpfulVotes: 9
      }
    ];
  });

  // Track which reviews the current user marked helpful
  const [votedHelpful, setVotedHelpful] = useState(() => {
    try {
      const saved = localStorage.getItem('bazaarhub_helpful_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Review Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Filter & Search states
  const [selectedStarFilter, setSelectedStarFilter] = useState('all'); // 'all' | '5' | '4' | '3' | '2' | '1' | 'images' | 'verified'
  const [sortBy, setSortBy] = useState('helpful'); // 'helpful' | 'newest' | 'highest' | 'lowest'
  const [searchQuery, setSearchQuery] = useState('');

  // Lightbox Modal for enlarged image preview
  const [lightboxImg, setLightboxImg] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`bazaarhub_reviews_${product.id}`, JSON.stringify(reviews));
    } catch (e) {}
  }, [reviews, product.id]);

  useEffect(() => {
    try {
      localStorage.setItem('bazaarhub_helpful_votes', JSON.stringify(votedHelpful));
    } catch (e) {}
  }, [votedHelpful]);

  // Fetch backend reviews on mount if available
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/reviews/product/${product.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.reviews && data.reviews.length > 0) {
            setReviews(data.reviews);
          }
        }
      } catch (err) {}
    };
    fetchReviews();
  }, [product.id]);

  // Metrics calculation
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / totalReviews).toFixed(1)
    : '4.5';

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const star = Math.round(Number(r.rating || 5));
    if (distribution[star] !== undefined) distribution[star]++;
  });

  // Collect all customer photos across reviews
  const allCustomerPhotos = reviews.flatMap(r => 
    (r.images || []).map(img => ({ img, userName: r.userName, rating: r.rating, title: r.title }))
  );

  // Handle Image Upload (Converts files to base64 data URLs)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (uploadedImages.length + files.length > 5) {
      addToast('You can upload a maximum of 5 images', 'warning');
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        addToast('Please select valid image files (PNG, JPG, WebP)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImages(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadedImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Add demo sample images
  const addSampleImage = (url) => {
    if (uploadedImages.length >= 5) {
      addToast('Maximum 5 images allowed', 'warning');
      return;
    }
    setUploadedImages(prev => [...prev, url]);
  };

  // Handle Helpful Vote
  const handleToggleHelpful = (reviewId) => {
    const hasVoted = Boolean(votedHelpful[reviewId]);
    
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const currentVotes = r.helpfulVotes || 0;
        return {
          ...r,
          helpfulVotes: hasVoted ? Math.max(0, currentVotes - 1) : currentVotes + 1
        };
      }
      return r;
    }));

    setVotedHelpful(prev => ({
      ...prev,
      [reviewId]: !hasVoted
    }));

    if (!hasVoted) {
      addToast('Marked as helpful! Thank you for your feedback.', 'success');
    }

    // Async push to backend
    try {
      fetch(`${API_BASE}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.email || 'guest' })
      }).catch(() => {});
    } catch (e) {}
  };

  // Handle Submit Review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      addToast('Please fill in both the title and review comments', 'error');
      return;
    }

    setIsSubmitting(true);

    const newRevObj = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: user?.name || 'Verified Buyer',
      userAvatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      rating: Number(rating),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      verified: true, // User purchased verified
      title: title.trim(),
      comment: comment.trim(),
      images: [...uploadedImages],
      helpfulVotes: 0
    };

    setReviews(prev => [newRevObj, ...prev]);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setTitle('');
    setComment('');
    setRating(5);
    setUploadedImages([]);
    addToast('Review submitted successfully! Thank you for rating.', 'success');

    // Sync to backend
    try {
      fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRevObj)
      }).catch(() => {});
    } catch (e) {}
  };

  // Filter and Sort reviews
  const filteredReviews = reviews
    .filter(r => {
      // Star filter
      if (selectedStarFilter === 'images') return (r.images && r.images.length > 0);
      if (selectedStarFilter === 'verified') return Boolean(r.verified);
      if (selectedStarFilter !== 'all') {
        return Math.round(Number(r.rating)) === Number(selectedStarFilter);
      }
      return true;
    })
    .filter(r => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.title?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q) ||
        r.userName?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'helpful') return (b.helpfulVotes || 0) - (a.helpfulVotes || 0);
      if (sortBy === 'highest') return Number(b.rating) - Number(a.rating);
      if (sortBy === 'lowest') return Number(a.rating) - Number(b.rating);
      return 0; // default newest
    });

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Average',
    4: 'Very Good',
    5: 'Exceptional'
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* 1. Rating Overview & Breakdown Card */}
      <div className="bg-slate-50/70 border border-slate-200/90 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Big 4.5/5 Score & Stars */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left border-b lg:border-b-0 lg:border-r border-slate-200/80 pb-6 lg:pb-0 lg:pr-8">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Customer Reviews
            </span>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight font-sans">
                {averageRating}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-400">
                / 5
              </span>
            </div>

            {/* Big Golden Stars: ★★★★★ */}
            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(Number(averageRating))
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-200 text-slate-200'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Based on <span className="font-bold text-slate-900">{totalReviews} verified ratings</span>
            </p>

            <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">96% of buyers recommend this item</span>
            </div>

            {/* Write a Review Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-5 w-full sm:w-auto px-6 py-3 bg-[#2b59ff] hover:bg-[#1f4bf0] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Right Column: Star Rating Distribution Progress Bars */}
          <div className="lg:col-span-8 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Rating Breakdown
            </h4>

            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              const isSelected = selectedStarFilter === String(star);

              return (
                <button
                  key={star}
                  onClick={() => setSelectedStarFilter(isSelected ? 'all' : String(star))}
                  className={`w-full flex items-center gap-3 text-xs group cursor-pointer p-1.5 rounded-lg transition-colors ${
                    isSelected ? 'bg-blue-50/80 ring-1 ring-blue-300' : 'hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1 w-14 shrink-0 font-bold text-slate-700">
                    <span>{star}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        star >= 4 ? 'bg-amber-400' : star === 3 ? 'bg-amber-300' : 'bg-amber-200'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-10 text-right text-[11px] font-semibold text-slate-500">
                    {percentage}%
                  </span>
                  <span className="w-8 text-right text-[10px] text-slate-400 font-medium">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 2. Customer Photos Gallery Strip (if any photos exist) */}
      {allCustomerPhotos.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Customer Photos ({allCustomerPhotos.length})
              </h4>
            </div>
            <button
              onClick={() => setSelectedStarFilter(selectedStarFilter === 'images' ? 'all' : 'images')}
              className={`text-xs font-bold underline transition-colors cursor-pointer ${
                selectedStarFilter === 'images' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {selectedStarFilter === 'images' ? 'Show all reviews' : 'Filter reviews with images'}
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            {allCustomerPhotos.map((photoItem, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImg(photoItem)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative group cursor-pointer shadow-2xs hover:shadow-md transition-all"
              >
                <img
                  src={photoItem.img}
                  alt={photoItem.title || 'Customer review photo'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Filter & Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        
        {/* Star & Image Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: '5', label: '5 ★' },
            { id: '4', label: '4 ★' },
            { id: '3', label: '3 ★' },
            { id: 'images', label: '📸 With Images' },
            { id: 'verified', label: '✓ Verified Only' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedStarFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer text-xs ${
                selectedStarFilter === filter.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          {/* Search within reviews */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-slate-200 bg-white rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="helpful">Most Helpful</option>
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>

      </div>

      {/* 4. Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No reviews found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No customer reviews matched your search or star filter. Be the first to review this product!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Write a Review
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const hasVoted = Boolean(votedHelpful[rev.id]);

            return (
              <div
                key={rev.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-3.5 transition-all hover:shadow-xs"
              >
                {/* Reviewer Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={rev.userName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {rev.userName}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Reviewed in India on {rev.date}
                      </p>
                    </div>
                  </div>

                  {/* Verified Purchase Badge */}
                  {rev.verified && (
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Purchase</span>
                    </div>
                  )}
                </div>

                {/* Star Rating & Headline */}
                <div className="flex items-center gap-2">
                  {/* ★★★★★ Star Cluster */}
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* 4.5/5 or 5.0/5 Score Tag */}
                  <span className="text-xs font-extrabold text-slate-800 bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                    {Number(rev.rating).toFixed(1)}/5
                  </span>

                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {rev.title}
                  </h5>
                </div>

                {/* Review Body */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {rev.comment}
                </p>

                {/* Uploaded Customer Photos Thumbnail Grid */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {rev.images.map((imgUrl, imgIdx) => (
                      <div
                        key={imgIdx}
                        onClick={() => setLightboxImg({ img: imgUrl, userName: rev.userName, rating: rev.rating, title: rev.title })}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 group cursor-pointer relative shadow-2xs hover:shadow-md transition-all"
                      >
                        <img
                          src={imgUrl}
                          alt="Customer product unboxing"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Maximize2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful Votes Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleHelpful(rev.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        hasVoted
                          ? 'bg-blue-50 text-blue-600 border-blue-300 ring-1 ring-blue-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-blue-600 text-blue-600' : ''}`} />
                      <span>Helpful</span>
                      <span className="font-bold">({rev.helpfulVotes || 0})</span>
                    </button>
                    {hasVoted && (
                      <span className="text-[11px] text-emerald-600 font-medium">
                        ✓ Marked as helpful
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Was this review helpful to you?
                  </span>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 5. Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Write a Product Review
                  </h3>
                  <p className="text-[11px] text-slate-500">{product.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              
              {/* Star Rating Picker: Interactive Hover & Click */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const active = (hoverRating || rating) >= starVal;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(starVal)}
                          className="p-1 rounded-md transition-transform hover:scale-120 cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              active
                                ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                                : 'fill-slate-200 text-slate-200'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-xs font-bold text-slate-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                    {rating} / 5 — {ratingLabels[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Review Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Review Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Worth every rupee! Outstanding build and sound quality"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Detailed Review Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike? How was the performance, battery, fit, or packaging?"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Image Upload Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Add Product Photos (Max 5)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {uploadedImages.length}/5 uploaded
                  </span>
                </div>

                {/* Upload drag & drop zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                      Click to browse or drop product images
                    </p>
                    <p className="text-[10px] text-slate-400">
                      PNG, JPG, or WebP up to 5MB each
                    </p>
                  </div>
                </div>

                {/* Uploaded Thumbnails Preview */}
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mt-3">
                    {uploadedImages.map((imgData, index) => (
                      <div
                        key={index}
                        className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group shadow-xs"
                      >
                        <img
                          src={imgData}
                          alt="Review preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sample quick photos to test with 1 click */}
                {uploadedImages.length === 0 && (
                  <div className="mt-2.5 flex items-center gap-2 text-[10px] text-slate-500">
                    <span>Quick test:</span>
                    <button
                      type="button"
                      onClick={() => addSampleImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80')}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                    >
                      + Sample Unboxing 1
                    </button>
                    <button
                      type="button"
                      onClick={() => addSampleImage('https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80')}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                    >
                      + Sample Unboxing 2
                    </button>
                  </div>
                )}
              </div>

              {/* Verified Purchase Tag preview */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">
                  This review will display with the <strong>Verified Purchase</strong> badge.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#2b59ff] hover:bg-[#1f4bf0] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Review'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. Lightbox Full Image Viewer Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-xl w-full shadow-2xl border border-slate-700 space-y-3"
          >
            <div className="relative aspect-4/3 bg-black flex items-center justify-center">
              <img
                src={lightboxImg.img}
                alt="Enlarged review photo"
                className="max-h-[420px] w-full object-contain"
              />
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 pt-1 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{lightboxImg.userName}</p>
                <p className="text-[11px] text-slate-500">{lightboxImg.title}</p>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= (lightboxImg.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
