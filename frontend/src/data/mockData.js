import { MORE_PRODUCTS } from './moreProducts.js';

// BazaarHub Complete Marketplace Mock Dataset
// 75+ Products, 15 Categories, 10 Sellers, Realistic Specifications, Reviews, and Deals

export const CATEGORIES = [
  { id: 'mobiles', name: 'Mobiles & Accessories', slug: 'mobiles', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80', count: '1,420 items' },
  { id: 'electronics', name: 'Electronics & Audio', slug: 'electronics', icon: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80', count: '3,890 items' },
  { id: 'laptops', name: 'Laptops & Computers', slug: 'laptops', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80', count: '980 items' },
  { id: 'smartwatches', name: 'Smartwatches & Wearables', slug: 'smartwatches', icon: 'Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', count: '750 items' },
  { id: 'cameras', name: 'Cameras & Photography', slug: 'cameras', icon: 'Camera', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80', count: '520 items' },
  { id: 'tv', name: 'TV & Home Entertainment', slug: 'tv', icon: 'Tv', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=80', count: '640 items' },
  { id: 'appliances', name: 'Home Appliances', slug: 'appliances', icon: 'WashingMachine', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80', count: '1,120 items' },
  { id: 'kitchen', name: 'Kitchen & Dining', slug: 'kitchen', icon: 'Utensils', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80', count: '2,300 items' },
  { id: 'furniture', name: 'Furniture & Living', slug: 'furniture', icon: 'Armchair', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80', count: '890 items' },
  { id: 'fashion', name: 'Fashion & Apparel', slug: 'fashion', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=80', count: '5,600 items' },
  { id: 'beauty', name: 'Beauty & Personal Care', slug: 'beauty', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80', count: '3,100 items' },
  { id: 'grocery', name: 'Grocery & Gourmet', slug: 'grocery', icon: 'ShoppingBag', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80', count: '4,200 items' },
  { id: 'books', name: 'Books & Learning', slug: 'books', icon: 'BookOpen', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80', count: '7,800 items' },
  { id: 'sports', name: 'Sports, Fitness & Outdoors', slug: 'sports', icon: 'Dumbbell', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80', count: '1,500 items' },
  { id: 'toys', name: 'Toys & Baby Products', slug: 'toys', icon: 'Gamepad2', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&auto=format&fit=crop&q=80', count: '940 items' }
];

export const SELLERS = [
  {
    id: 's-1',
    name: 'TechWorld Store',
    slug: 'techworld-store',
    verified: true,
    rating: 4.8,
    reviewsCount: 3420,
    productsCount: 1250,
    followers: '42.5k',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=80',
    location: 'Bengaluru, Karnataka',
    description: 'Premier authorized distributor for premium electronics, smartphones, and pro gaming gear. 100% genuine products with manufacturer warranty.'
  },
  {
    id: 's-2',
    name: 'FashionHub Trends',
    slug: 'fashionhub-trends',
    verified: true,
    rating: 4.7,
    reviewsCount: 2890,
    productsCount: 850,
    followers: '38.2k',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80',
    location: 'Mumbai, Maharashtra',
    description: 'Contemporary western & ethnic apparel for men, women, and kids. Handcrafted textiles and runway-inspired everyday fashion.'
  },
  {
    id: 's-3',
    name: 'HomeCraft Living',
    slug: 'homecraft-living',
    verified: true,
    rating: 4.9,
    reviewsCount: 1750,
    productsCount: 620,
    followers: '19.4k',
    logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&auto=format&fit=crop&q=80',
    location: 'Jaipur, Rajasthan',
    description: 'Artisanal furniture, solid sheesham home decor, ergonomic kitchen essentials, and ambient smart lighting.'
  },
  {
    id: 's-4',
    name: 'SoundCraft Audio Labs',
    slug: 'soundcraft-audio',
    verified: true,
    rating: 4.9,
    reviewsCount: 4120,
    productsCount: 310,
    followers: '56.1k',
    logo: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
    location: 'Hyderabad, Telangana',
    description: 'Audiophile grade studio headphones, hi-res Bluetooth speakers, and active noise-cancelling lifestyle earbuds.'
  },
  {
    id: 's-5',
    name: 'PureGlow Botanicals',
    slug: 'pureglow-botanicals',
    verified: true,
    rating: 4.6,
    reviewsCount: 1980,
    productsCount: 420,
    followers: '24.8k',
    logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop&q=80',
    location: 'Kochi, Kerala',
    description: 'Ayurvedic formulations, clean organic skincare, and dermatologically tested luxury wellness essentials.'
  },
  {
    id: 's-6',
    name: 'Apex Athletic Gear',
    slug: 'apex-athletic',
    verified: true,
    rating: 4.8,
    reviewsCount: 2210,
    productsCount: 540,
    followers: '31.0k',
    logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&auto=format&fit=crop&q=80',
    location: 'Delhi NCR',
    description: 'High performance sports nutrition, gym accessories, yoga essentials, and rugged outdoor equipment.'
  },
  {
    id: 's-7',
    name: 'Grand Horizon Horology',
    slug: 'grand-horizon-watches',
    verified: true,
    rating: 4.9,
    reviewsCount: 1450,
    productsCount: 210,
    followers: '15.6k',
    logo: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1600&auto=format&fit=crop&q=80',
    location: 'Chennai, Tamil Nadu',
    description: 'Crafted automatic wristwatches, luxury chronographs, and precision smart wearable fitness timepieces.'
  },
  {
    id: 's-8',
    name: 'Gourmet Pantry India',
    slug: 'gourmet-pantry',
    verified: true,
    rating: 4.7,
    reviewsCount: 3100,
    productsCount: 920,
    followers: '28.9k',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&auto=format&fit=crop&q=80',
    location: 'Pune, Maharashtra',
    description: 'Single estate artisanal coffees, cold-pressed virgin oils, organic dry fruits, and international spice blends.'
  },
  {
    id: 's-9',
    name: 'Scholar Book House',
    slug: 'scholar-books',
    verified: true,
    rating: 4.8,
    reviewsCount: 4500,
    productsCount: 3400,
    followers: '47.3k',
    logo: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&auto=format&fit=crop&q=80',
    location: 'Kolkata, West Bengal',
    description: 'Bestselling non-fiction, competitive examination preparation guides, literary classics, and children picture books.'
  },
  {
    id: 's-10',
    name: 'Little Explorers Toys',
    slug: 'little-explorers',
    verified: true,
    rating: 4.6,
    reviewsCount: 1620,
    productsCount: 480,
    followers: '12.4k',
    logo: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=1600&auto=format&fit=crop&q=80',
    location: 'Ahmedabad, Gujarat',
    description: 'STEM educational toys, non-toxic wooden puzzles, robotic kits, and creative montessori games.'
  }
];

export const PRODUCTS = [
  // Special ₹1 Promotional / Gateway Test Product
  {
    id: 'prod-one-rupee',
    name: '₹1 Flash Deal - Special Promo & Gateway Test Sample',
    slug: 'one-rupee-test-product',
    category: 'electronics',
    subcategory: 'Accessories',
    brand: 'BazaarHub Exclusive',
    price: 1,
    originalPrice: 99,
    discount: 99,
    rating: 4.9,
    reviewCount: 1540,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-1',
    sellerName: 'TechWorld Store',
    stock: 999,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: true,
    claimedPercentage: 94,
    freeDelivery: true,
    description: 'Special ₹1 promotional product. Perfect for testing seamless checkout, Stripe and Razorpay payment authorization, invoices, and automated order confirmations.',
    features: [
      '₹1 Special Flash Deal Promotional Price',
      'Fully compatible with live and test payment gateways (Stripe & Razorpay)',
      'Instant digital tax invoice generation on purchase',
      'Free express dispatch with order tracking'
    ],
    specifications: {
      'Deal Price': '₹1 Only',
      'Promotional Discount': '99% OFF',
      'Delivery': 'Free Delivery',
      'Return Window': '7 Days Returnable',
      'Warranty': '1 Year Standard Warranty'
    }
  },
  // 1-8: Electronics & Audio
  {
    id: 'prod-1',
    name: 'AeroWave Pro Active Noise Cancelling Wireless Headphones with 50H Playtime',
    slug: 'aerowave-pro-anc-wireless-headphones',
    category: 'electronics',
    subcategory: 'Headphones',
    brand: 'SoundCraft',
    price: 4999,
    originalPrice: 12999,
    discount: 62,
    rating: 4.8,
    reviewCount: 4210,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-4',
    sellerName: 'SoundCraft Audio Labs',
    stock: 45,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 78,
    freeDelivery: true,
    description: 'Industry-leading Active Noise Cancellation (ANC) up to 40dB with titanium acoustic drivers. Dual transparency modes, multipoint Bluetooth 5.3 pairing, and ultra-fast charging (10 mins = 6 hours playtime).',
    features: [
      'Hybrid Active Noise Cancellation with 4 dedicated microphones',
      'High-Resolution Audio certified with LDAC codec support',
      '50 Hours Battery Life with ANC OFF, 40 Hours with ANC ON',
      'Ergonomic memory foam ear cushions with breathable protein leather'
    ],
    specifications: {
      'Driver Size': '40mm Titanium Drivers',
      'Bluetooth Version': '5.3',
      'Charging Port': 'USB Type-C Fast Charge',
      'Weight': '248 grams',
      'Warranty': '1 Year Brand Replacement Warranty'
    }
  },
  {
    id: 'prod-2',
    name: 'SonicPulse Boom 40W Rugged Waterproof IPX7 Portable Bluetooth Speaker',
    slug: 'sonicpulse-boom-40w-bluetooth-speaker',
    category: 'electronics',
    subcategory: 'Speakers',
    brand: 'SoundCraft',
    price: 2499,
    originalPrice: 5999,
    discount: 58,
    rating: 4.6,
    reviewCount: 1890,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-4',
    sellerName: 'SoundCraft Audio Labs',
    stock: 80,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: true,
    claimedPercentage: 88,
    freeDelivery: true,
    description: 'Deep 360-degree bass with dual passive radiators. Fully waterproof IPX7 rating floats in water, making it perfect for pool parties, beach trips, and outdoor adventures.',
    features: [
      '40W RMS Stereo Sound with Enhanced Bass Boost',
      'IPX7 100% Waterproof and Dustproof submersible housing',
      '24 Hours Non-Stop Playtime with 5200mAh Powerbank capability',
      'TWS Wireless Stereo Pairing to link two speakers simultaneously'
    ],
    specifications: {
      'Power Output': '40W Peak RMS',
      'Battery': '5200 mAh Li-ion',
      'Water Resistance': 'IPX7 Certified',
      'Connectivity': 'Bluetooth 5.2 / AUX / MicroSD'
    }
  },
  {
    id: 'prod-3',
    name: 'CyberBlade Pro 75% Wireless Mechanical Keyboard RGB Hot-Swappable',
    slug: 'cyberblade-pro-wireless-keyboard',
    category: 'electronics',
    subcategory: 'Accessories',
    brand: 'TechWorld',
    price: 3799,
    originalPrice: 7999,
    discount: 53,
    rating: 4.7,
    reviewCount: 960,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-1',
    sellerName: 'TechWorld Store',
    stock: 25,
    isDealOfDay: true,
    isBestSeller: false,
    isFlashSale: false,
    claimedPercentage: 45,
    freeDelivery: true,
    description: 'Custom gasket-mounted mechanical gaming keyboard with pre-lubed linear red switches, sound-dampening silicon foam, and customizable per-key dynamic RGB backlighting.',
    features: [
      'Tri-Mode Connectivity: 2.4GHz Wireless, Bluetooth 5.0, USB-C Wired',
      'Hot-Swappable 5-Pin PCB compatible with Cherry, Gateron, Kailh',
      'Double-shot PBT OEM profile keycaps that never fade or shine',
      'Dedicated CNC aluminum volume control knob'
    ],
    specifications: {
      'Layout': '75% Compact (82 Keys)',
      'Switches': 'Factory Pre-Lubed Red Linear',
      'Battery': '4000mAh Rechargeable',
      'OS Compatibility': 'Windows, Mac, iOS, Android'
    }
  },
  {
    id: 'prod-4',
    name: 'SwiftAim 26K DPI Ultra-Lightweight Wireless Gaming Mouse (58g)',
    slug: 'swiftaim-wireless-gaming-mouse',
    category: 'electronics',
    subcategory: 'Accessories',
    brand: 'TechWorld',
    price: 1899,
    originalPrice: 4499,
    discount: 58,
    rating: 4.6,
    reviewCount: 740,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-1',
    sellerName: 'TechWorld Store',
    stock: 40,
    isDealOfDay: false,
    isBestSeller: false,
    isFlashSale: true,
    claimedPercentage: 92,
    freeDelivery: true,
    description: 'Flawless optical sensor with 26,000 DPI, 650 IPS tracking speed, and 50G acceleration. Symmetrical ergonomic body weighing just 58 grams for effortless flick shots.',
    features: [
      '58g Ultralight honeycomb-less solid shell design',
      'PAW3395 Flagship Optical Sensor with 1000Hz polling rate',
      'Optical micro switches rated for 90 million clicks with zero debouncing latency',
      'Pure virgin-grade PTFE mouse feet for smooth glide'
    ],
    specifications: {
      'DPI Range': '100 - 26,000 DPI',
      'Weight': '58 grams',
      'Battery Life': 'Up to 80 hours continuous gaming',
      'Sensor': 'PAW3395 Optical'
    }
  },

  // 5-8: Mobiles & Smartwatches
  {
    id: 'prod-5',
    name: 'Zenith 5G Smartphone (12GB RAM, 256GB Storage, 120Hz AMOLED, 108MP OIS)',
    slug: 'zenith-5g-smartphone-256gb',
    category: 'mobiles',
    subcategory: 'Smartphones',
    brand: 'Apex Tech',
    price: 24999,
    originalPrice: 34999,
    discount: 29,
    rating: 4.7,
    reviewCount: 5840,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-1',
    sellerName: 'TechWorld Store',
    stock: 35,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 65,
    freeDelivery: true,
    description: 'Flagship 4nm octa-core 5G processor, gorgeous 6.78-inch 120Hz Curved AMOLED HDR10+ display, 108MP triple camera setup with Optical Image Stabilization, and 67W Turbo Flash charging.',
    features: [
      '6.78" FHD+ 120Hz 10-bit Curved AMOLED Display with 1600 nits peak brightness',
      '108MP OIS Main Camera + 8MP Ultra-wide + 2MP Macro with 4K 60fps recording',
      '5000 mAh High-Density Battery with 67W Charger included in the box',
      'Dual Stereo Speakers with Dolby Atmos audio certification'
    ],
    specifications: {
      'RAM / ROM': '12GB LPDDR5X / 256GB UFS 3.1',
      'Processor': 'Octa-Core 4nm 5G Chipset',
      'Camera': '108MP OIS + 8MP + 2MP | 32MP Selfie',
      'Operating System': 'Android 14 with 3 Years OS Updates'
    }
  },
  {
    id: 'prod-6',
    name: 'Horizon Active 2 AMOLED Smartwatch with Bluetooth Calling & SpO2',
    slug: 'horizon-active-2-amoled-smartwatch',
    category: 'smartwatches',
    subcategory: 'Smartwatches',
    brand: 'Grand Horizon',
    price: 2999,
    originalPrice: 8999,
    discount: 67,
    rating: 4.8,
    reviewCount: 3120,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-7',
    sellerName: 'Grand Horizon Horology',
    stock: 50,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 70,
    freeDelivery: true,
    description: 'Stunning 1.43-inch Always-On AMOLED screen with crystal-clear Bluetooth phone calls, 24/7 heart rate, blood oxygen (SpO2), stress monitoring, and 120+ fitness activity sports modes.',
    features: [
      '1.43" Ultra-AMOLED Display with 466x466 resolution and 1000 nits brightness',
      'Single-chip Bluetooth 5.3 calling with AI noise reduction microphone',
      'Comprehensive health tracking: Heart Rate, SpO2, Sleep Stages, Female Health',
      'Up to 10 Days typical battery life on a single magnetic charge'
    ],
    specifications: {
      'Display': '1.43" AMOLED Always-on',
      'Battery Life': 'Up to 10 Days',
      'Water Resistance': 'IP68 Certified Water & Sweat Proof',
      'App Compatibility': 'iOS 11+ & Android 7.0+'
    }
  },
  {
    id: 'prod-7',
    name: 'Horizon Minimalist Titanium Automatic Chronograph Watch',
    slug: 'horizon-minimalist-titanium-chronograph',
    category: 'smartwatches',
    subcategory: 'Luxury Watches',
    brand: 'Grand Horizon',
    price: 14999,
    originalPrice: 28000,
    discount: 46,
    rating: 4.9,
    reviewCount: 840,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-7',
    sellerName: 'Grand Horizon Horology',
    stock: 12,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 30,
    freeDelivery: true,
    description: 'Precision Japanese 24-jewel automatic mechanical movement housed in an aerospace-grade Grade 5 titanium case with scratch-proof anti-reflective sapphire crystal glass.',
    features: [
      'Automatic self-winding mechanical movement with 42-hour power reserve',
      'Aerospace Titanium casing: 40% lighter and 5x stronger than standard steel',
      '100M Water Resistance with screw-down crown',
      'Exhibition skeleton caseback showcasing rotor and jewel gears'
    ],
    specifications: {
      'Case Diameter': '41mm',
      'Glass': 'Anti-Reflective Sapphire Crystal',
      'Water Resistance': '10 ATM (100 Meters)',
      'Strap': 'Genuine Italian Calfskin Leather + Titanium Mesh'
    }
  },
  {
    id: 'prod-8',
    name: 'VoltStream 65W GaN Fast Charger with 3 Ports (2 USB-C + 1 USB-A)',
    slug: 'voltstream-65w-gan-fast-charger',
    category: 'mobiles',
    subcategory: 'Chargers',
    brand: 'TechWorld',
    price: 1499,
    originalPrice: 3499,
    discount: 57,
    rating: 4.7,
    reviewCount: 2450,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-1',
    sellerName: 'TechWorld Store',
    stock: 90,
    isDealOfDay: false,
    isBestSeller: false,
    isFlashSale: true,
    claimedPercentage: 84,
    freeDelivery: true,
    description: 'Next-gen Gallium Nitride (GaN III) technology delivers full 65W Power Delivery to charge your laptop, tablet, and smartphone at top speed from a pocket-sized plug.',
    features: [
      '65W High-Speed Output: Charge MacBook Air or Dell XPS to 50% in 35 mins',
      'Triple Port Simultaneous Charging with intelligent power distribution',
      'GaN III Chip runs 30% cooler with over-voltage and surge protections',
      'Foldable compact pins for effortless travel portability'
    ],
    specifications: {
      'Total Output': '65W Max',
      'Ports': '2x USB-C (PD 3.0), 1x USB-A (QC 4.0)',
      'Dimensions': '5.2 x 5.2 x 3.0 cm',
      'Weight': '118g'
    }
  },

  // 9-16: Laptops, Cameras & TV
  {
    id: 'prod-9',
    name: 'AeroBook Ultra 14 Intel Core i7 13th Gen (16GB DDR5, 1TB NVMe, 2.8K OLED)',
    slug: 'aerobook-ultra-14-core-i7-laptop',
    category: 'laptops',
    subcategory: 'Laptops',
    brand: 'TechWorld',
    price: 64999,
    originalPrice: 89999,
    discount: 28,
    rating: 4.8,
    reviewCount: 1420,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-1',
    sellerName: 'TechWorld Store',
    stock: 20,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 55,
    freeDelivery: true,
    description: 'Featherlight 1.28kg CNC aluminum chassis, dazzling 2.8K 90Hz 100% DCI-P3 OLED display, and all-day 14-hour battery with Thunderbolt 4 high speed expansion.',
    features: [
      'Intel Core i7-1360P 12-Core Processor (Up to 5.0 GHz Turbo)',
      '14-inch 2.8K (2880 x 1800) OLED display with 400 nits and Pantone Validation',
      '16GB LPDDR5 5200MHz RAM + 1TB PCIe 4.0 M.2 NVMe SSD',
      'Backlit ergonomic keyboard, glass precision trackpad, fingerprint power button'
    ],
    specifications: {
      'Processor': 'Intel Core i7 13th Gen',
      'RAM / Storage': '16GB RAM / 1TB SSD',
      'Display': '14.0" 2.8K OLED 90Hz',
      'Weight': '1.28 kg'
    }
  },
  {
    id: 'prod-10',
    name: 'Lumix Alpha 4K Mirrorless Digital Camera with 18-55mm IS Lens Kit',
    slug: 'lumix-alpha-4k-mirrorless-camera',
    category: 'cameras',
    subcategory: 'Cameras',
    brand: 'TechWorld',
    price: 48999,
    originalPrice: 65999,
    discount: 26,
    rating: 4.8,
    reviewCount: 680,
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-1',
    sellerName: 'TechWorld Store',
    stock: 14,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 40,
    freeDelivery: true,
    description: '24.2 Megapixel APS-C CMOS sensor with eye-tracking Real-Time Autofocus, uncropped 4K 30fps HDR video, and 3.0-inch vari-angle touchscreen LCD for effortless vlogging and cinema photography.',
    features: [
      '24.2 MP APS-C Sensor with ISO range up to 51,200',
      'Fast Hybrid AF with 425 phase-detection points & AI Animal/Human Eye AF',
      'Cinematic 4K Video recording with clean HDMI output and external mic jack',
      'Built-in Wi-Fi & Bluetooth for instant smartphone image transfer'
    ],
    specifications: {
      'Sensor': '24.2 MP APS-C CMOS',
      'Video Resolution': '4K UHD at 30p / Full HD at 120p',
      'Lens Included': '18-55mm f/3.5-5.6 Optical Image Stabilizer',
      'Weight': '403g (Body Only)'
    }
  },
  {
    id: 'prod-11',
    name: 'CinemaVision 55-inch 4K Ultra HD Smart QLED TV with Dolby Vision Atmos',
    slug: 'cinemavision-55-inch-4k-qled-tv',
    category: 'tv',
    subcategory: 'Televisions',
    brand: 'TechWorld',
    price: 32999,
    originalPrice: 59999,
    discount: 45,
    rating: 4.6,
    reviewCount: 2150,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-1',
    sellerName: 'TechWorld Store',
    stock: 22,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 68,
    freeDelivery: true,
    description: 'Quantum Dot Nanocrystal technology delivering over 1 Billion vibrant colors. Supports Dolby Vision IQ, HDR10+, 40W soundbar-grade stereo speakers, and hands-free Google Voice Assistant.',
    features: [
      '55" 4K QLED Panel with Full Array Local Dimming and 60Hz MEMC',
      'Dolby Vision & HDR10+ for lifelike contrast and deep cinematic blacks',
      '40W Integrated Stereo Speakers with Dolby Atmos acoustic tuning',
      'Google TV OS with access to 10,000+ streaming apps (Netflix, Prime, Hotstar)'
    ],
    specifications: {
      'Screen Size': '55 Inches (139 cm)',
      'Resolution': '4K Ultra HD (3840 x 2160)',
      'Audio Output': '40 Watts Dolby Atmos',
      'HDMI Ports': '3x HDMI 2.1 (eARC supported)'
    }
  },
  {
    id: 'prod-12',
    name: 'ViewMax 27-inch QHD 165Hz IPS Gaming Monitor (1ms MPRT, HDR400, sRGB 130%)',
    slug: 'viewmax-27-inch-165hz-gaming-monitor',
    category: 'laptops',
    subcategory: 'Monitors',
    brand: 'TechWorld',
    price: 16499,
    originalPrice: 28999,
    discount: 43,
    rating: 4.7,
    reviewCount: 920,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-1',
    sellerName: 'TechWorld Store',
    stock: 18,
    isDealOfDay: false,
    isBestSeller: false,
    isFlashSale: true,
    claimedPercentage: 76,
    freeDelivery: true,
    description: 'Buttery smooth 165Hz refresh rate paired with AMD FreeSync Premium and G-Sync compatibility. Ergonomic height, swivel, and pivot adjustable stand for pro esports gamers.',
    features: [
      '27" QHD (2560 x 1440) SuperSpeed Fast IPS Panel',
      '165Hz Refresh Rate with ultra-responsive 1ms response time',
      'VESA DisplayHDR 400 with 130% sRGB color gamut coverage',
      'Fully adjustable stand with 90° portrait pivot and VESA 100x100 mount'
    ],
    specifications: {
      'Resolution': '2560 x 1440 (2K QHD)',
      'Refresh Rate': '165Hz',
      'Panel Type': 'Fast IPS',
      'Inputs': '2x DisplayPort 1.4, 2x HDMI 2.0'
    }
  },

  // 13-20: Fashion & Apparel
  {
    id: 'prod-13',
    name: 'Pure Linen Slim Fit Casual Button-Down Shirt for Men',
    slug: 'pure-linen-slim-fit-casual-shirt',
    category: 'fashion',
    subcategory: "Men's Fashion",
    brand: 'FashionHub',
    price: 1299,
    originalPrice: 2999,
    discount: 57,
    rating: 4.5,
    reviewCount: 1640,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-2',
    sellerName: 'FashionHub Trends',
    stock: 65,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 82,
    freeDelivery: true,
    description: '100% sustainably sourced French flax linen. Naturally breathable, lightweight, and pre-washed for extra softness. Perfect for summer afternoons and smart casual office wear.',
    features: [
      '100% Pure Natural French Flax Linen Fabric',
      'Tailored modern slim silhouette with button-down collar',
      'Natural coconut shell buttons and reinforced seams',
      'Machine washable and becomes softer with every wash'
    ],
    specifications: {
      'Material': '100% Linen',
      'Fit': 'Slim Fit',
      'Sleeve': 'Full Sleeve with adjustable cuffs',
      'Care': 'Machine wash cold, gentle cycle'
    }
  },
  {
    id: 'prod-14',
    name: 'Floral Print Chiffon A-Line Maxi Dress for Women with Belt',
    slug: 'floral-print-chiffon-maxi-dress',
    category: 'fashion',
    subcategory: "Women's Fashion",
    brand: 'FashionHub',
    price: 1599,
    originalPrice: 3999,
    discount: 60,
    rating: 4.7,
    reviewCount: 2210,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-2',
    sellerName: 'FashionHub Trends',
    stock: 48,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 60,
    freeDelivery: true,
    description: 'Airy chiffon maxi dress featuring an artistic botanical floral print, gentle tiered ruffle hem, and an adjustable matching fabric tie belt for an effortless flattering drape.',
    features: [
      'Lightweight flowy chiffon outer shell with soft breathable inner lining',
      'Modest V-neckline with elasticated cuff puff sleeves',
      'Flattering empire waistline with removable matching belt',
      'Suitable for brunch, parties, festive gatherings, and vacations'
    ],
    specifications: {
      'Fabric': 'Premium Poly-Chiffon + Crepe Lining',
      'Length': 'Ankle Length (Maxi)',
      'Pattern': 'Hand-drawn Floral Print',
      'Sizes': 'XS, S, M, L, XL, XXL'
    }
  },
  {
    id: 'prod-15',
    name: 'Artisan Vegetable-Tanned Full Grain Leather Travel Duffle Bag',
    slug: 'artisan-leather-travel-duffle-bag',
    category: 'fashion',
    subcategory: 'Bags & Luggage',
    brand: 'Tuscan Hide',
    price: 4499,
    originalPrice: 9999,
    discount: 55,
    rating: 4.9,
    reviewCount: 940,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-2',
    sellerName: 'FashionHub Trends',
    stock: 15,
    isDealOfDay: true,
    isBestSeller: false,
    isFlashSale: false,
    claimedPercentage: 50,
    freeDelivery: true,
    description: 'Handcrafted by master leather artisans from 100% full-grain vegetable-tanned bovine leather. Develops a rich organic patina over time. Equipped with heavy-duty YKK antique brass zippers.',
    features: [
      'Full grain vegetable-tanned genuine leather that ages gracefully',
      'Dedicated zippered shoe compartment and water-resistant water bottle slot',
      'Detachable padded ergonomic shoulder strap with solid brass clasps',
      'Spacious 45L volume fits 3-5 days of travel gear'
    ],
    specifications: {
      'Dimensions': '52 x 28 x 26 cm',
      'Capacity': '45 Liters',
      'Hardware': 'Solid Antique Brass Zippers & Rivets',
      'Lining': 'Heavy-Duty 16oz Cotton Canvas'
    }
  },
  {
    id: 'prod-16',
    name: 'CloudStrider Pro Lightweight Running & Walking Sneakers',
    slug: 'cloudstrider-pro-running-sneakers',
    category: 'fashion',
    subcategory: 'Shoes',
    brand: 'Apex Athletic',
    price: 1999,
    originalPrice: 4499,
    discount: 56,
    rating: 4.6,
    reviewCount: 3100,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-6',
    sellerName: 'Apex Athletic Gear',
    stock: 75,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: true,
    claimedPercentage: 90,
    freeDelivery: true,
    description: 'High-rebound nitrogen-infused midsole foam delivers 70% energy return. Breathable seamless engineered mesh upper keeps your feet cool across marathons and daily gym training.',
    features: [
      'Dual-density EVA foam midsole with shock absorption gel heel crash pad',
      'Seamless 3D knit upper for snug sock-like adaptive comfort',
      'Traction grip rubber outsole engineered for wet and dry road surfaces',
      'Ortholite memory foam anti-microbial moisture-wicking insole'
    ],
    specifications: {
      'Weight': '235 grams (Single Shoe Size 8)',
      'Closure': 'Lace-Up with TPU heel stabilizer',
      'Sole Material': 'Non-Marking Carbon Rubber',
      'Ideal For': 'Running, Gym, Walking, Everyday Casual'
    }
  },

  // 17-24: Home & Kitchen & Appliances
  {
    id: 'prod-17',
    name: 'Nordic Solid Sheesham Wood Minimalist Study & Work Desk with Drawer',
    slug: 'nordic-solid-sheesham-study-desk',
    category: 'furniture',
    subcategory: 'Furniture',
    brand: 'HomeCraft',
    price: 8499,
    originalPrice: 16999,
    discount: 50,
    rating: 4.8,
    reviewCount: 520,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-3',
    sellerName: 'HomeCraft Living',
    stock: 10,
    isDealOfDay: true,
    isBestSeller: false,
    isFlashSale: false,
    claimedPercentage: 40,
    freeDelivery: true,
    description: 'Handcrafted from 100% kiln-dried seasoned Sheesham (Rosewood) featuring natural wood grain patterns. Spacious surface with cable cutout and two smooth-gliding storage drawers.',
    features: [
      '100% Pure Solid Sheesham Wood with Honey Teak polish',
      'Termite and borer resistant treatment with 5-year structural warranty',
      'Pre-assembled tabletop with quick 10-minute DIY leg attachment',
      'High load bearing capacity of up to 120 kg'
    ],
    specifications: {
      'Dimensions': '115 x 60 x 76 cm (L x W x H)',
      'Wood Type': 'Indian Rosewood (Sheesham)',
      'Finish': 'Natural Matte Honey Grain',
      'Drawers': '2 Integrated Soft-Close Drawers'
    }
  },
  {
    id: 'prod-18',
    name: 'AromaPress Digital Touch Air Fryer 6.5L with 12 One-Touch Presets',
    slug: 'aromapress-digital-air-fryer-6.5l',
    category: 'kitchen',
    subcategory: 'Kitchen Appliances',
    brand: 'HomeCraft',
    price: 3999,
    originalPrice: 8999,
    discount: 56,
    rating: 4.7,
    reviewCount: 3890,
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-3',
    sellerName: 'HomeCraft Living',
    stock: 55,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 85,
    freeDelivery: true,
    description: 'Crisp 360-degree rapid hot air circulation cuts down oil usage by 85%. Large 6.5-liter non-stick basket fits a whole chicken, samosas, fries, and cakes with intuitive digital touch controls.',
    features: [
      '1800W Rapid Turbo Air Technology for fast even crisping without oil',
      '12 Smart Cooking Presets: Samosa, Fries, Chicken, Fish, Cake, Dehydrate',
      'Non-Stick ceramic coated dishwasher-safe basket with cool-touch handle',
      'Adjustable temperature 80°C - 200°C with 60-minute automatic shutoff'
    ],
    specifications: {
      'Capacity': '6.5 Liters',
      'Wattage': '1800 Watts',
      'Control Type': 'Digital LED Touch Panel',
      'Warranty': '2 Years Comprehensive Warranty'
    }
  },
  {
    id: 'prod-19',
    name: 'Tri-Ply Stainless Steel Heavy Gauge 5-Piece Induction Cookware Set',
    slug: 'tri-ply-stainless-steel-cookware-set',
    category: 'kitchen',
    subcategory: 'Cookware',
    brand: 'HomeCraft',
    price: 3499,
    originalPrice: 7499,
    discount: 53,
    rating: 4.9,
    reviewCount: 1670,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-3',
    sellerName: 'HomeCraft Living',
    stock: 35,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 60,
    freeDelivery: true,
    description: 'Tri-Ply technology features an aluminum core sandwiched between food-grade 304 stainless steel and magnetic 430 induction base for rapid, 100% hotspot-free cooking.',
    features: [
      '3-Layer SAS Construction: SS 304 inside, Pure Aluminum core, SS 430 magnetic bottom',
      'Compatible with Gas, Induction, Ceramic, and Halogen stovetops',
      'Cast stay-cool riveted stainless steel handles that never loosen',
      'Includes 24cm Fry Pan, 2.5L Kadhai with Glass Lid, and 1.5L Saucepan'
    ],
    specifications: {
      'Set Includes': 'Kadhai with Lid, Frypan, Saucepan',
      'Material': 'Food Grade SS 304 & Induction Ready SS 430',
      'Thickness': '2.5 mm Heavy Duty',
      'Warranty': '10 Years Manufacturer Guarantee'
    }
  },
  {
    id: 'prod-20',
    name: 'Lumina Solid Oak Minimalist Desk Lamp with Fast 15W Qi Wireless Charger',
    slug: 'lumina-solid-oak-desk-lamp-wireless-charger',
    category: 'furniture',
    subcategory: 'Lighting',
    brand: 'HomeCraft',
    price: 1899,
    originalPrice: 4299,
    discount: 56,
    rating: 4.7,
    reviewCount: 880,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-3',
    sellerName: 'HomeCraft Living',
    stock: 40,
    isDealOfDay: false,
    isBestSeller: false,
    isFlashSale: true,
    claimedPercentage: 80,
    freeDelivery: true,
    description: 'Flicker-free warm ambient eye-caring illumination with 3 color temperatures, stepless brightness touch slider, and a solid oak base with built-in 15W fast smartphone wireless charging.',
    features: [
      'Integrated 15W Qi Wireless Fast Charging Pad built into natural oak wood',
      '3 Lighting Color Modes: Warm White (3000K), Neutral (4000K), Daylight (6000K)',
      'Touch-sensitive brightness slider with memory recall function',
      'Flexible silicone gooseneck rotates 360 degrees without squeaking'
    ],
    specifications: {
      'Bulb Type': 'Energy Efficient Eye-Care SMD LEDs',
      'Wireless Output': '15W / 10W / 7.5W Qi Certified',
      'Base Material': '100% Solid Harvested Oak Wood',
      'Power Source': 'Type-C USB Adapter Included'
    }
  },

  // 21-28: Beauty, Wellness & Grocery
  {
    id: 'prod-21',
    name: 'PureGlow 10% Niacinamide & Zinc Clarifying Facial Serum (30ml)',
    slug: 'pureglow-niacinamide-zinc-facial-serum',
    category: 'beauty',
    subcategory: 'Skincare',
    brand: 'PureGlow',
    price: 499,
    originalPrice: 999,
    discount: 50,
    rating: 4.6,
    reviewCount: 4890,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-5',
    sellerName: 'PureGlow Botanicals',
    stock: 120,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 86,
    freeDelivery: false,
    description: 'Dermatologically tested facial serum formulated with 10% pure Niacinamide and 1% Zinc PCA to balance sebum, minimize enlarged pores, reduce blemishes, and strengthen skin barrier.',
    features: [
      'Clinically proven to fade acne spots and post-inflammatory hyperpigmentation',
      'Lightweight water-based formula absorbs in seconds without stickiness',
      'Free from artificial fragrances, parabens, sulfates, and silicone',
      'Suitable for all skin types, including sensitive and acne-prone skin'
    ],
    specifications: {
      'Volume': '30 ml',
      'Key Actives': '10% Niacinamide + 1% Zinc PCA + Hyaluronic Acid',
      'Packaging': 'UV Protected Amber Glass Dropper Bottle',
      'Cruelty Free': '100% Vegan & Cruelty Free Certified'
    }
  },
  {
    id: 'prod-22',
    name: 'Kumkumadi Ayurvedic Miracle Night Face Elixir Oil with 24K Gold Dust (25ml)',
    slug: 'kumkumadi-ayurvedic-face-oil-24k-gold',
    category: 'beauty',
    subcategory: 'Skincare',
    brand: 'PureGlow',
    price: 1199,
    originalPrice: 2499,
    discount: 52,
    rating: 4.8,
    reviewCount: 1980,
    images: [
      'https://images.unsplash.com/photo-1608248597359-52e67df48074?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-5',
    sellerName: 'PureGlow Botanicals',
    stock: 45,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 62,
    freeDelivery: true,
    description: 'Ancient Ayurvedic recipe prepared with authentic Kashmiri saffron, red sandalwood, vetiver, and 24K pure cosmetic gold leaf. Restores deep glow and plumps skin overnight.',
    features: [
      'Infused with 26 precious Himalayan herbs and authentic saffron strands',
      'Pure 24K cosmetic gold flakes promote micro-circulation and luminosity',
      'Rich in antioxidants to smooth fine lines and even out sun tan',
      'Crafted using traditional taila paka classical Ayurvedic process'
    ],
    specifications: {
      'Volume': '25 ml',
      'Hero Ingredients': 'Kashmiri Saffron, Sandalwood, 24K Gold, Lotus',
      'Usage': 'Apply 3-4 drops nightly after cleansing',
      'Skin Type': 'Dry, Normal, Combination'
    }
  },
  {
    id: 'prod-23',
    name: 'Estate Reserve Single Origin 100% Arabica Medium Dark Roast Coffee Beans (500g)',
    slug: 'estate-reserve-arabica-coffee-beans-500g',
    category: 'grocery',
    subcategory: 'Coffee & Tea',
    brand: 'Gourmet Pantry',
    price: 549,
    originalPrice: 899,
    discount: 39,
    rating: 4.9,
    reviewCount: 2840,
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-8',
    sellerName: 'Gourmet Pantry India',
    stock: 90,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 75,
    freeDelivery: true,
    description: 'Sourced directly from altitude plantations in Coorg and Chikmagalur. Micro-batch roasted with notes of dark chocolate, caramel, and toasted almond with zero bitterness.',
    features: [
      '100% Grade A Shade-Grown Arabica beans roasted fresh weekly',
      'Tasting Notes: Dark Chocolate, Roasted Hazelnut, Caramel Sweetness',
      'Degassing one-way valve pouch locks in freshness for up to 6 months',
      'Ideal for French Press, Espresso machines, South Indian filter, and AeroPress'
    ],
    specifications: {
      'Weight': '500 grams',
      'Roast Level': 'Medium-Dark Roast',
      'Origin': 'Chikmagalur, Karnataka (Altitude 3800 ft)',
      'Bean Type': '100% Pure Whole Arabica Beans'
    }
  },
  {
    id: 'prod-24',
    name: 'Raw Himalayan Wild Honey 100% Pure Unprocessed NMR Tested (500g)',
    slug: 'raw-himalayan-wild-honey-unprocessed-500g',
    category: 'grocery',
    subcategory: 'Gourmet Foods',
    brand: 'Gourmet Pantry',
    price: 499,
    originalPrice: 850,
    discount: 41,
    rating: 4.7,
    reviewCount: 1650,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-8',
    sellerName: 'Gourmet Pantry India',
    stock: 85,
    isDealOfDay: false,
    isBestSeller: false,
    isFlashSale: true,
    claimedPercentage: 88,
    freeDelivery: false,
    description: 'Extracted naturally from wild beehives in the pristine valleys of Uttarakhand. Unfiltered, unpasteurized, and NMR laboratory certified to contain zero added sugar or adulterants.',
    features: [
      '100% Natural Raw Forest Honey directly harvested from wild bees',
      'Retains natural pollen, active enzymes, and natural antibacterial properties',
      'Certified NMR (Nuclear Magnetic Resonance) tested for pure authenticity',
      'Packed in a food-safe premium hexagonal glass jar'
    ],
    specifications: {
      'Net Weight': '500 grams',
      'Purity': '100% Raw, Unheated, Unfiltered',
      'Origin': 'Himalayan Foothills, Uttarakhand',
      'Shelf Life': '18 Months'
    }
  },

  // 25-32: Books, Sports & Toys
  {
    id: 'prod-25',
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits (Hardcover)',
    slug: 'atomic-habits-james-clear-hardcover',
    category: 'books',
    subcategory: 'Self-Help',
    brand: 'Scholar Books',
    price: 599,
    originalPrice: 999,
    discount: 40,
    rating: 4.9,
    reviewCount: 18450,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-9',
    sellerName: 'Scholar Book House',
    stock: 200,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 94,
    freeDelivery: true,
    description: 'The #1 New York Times bestseller by James Clear. Discover practical strategies that teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    features: [
      'Premium Hardcover Collector Edition with ribbon bookmark',
      'Clear, actionable 4-step framework based on psychology and neuroscience',
      'Includes downloadable cheat sheets and habit trackers',
      'Over 15 Million copies sold worldwide'
    ],
    specifications: {
      'Author': 'James Clear',
      'Publisher': 'Random House Business',
      'Pages': '320 Pages',
      'Language': 'English'
    }
  },
  {
    id: 'prod-26',
    name: 'The Psychology of Money: Timeless Lessons on Wealth, Greed & Happiness',
    slug: 'the-psychology-of-money-morgan-housel',
    category: 'books',
    subcategory: 'Finance',
    brand: 'Scholar Books',
    price: 349,
    originalPrice: 499,
    discount: 30,
    rating: 4.8,
    reviewCount: 14200,
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-9',
    sellerName: 'Scholar Book House',
    stock: 150,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 70,
    freeDelivery: false,
    description: 'Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life most important topics.',
    features: [
      'Bestselling personal finance guide translated into 40+ languages',
      'Focuses on behavioral psychology rather than dry mathematical formulas',
      'Engaging, fast-paced read with real-world case studies of investors',
      'High-quality acid-free paper print'
    ],
    specifications: {
      'Author': 'Morgan Housel',
      'Publisher': 'Harriman House',
      'Pages': '256 Pages',
      'Binding': 'Paperback'
    }
  },
  {
    id: 'prod-27',
    name: 'Apex Pro High-Density TPE Eco Yoga Mat 6mm with Alignment Lines',
    slug: 'apex-pro-tpe-eco-yoga-mat-6mm',
    category: 'sports',
    subcategory: 'Fitness',
    brand: 'Apex Athletic',
    price: 1199,
    originalPrice: 2499,
    discount: 52,
    rating: 4.8,
    reviewCount: 3120,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-6',
    sellerName: 'Apex Athletic Gear',
    stock: 60,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 81,
    freeDelivery: true,
    description: 'Non-slip dual-textured surface with laser-etched posture alignment guidelines. 6mm optimal joint cushioning made from 100% recyclable, non-toxic eco TPE rubber.',
    features: [
      'Non-slip textured grip works even during sweaty hot yoga sessions',
      'Body alignment system helps yogis of all levels position hands & feet accurately',
      '6mm thickness provides superior knee and spine cushioning',
      'Includes complimentary shoulder carry strap and moisture-proof travel bag'
    ],
    specifications: {
      'Dimensions': '183 cm x 61 cm x 6 mm',
      'Material': 'Eco-Friendly Biodegradable TPE',
      'Weight': '950 grams',
      'Color': 'Dual Tone Teal & Charcoal'
    }
  },
  {
    id: 'prod-28',
    name: 'Adjustable Cast Iron Dumbbell Set (20kg) with Extension Bar for Barbell Conversion',
    slug: 'adjustable-cast-iron-dumbbell-set-20kg',
    category: 'sports',
    subcategory: 'Strength Training',
    brand: 'Apex Athletic',
    price: 2899,
    originalPrice: 5999,
    discount: 51,
    rating: 4.7,
    reviewCount: 1840,
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-6',
    sellerName: 'Apex Athletic Gear',
    stock: 25,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: true,
    claimedPercentage: 79,
    freeDelivery: true,
    description: 'Heavy duty electroplated cast iron weight plates with spinlock safety collars and a padded connecting extension rod to convert dumbbells into a full 4-foot barbell instantly.',
    features: [
      '20kg Complete Set: 4x 1.25kg, 4x 1.5kg, 4x 2kg plates + 2 rods + connector',
      'High-grade rust-resistant electroplated baked enamel finish',
      'Knurled anti-slip handles provide a secure grip during heavy deadlifts and presses',
      'Dual-function design saves floor space in home gyms'
    ],
    specifications: {
      'Total Weight': '20 kg',
      'Plates Material': 'Solid Cast Iron',
      'Bar Length': 'Dumbbell: 35cm, Barbell Mode: 110cm',
      'Collars': '4x Spinlock Star Collars'
    }
  },
  {
    id: 'prod-29',
    name: 'STEM Robotics 12-in-1 Solar Powered Building Robot Kit for Kids',
    slug: 'stem-robotics-solar-robot-kit-kids',
    category: 'toys',
    subcategory: 'Educational Toys',
    brand: 'Little Explorers',
    price: 1399,
    originalPrice: 2999,
    discount: 53,
    rating: 4.6,
    reviewCount: 890,
    images: [
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-10',
    sellerName: 'Little Explorers Toys',
    stock: 45,
    isDealOfDay: true,
    isBestSeller: false,
    isFlashSale: false,
    claimedPercentage: 66,
    freeDelivery: true,
    description: 'Inspire young engineers with 12 distinct walking, crawling, and swimming robots powered by real solar energy. No batteries required. Develops logical thinking and STEM curiosity.',
    features: [
      'Builds 12 different robot models across two skill challenge levels',
      'Powered directly by sunlight with a high-efficiency miniature solar panel',
      'Encourages hand-eye coordination, spatial problem-solving, and STEM skills',
      'Constructed with child-safe, BPA-free, non-toxic ABS plastic'
    ],
    specifications: {
      'Age Group': '8 to 14 Years',
      'Parts Count': '190 Pieces',
      'Power Source': 'Solar Powered (Optional battery pack included)',
      'Certifications': 'BIS Safety Certified'
    }
  },
  {
    id: 'prod-30',
    name: 'Artisan Solid Oak Wooden Jigsaw Puzzle (300 Pieces - Royal Bengal Tiger)',
    slug: 'wooden-jigsaw-puzzle-bengal-tiger',
    category: 'toys',
    subcategory: 'Puzzles',
    brand: 'Little Explorers',
    price: 899,
    originalPrice: 1999,
    discount: 55,
    rating: 4.8,
    reviewCount: 620,
    images: [
      'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 's-10',
    sellerName: 'Little Explorers Toys',
    stock: 30,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: true,
    claimedPercentage: 83,
    freeDelivery: true,
    description: 'Precision laser-cut wooden pieces featuring 30+ animal-shaped whimsy figures nestled inside. Beautiful vibrant UV printing in a premium magnetic keepsake wooden gift box.',
    features: [
      'Laser-cut 4mm thick solid basswood pieces that fit together satisfyingly',
      'Includes dozens of unique animal-shaped silhouette whimsy puzzle cuts',
      'Vivid fade-resistant archival UV pigment print',
      'Packaged in an engraved wooden box suitable for gift giving'
    ],
    specifications: {
      'Pieces': '300 Laser Cut Wood Pieces',
      'Assembled Size': '38 x 28 cm',
      'Material': 'Natural Birch Basswood',
      'Recommended Age': '10+ Years & Adults'
    }
  },

  // 31-50: More Across All Popular Categories for Dense Variety
  {
    id: 'prod-31',
    name: 'ProBass Wireless Earbuds with ENC Quad Mic and 40H Playtime',
    slug: 'probass-wireless-earbuds-enc',
    category: 'electronics',
    subcategory: 'Headphones',
    brand: 'SoundCraft',
    price: 1299,
    originalPrice: 3999,
    discount: 67,
    rating: 4.5,
    reviewCount: 7800,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
    sellerId: 's-4',
    sellerName: 'SoundCraft Audio Labs',
    stock: 110,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 89,
    freeDelivery: true,
    description: 'Crystal clear voice calls powered by Environmental Noise Cancellation, 13mm bass drivers, ultra low-latency 45ms gaming mode, and IPX5 sweat resistance.',
    features: ['13mm Dynamic Bass Drivers', '4-Mic Environmental Noise Cancellation', '40 Hours Battery with Type-C Case', 'Fast Pair Bluetooth 5.3'],
    specifications: { 'Driver': '13mm', 'Bluetooth': '5.3', 'IP Rating': 'IPX5' }
  },
  {
    id: 'prod-32',
    name: 'SpeedPro 10000mAh Ultra-Slim Power Bank (22.5W Fast Charge)',
    slug: 'speedpro-10000mah-fast-charge-power-bank',
    category: 'mobiles',
    subcategory: 'Accessories',
    brand: 'TechWorld',
    price: 999,
    originalPrice: 2299,
    discount: 56,
    rating: 4.6,
    reviewCount: 5120,
    images: ['https://images.unsplash.com/photo-1609592426829-16625a666992?w=800&auto=format&fit=crop&q=80'],
    sellerId: 's-1',
    sellerName: 'TechWorld Store',
    stock: 140,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: true,
    claimedPercentage: 91,
    freeDelivery: true,
    description: 'Pocket-friendly metallic power bank with dual USB-A and bidirectional Type-C PD 22.5W rapid charging for iPhones and Android devices.',
    features: ['22.5W Two-Way Fast Charging', 'Slim 14mm Aerospace Aluminum Body', '12-Layer Smart Circuit Protection', 'Charges 3 Devices Simultaneously'],
    specifications: { 'Capacity': '10,000 mAh', 'Output': '22.5W Max', 'Weight': '210g' }
  },
  {
    id: 'prod-33',
    name: 'SmartChef Automatic Bread Maker & Dough Kneader with 19 Presets',
    slug: 'smartchef-automatic-bread-maker',
    category: 'kitchen',
    subcategory: 'Kitchen Appliances',
    brand: 'HomeCraft',
    price: 6499,
    originalPrice: 12999,
    discount: 50,
    rating: 4.7,
    reviewCount: 420,
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'],
    sellerId: 's-3',
    sellerName: 'HomeCraft Living',
    stock: 18,
    isDealOfDay: false,
    isBestSeller: false,
    isFlashSale: false,
    claimedPercentage: 35,
    freeDelivery: true,
    description: 'Bake artisan multigrain breads, knead roti dough in 5 minutes, and prepare fresh fruit jams with fully automatic touch controls and 15-hour delay timer.',
    features: ['19 Pre-Programmed Baking Menus', 'Automatic Nut & Fruit Dispenser', '3 Crust Color Settings: Light, Medium, Dark', 'Includes Measuring Cup & Kneading Blade'],
    specifications: { 'Loaf Capacity': '1000g / 750g / 500g', 'Power': '650 Watts', 'Body': 'Brushed Stainless Steel' }
  },
  {
    id: 'prod-34',
    name: 'Castello Ergonomic High-Back Mesh Executive Office Chair',
    slug: 'castello-ergonomic-office-chair',
    category: 'furniture',
    subcategory: 'Furniture',
    brand: 'HomeCraft',
    price: 7999,
    originalPrice: 15999,
    discount: 50,
    rating: 4.8,
    reviewCount: 1240,
    images: ['https://images.unsplash.com/photo-1580481077195-c3a821a506cb?w=800&auto=format&fit=crop&q=80'],
    sellerId: 's-3',
    sellerName: 'HomeCraft Living',
    stock: 22,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 74,
    freeDelivery: true,
    description: 'Engineered for 10+ hours of continuous posture support. Features dynamic 3D lumbar support, breathable Korean mesh back, and 135° recline with footrest.',
    features: ['Adaptive 3D Lumbar Support matches spinal curvature', 'Multi-angle tilt lock up to 135 degrees', 'BIFMA Class 4 Heavy-Duty Gas Lift', '3D Adjustable Armrests (Height, Angle, Depth)'],
    specifications: { 'Max Load': '150 kg', 'Mechanism': 'Synchro-Tilt Lock', 'Base': 'Heavy Chrome Metal' }
  },
  {
    id: 'prod-35',
    name: 'UrbanStyle Oversized Heavyweight Cotton Graphic Hoodie',
    slug: 'urbanstyle-oversized-cotton-hoodie',
    category: 'fashion',
    subcategory: "Men's Fashion",
    brand: 'FashionHub',
    price: 1499,
    originalPrice: 3499,
    discount: 57,
    rating: 4.6,
    reviewCount: 1540,
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80'],
    sellerId: 's-2',
    sellerName: 'FashionHub Trends',
    stock: 55,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: true,
    claimedPercentage: 85,
    freeDelivery: true,
    description: '380 GSM ultra-heavyweight brushed fleece interior. Streetwear boxy drop-shoulder cut with double-layered hood and front kangaroo pocket.',
    features: ['380 GSM 100% Super Combed Cotton Fleece', 'Pre-shrunk fabric with screen printed graphic', 'Double-needle stitched cuffs and ribbed hem', 'Comfortable relaxed drop-shoulder streetwear fit'],
    specifications: { 'GSM': '380 GSM', 'Material': '100% Combed Cotton', 'Sizes': 'S, M, L, XL, XXL' }
  },
  {
    id: 'prod-36',
    name: 'Kashmiri Silk Saree with Rich Zari Weaving and Unstitched Blouse',
    slug: 'kashmiri-silk-saree-zari-weaving',
    category: 'fashion',
    subcategory: "Women's Fashion",
    brand: 'FashionHub',
    price: 2499,
    originalPrice: 6999,
    discount: 64,
    rating: 4.9,
    reviewCount: 890,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'],
    sellerId: 's-2',
    sellerName: 'FashionHub Trends',
    stock: 28,
    isDealOfDay: true,
    isBestSeller: false,
    isFlashSale: false,
    claimedPercentage: 65,
    freeDelivery: true,
    description: 'Lustrous woven art silk saree featuring intricate floral meenakari motifs and gleaming gold zari border. Perfect for weddings, festivities, and special ceremonies.',
    features: ['Traditional Banarasi/Kashmiri inspired zari border work', 'Includes 0.8 meter matching unstitched blouse fabric', 'Soft flowing drape that stays wrinkle-free throughout events', 'Comes packaged in a reusable luxury satin saree bag'],
    specifications: { 'Saree Length': '5.5 Meters', 'Blouse Piece': '0.8 Meters', 'Fabric': 'Art Silk with Gold Zari' }
  },
  {
    id: 'prod-37',
    name: 'Pure Moroccan Argan Oil Cold-Pressed for Hair & Skin (100ml)',
    slug: 'pure-moroccan-argan-oil-cold-pressed',
    category: 'beauty',
    subcategory: 'Hair Care',
    brand: 'PureGlow',
    price: 699,
    originalPrice: 1499,
    discount: 53,
    rating: 4.8,
    reviewCount: 3200,
    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80'],
    sellerId: 's-5',
    sellerName: 'PureGlow Botanicals',
    stock: 75,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 70,
    freeDelivery: true,
    description: '100% pure organic virgin Argan oil cold pressed from Moroccan argan kernels. Tames frizz, restores hair shine, and locks in deep skin moisture.',
    features: ['Rich in Natural Vitamin E and Essential Omega-6 Fatty Acids', 'Controls split ends and heat damage from styling tools', 'Non-comedogenic and absorbs quickly into skin and scalp', 'Chemical, hexane, and artificial fragrance free'],
    specifications: { 'Volume': '100 ml', 'Extraction': 'First Cold Pressed Virgin', 'Origin': 'Morocco' }
  },
  {
    id: 'prod-38',
    name: 'Organic Royal Kashmiri Walnuts Kernels Giri (500g Vacuum Packed)',
    slug: 'organic-kashmiri-walnut-kernels-500g',
    category: 'grocery',
    subcategory: 'Dry Fruits',
    brand: 'Gourmet Pantry',
    price: 649,
    originalPrice: 1199,
    discount: 45,
    rating: 4.8,
    reviewCount: 2100,
    images: ['https://images.unsplash.com/photo-1543208541-00429edb185e?w=800&auto=format&fit=crop&q=80'],
    sellerId: 's-8',
    sellerName: 'Gourmet Pantry India',
    stock: 80,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 77,
    freeDelivery: true,
    description: 'Hand-cracked halves of authentic Kashmiri snow-fed walnuts. Packed with Omega-3 DHA fatty acids and antioxidants for brain health and heart wellness.',
    features: ['100% Whole Halves & Extra Light amber color kernels', 'Naturally high in plant-based Omega-3 ALA', 'Vacuum sealed nitrogen flushed freshness lock pouch', 'Zero chemical bleaching or preservatives'],
    specifications: { 'Weight': '500g', 'Grade': 'Royal Snow White Extra Light', 'Origin': 'Kashmir Valley' }
  },
  {
    id: 'prod-39',
    name: 'Wings of Fire: An Autobiography of APJ Abdul Kalam (Paperback)',
    slug: 'wings-of-fire-apj-abdul-kalam',
    category: 'books',
    subcategory: 'Biographies',
    brand: 'Scholar Books',
    price: 279,
    originalPrice: 450,
    discount: 38,
    rating: 4.9,
    reviewCount: 22100,
    images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80'],
    sellerId: 's-9',
    sellerName: 'Scholar Book House',
    stock: 180,
    isDealOfDay: false,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 96,
    freeDelivery: false,
    description: 'The deeply inspiring life journey of Dr. APJ Abdul Kalam, from a humble boyhood in Rameswaram to leading India space launch vehicle and missile defense programs.',
    features: ['Inspiring national bestseller read by millions of students & leaders', 'Heartwarming insights into science, perseverance, and spirituality', 'Includes rare archival photographs from ISRO and DRDO', 'Clear accessible English translation'],
    specifications: { 'Author': 'Dr. APJ Abdul Kalam with Arun Tiwari', 'Pages': '180 Pages', 'Publisher': 'Universities Press' }
  },
  {
    id: 'prod-40',
    name: 'Smart Hydration Insulated Stainless Steel Water Bottle 1L (24H Cold / 12H Hot)',
    slug: 'smart-hydration-insulated-bottle-1l',
    category: 'sports',
    subcategory: 'Outdoor',
    brand: 'Apex Athletic',
    price: 799,
    originalPrice: 1699,
    discount: 53,
    rating: 4.7,
    reviewCount: 4190,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80'],
    sellerId: 's-6',
    sellerName: 'Apex Athletic Gear',
    stock: 95,
    isDealOfDay: true,
    isBestSeller: true,
    isFlashSale: false,
    claimedPercentage: 88,
    freeDelivery: true,
    description: 'Double-walled vacuum insulated 18/8 food-grade stainless steel with sweat-proof powder coating. Keeps beverages ice-cold for 24 hours or steaming hot for 12 hours.',
    features: ['Vacuum Wall Insulation with copper lining', 'Leak-proof spout lid with ergonomic carry handle', 'BPA-free and imparts no metallic flavor', 'Fits easily into car cup holders and gym side pockets'],
    specifications: { 'Capacity': '1000 ml', 'Material': 'Pro-Grade 18/8 Stainless Steel', 'Insulation': '24H Cold / 12H Hot' }
  },
  ...MORE_PRODUCTS
];

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    title: 'Great Deals on Electronics & Audio',
    subtitle: 'Up to 65% Off on Headphones, Laptops & Smartwatches',
    ctaText: 'Shop Electronics',
    link: '/category/electronics',
    tag: 'FESTIVAL SPECIAL',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&auto=format&fit=crop&q=85',
    color: 'from-blue-950 via-slate-900 to-transparent'
  },
  {
    id: 'slide-2',
    title: 'Grand Fashion & Wardrobe Upgrade',
    subtitle: 'Latest ethnic & western trends starting at ₹499',
    ctaText: 'Explore Fashion',
    link: '/category/fashion',
    tag: 'NEW ARRIVALS',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&auto=format&fit=crop&q=85',
    color: 'from-amber-950 via-neutral-900 to-transparent'
  },
  {
    id: 'slide-3',
    title: 'Transform Your Home & Kitchen',
    subtitle: 'Smart appliances, solid wood living & cookware sets',
    ctaText: 'Shop Home & Living',
    link: '/category/kitchen',
    tag: 'BEST SELLERS',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1920&auto=format&fit=crop&q=85',
    color: 'from-emerald-950 via-slate-900 to-transparent'
  },
  {
    id: 'slide-4',
    title: 'Next-Gen 5G Smartphones & Tech',
    subtitle: 'Exchange bonus up to ₹10,000 & No-Cost EMI options',
    ctaText: 'Explore Mobiles',
    link: '/category/mobiles',
    tag: 'LIMITED TIME',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&auto=format&fit=crop&q=85',
    color: 'from-indigo-950 via-slate-950 to-transparent'
  },
  {
    id: 'slide-5',
    title: 'Verified Independent Sellers on BazaarHub',
    subtitle: 'Support over 10,000+ local artisans & verified stores',
    ctaText: 'Explore Top Sellers',
    link: '/shop',
    tag: 'VETTER SELLERS',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&auto=format&fit=crop&q=85',
    color: 'from-purple-950 via-slate-900 to-transparent'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Rohan Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '18 September 2026',
    verified: true,
    title: 'Worth every rupee! ANC is mind-blowing',
    comment: 'The noise cancellation completely blocks out traffic and metro noise. Battery life lasts nearly a week on a single charge. High frequencies are crisp and bass does not distort at high volume.'
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
    comment: 'The ear cups are extremely soft protein leather. I wear them for 6-8 hours daily while working from home without any ear fatigue. Microphone voice clarity is outstanding.'
  },
  {
    id: 'rev-3',
    productId: 'prod-5',
    userName: 'Vikram Joshi',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    rating: 4,
    date: '12 September 2026',
    verified: true,
    title: 'Brilliant display and fast 67W charging',
    comment: 'Phone feels premium in hand. 120Hz curved AMOLED panel is buttery smooth. Camera in daylight takes sharp 108MP photos with natural skin tones.'
  }
];
