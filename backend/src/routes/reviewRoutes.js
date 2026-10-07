const express = require('express');
const router = express.Router();

// Mock in-memory review database seeded with rich reviews
let reviewsDB = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Rohan Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '18 September 2026',
    verified: true,
    title: 'Worth every rupee! ANC is mind-blowing',
    comment: 'The noise cancellation completely blocks out traffic and metro noise. Battery life lasts nearly a week on a single charge. High frequencies are crisp and bass does not distort at high volume.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80'
    ],
    helpfulVotes: 24,
    votedUsers: []
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: 'Ananya Verma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '24 September 2026',
    verified: true,
    title: 'Super comfortable for long Zoom meetings',
    comment: 'The ear cups are extremely soft protein leather. I wear them for 6-8 hours daily while working from home without any ear fatigue. Microphone voice clarity is outstanding.',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80'
    ],
    helpfulVotes: 17,
    votedUsers: []
  },
  {
    id: 'rev-3',
    productId: 'prod-1',
    userName: 'Kunal Deshmukh',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 4,
    date: '28 September 2026',
    verified: true,
    title: 'Great sound, app equalizer is helpful',
    comment: 'Audio quality is 10/10. The Sony Headphones Connect app lets you tweak custom EQ profiles. Deducting one star only because the carry case is a little bulky in my backpack.',
    images: [],
    helpfulVotes: 9,
    votedUsers: []
  },
  {
    id: 'rev-4',
    productId: 'prod-2',
    userName: 'Vikram Joshi',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '12 September 2026',
    verified: true,
    title: 'Titanium build feels luxurious & battery is incredible',
    comment: 'Upgraded after 3 years. The 5x telephoto camera takes stunning portraits. Action button is programmed to voice memos. Fast delivery in genuine tamper-proof box.',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80'
    ],
    helpfulVotes: 31,
    votedUsers: []
  },
  {
    id: 'rev-5',
    productId: 'prod-3',
    userName: 'Meera Nambiar',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '15 September 2026',
    verified: true,
    title: 'M3 Max handles 8K video exports effortlessly',
    comment: 'Liquid Retina XDR screen is color accurate for DaVinci Resolve grading. The fans barely spin up even under sustained blender renders. Best laptop for creators.',
    images: [],
    helpfulVotes: 14,
    votedUsers: []
  }
];

// GET /api/reviews/product/:productId - Get reviews for a specific product
router.get('/product/:productId', (req, res) => {
  const { productId } = req.params;
  const productReviews = reviewsDB.filter(r => r.productId === productId || productId === 'all');

  // Compute metrics
  const total = productReviews.length;
  const averageRating = total > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
    : '4.5';

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  productReviews.forEach(r => {
    if (distribution[r.rating] !== undefined) {
      distribution[r.rating]++;
    }
  });

  res.status(200).json({
    success: true,
    productId,
    total,
    averageRating: parseFloat(averageRating),
    distribution,
    reviews: productReviews
  });
});

// POST /api/reviews - Submit a new review with ratings and images
router.post('/', (req, res) => {
  const { productId, rating, title, comment, images, userName, userAvatar, isVerified } = req.body;

  if (!productId || !rating || !title || !comment) {
    return res.status(400).json({
      success: false,
      message: 'productId, rating, title, and comment are required'
    });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    userName: userName || 'Verified Buyer',
    userAvatar: userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    rating: Math.min(5, Math.max(1, Number(rating))),
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    verified: isVerified !== undefined ? isVerified : true,
    title: title.trim(),
    comment: comment.trim(),
    images: Array.isArray(images) ? images : [],
    helpfulVotes: 0,
    votedUsers: [],
    createdAt: new Date().toISOString()
  };

  reviewsDB.unshift(newReview);

  res.status(201).json({
    success: true,
    message: 'Review published successfully',
    review: newReview
  });
});

// POST /api/reviews/:id/helpful - Vote a review as helpful
router.post('/:id/helpful', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const review = reviewsDB.find(r => r.id === id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  const userKey = userId || 'anonymous';
  const hasVoted = review.votedUsers && review.votedUsers.includes(userKey);

  if (hasVoted) {
    review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
    review.votedUsers = review.votedUsers.filter(u => u !== userKey);
  } else {
    review.helpfulVotes = (review.helpfulVotes || 0) + 1;
    if (!review.votedUsers) review.votedUsers = [];
    review.votedUsers.push(userKey);
  }

  res.status(200).json({
    success: true,
    helpfulVotes: review.helpfulVotes,
    hasVoted: !hasVoted
  });
});

module.exports = router;
