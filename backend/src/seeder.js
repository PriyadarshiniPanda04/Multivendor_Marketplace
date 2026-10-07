const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User, Vendor, Category, Product } = require('./models');

dotenv.config();

const categoriesData = [
  { name: 'Electronics & Audio', slug: 'electronics-audio', description: 'Headphones, speakers, smart devices, and gadgets' },
  { name: 'Watches & Jewelry', slug: 'watches-jewelry', description: 'Luxury timepieces, chronographs, rings, and handcrafted jewelry' },
  { name: 'Apparel & Fashion', slug: 'apparel-fashion', description: 'Designer clothing, jackets, leather goods, and footwear' },
  { name: 'Home & Living', slug: 'home-living', description: 'Modern furniture, minimalist lamps, ceramic decor, and kitchenware' },
  { name: 'Fitness & Outdoors', slug: 'fitness-outdoors', description: 'Camp gear, yoga mats, sports wear, and performance accessories' },
  { name: 'Beauty & Wellness', slug: 'beauty-wellness', description: 'Organic skincare, herbal oils, aromatherapy, and self-care essentials' }
];

const vendorsData = [
  {
    userName: 'Marcus Vance',
    email: 'soundcraft@marketplace.com',
    storeName: 'SoundCraft Audio',
    slug: 'soundcraft-audio',
    description: 'Precision-engineered wireless acoustics, audiophile studio monitors, and hybrid active noise-cancelling headphones.'
  },
  {
    userName: 'Elena Rostova',
    email: 'atelier@marketplace.com',
    storeName: 'Atelier Horology',
    slug: 'atelier-horology',
    description: 'Bespoke automatic timepieces and Swiss-inspired minimalist chronographs built with surgical-grade titanium.'
  },
  {
    userName: 'Liam Thorne',
    email: 'lumina@marketplace.com',
    storeName: 'Lumina Home Studio',
    slug: 'lumina-home',
    description: 'Scandinavian-designed solid wood furnishings, ambient acoustic lamps, and sustainable interior essentials.'
  },
  {
    userName: 'Matteo Rossi',
    email: 'tuscan@marketplace.com',
    storeName: 'Tuscan Hide Co.',
    slug: 'tuscan-hide',
    description: 'Traditional vegetable-tanned full-grain leather bags, handcrafted wallets, and timeless travel luggage.'
  },
  {
    userName: 'Aria Chen',
    email: 'novatech@marketplace.com',
    storeName: 'NovaTech Gear',
    slug: 'novatech-gear',
    description: 'Next-generation ergonomic mechanical peripherals, magnetic cables, and productivity desk setups.'
  }
];

const sampleProducts = [
  {
    name: 'AeroWave Pro Active Noise Cancelling Wireless Headphones',
    slug: 'aerowave-pro-anc-wireless-headphones',
    description: 'Engineered for audio purists. Features 40mm titanium drivers, 45-hour battery reserve, active spatial sound, and ultra-plush protein leather earcups.',
    categorySlug: 'electronics-audio',
    vendorSlug: 'soundcraft-audio',
    price: 249.99,
    discountPrice: 189.99,
    countInStock: 35,
    sku: 'SND-ANC-01',
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 124,
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', isPrimary: true }
    ],
    attributes: [
      { name: 'Connectivity', value: 'Bluetooth 5.3 + 3.5mm Aux' },
      { name: 'Battery Life', value: '45 Hours' }
    ]
  },
  {
    name: 'Horizon Minimalist Titanium Automatic Chronograph Watch',
    slug: 'horizon-minimalist-titanium-chronograph-watch',
    description: 'Constructed from lightweight Grade 5 Aerospace Titanium with sapphire crystal glass, 100M water resistance, and an exhibition caseback.',
    categorySlug: 'watches-jewelry',
    vendorSlug: 'atelier-horology',
    price: 380.00,
    discountPrice: 320.00,
    countInStock: 18,
    sku: 'HOR-TIT-02',
    isFeatured: true,
    ratingsAverage: 4.8,
    ratingsQuantity: 62,
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', isPrimary: true }
    ],
    attributes: [
      { name: 'Case Material', value: 'Grade 5 Titanium' },
      { name: 'Movement', value: 'Japanese Automatic Calibre' }
    ]
  },
  {
    name: 'Nordic Solid Oak Minimalist Desk Lamp with Fast Qi Wireless Charging',
    slug: 'nordic-solid-oak-desk-lamp',
    description: 'Warm ambient illumination paired with certified 15W Qi wireless charging pad embedded directly in sustainably harvested solid oak.',
    categorySlug: 'home-living',
    vendorSlug: 'lumina-home',
    price: 129.00,
    discountPrice: 99.00,
    countInStock: 42,
    sku: 'LUM-OAK-03',
    isFeatured: true,
    ratingsAverage: 4.7,
    ratingsQuantity: 41,
    images: [
      { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', isPrimary: true }
    ],
    attributes: [
      { name: 'Material', value: 'FSC Certified Solid Oak + Brushed Brass' },
      { name: 'Color Temp', value: '2700K - 4500K Adjustable' }
    ]
  },
  {
    name: 'Artisan Vegetable-Tanned Italian Leather Travel Duffle Bag',
    slug: 'artisan-vegetable-tanned-leather-duffle',
    description: 'Handcrafted in Florence using certified vegetable-tanned full grain calfskin. Features solid YKK brass zippers and water-resistant cotton lining.',
    categorySlug: 'apparel-fashion',
    vendorSlug: 'tuscan-hide',
    price: 360.00,
    discountPrice: 295.00,
    countInStock: 12,
    sku: 'TUS-BAG-04',
    isFeatured: true,
    ratingsAverage: 5.0,
    ratingsQuantity: 83,
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', isPrimary: true }
    ],
    attributes: [
      { name: 'Leather Grade', value: 'Full Grain Italian Leather' },
      { name: 'Capacity', value: '45 Liters' }
    ]
  },
  {
    name: 'CyberBlade Pro 75% Wireless Mechanical Keyboard with Gateron Switches',
    slug: 'cyberblade-pro-wireless-mechanical-keyboard',
    description: 'Gasket-mounted acoustic dampening, hot-swappable switches, PBT double-shot keycaps, and tri-mode wireless connectivity for mac and windows.',
    categorySlug: 'electronics-audio',
    vendorSlug: 'novatech-gear',
    price: 159.00,
    discountPrice: 135.00,
    countInStock: 50,
    sku: 'NOV-KEY-05',
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 97,
    images: [
      { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', isPrimary: true }
    ],
    attributes: [
      { name: 'Layout', value: '75% Compact (82 Keys)' },
      { name: 'Switch Type', value: 'Pre-lubed Gateron Yellow' }
    ]
  },
  {
    name: 'Vessel Studio Ceramic Matte Pour-Over Coffee Dripper Set',
    slug: 'vessel-studio-ceramic-matte-coffee-dripper',
    description: 'Double-walled thermal ceramic dripper with precision extraction grooves, accompanied by a 600ml borosilicate glass heatproof carafe.',
    categorySlug: 'home-living',
    vendorSlug: 'lumina-home',
    price: 65.00,
    discountPrice: 52.00,
    countInStock: 60,
    sku: 'LUM-COF-06',
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 34,
    images: [
      { url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', isPrimary: true }
    ],
    attributes: [
      { name: 'Capacity', value: '600ml / 2-4 Cups' },
      { name: 'Care', value: 'Dishwasher Safe' }
    ]
  },
  {
    name: 'Alpine Explorer All-Weather Waterproof Ripstop Roll-Top Pack',
    slug: 'alpine-explorer-waterproof-roll-top-pack',
    description: 'Constructed from lightweight 500D TPU laminated waterproof ripstop nylon. Ergonomic breathable shoulder harness with magnetic sternum clip.',
    categorySlug: 'fitness-outdoors',
    vendorSlug: 'tuscan-hide',
    price: 145.00,
    discountPrice: 119.00,
    countInStock: 25,
    sku: 'TUS-ALP-07',
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 28,
    images: [
      { url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80', isPrimary: true }
    ],
    attributes: [
      { name: 'Waterproof Rating', value: 'IPX6 Certified' },
      { name: 'Laptop Sleeve', value: 'Up to 16 inch' }
    ]
  },
  {
    name: 'SoundSphere 360 Portable Waterproof Bluetooth Outdoor Speaker',
    slug: 'soundsphere-360-portable-bluetooth-speaker',
    description: 'Immersive omnidirectional acoustics with dual passive bass radiators, IP67 dust and water resistance, and 24-hour play cycle.',
    categorySlug: 'electronics-audio',
    vendorSlug: 'soundcraft-audio',
    price: 110.00,
    discountPrice: 89.00,
    countInStock: 45,
    sku: 'SND-SPK-08',
    isFeatured: true,
    ratingsAverage: 4.8,
    ratingsQuantity: 73,
    images: [
      { url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', isPrimary: true }
    ],
    attributes: [
      { name: 'Water Resistance', value: 'IP67 Submersible' },
      { name: 'Range', value: '30 Meters' }
    ]
  },
  {
    name: 'Kanso Minimalist Japanese Chef Gyuto Knife with Rosewood Handle',
    slug: 'kanso-minimalist-japanese-gyuto-knife',
    description: 'Forged from AUS-10 67-layer Damascus super steel with 60±1 HRC hardness. Hand-sharpened to a razor-sharp 15° bevel per side.',
    categorySlug: 'home-living',
    vendorSlug: 'lumina-home',
    price: 175.00,
    discountPrice: 145.00,
    countInStock: 20,
    sku: 'LUM-KNF-09',
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 58,
    images: [
      { url: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&auto=format&fit=crop&q=80', isPrimary: true }
    ],
    attributes: [
      { name: 'Blade Length', value: '8 Inches (200mm)' },
      { name: 'Steel', value: 'AUS-10 67-Layer Damascus' }
    ]
  },
  {
    name: 'Chronos Heritage Chronometer Vintage Black Dial Watch',
    slug: 'chronos-heritage-chronometer-vintage-watch',
    description: 'Inspired by 1960s motorsport chronometers. High-domed sapphire glass, dual subdials, and genuine Horween leather strap.',
    categorySlug: 'watches-jewelry',
    vendorSlug: 'atelier-horology',
    price: 295.00,
    discountPrice: null,
    countInStock: 15,
    sku: 'HOR-CHR-10',
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 37,
    images: [
      { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80', isPrimary: true }
    ],
    attributes: [
      { name: 'Case Size', value: '39mm' },
      { name: 'Water Resistance', value: '50 Meters' }
    ]
  },
  {
    name: 'ErgoGlide Precision Magnetic Charging Wireless Gaming Mouse',
    slug: 'ergoglide-magnetic-charging-wireless-mouse',
    description: 'Ultralight 58g honeycomb reinforced chassis, 26,000 DPI optical sensor, optical switches, and fast contact charging dock.',
    categorySlug: 'electronics-audio',
    vendorSlug: 'novatech-gear',
    price: 89.99,
    discountPrice: 69.99,
    countInStock: 40,
    sku: 'NOV-MOU-11',
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 49,
    images: [
      { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', isPrimary: true }
    ],
    attributes: [
      { name: 'Weight', value: '58 grams' },
      { name: 'Battery', value: '80 Hours' }
    ]
  },
  {
    name: 'Serene Linen & Organic Bamboo Weighted Relax Blanket',
    slug: 'serene-linen-bamboo-weighted-blanket',
    description: 'Naturally cooling 100% bamboo viscose shell filled with hypoallergenic micro-glass beads for calm, restorative deep sleep.',
    categorySlug: 'home-living',
    vendorSlug: 'lumina-home',
    price: 139.00,
    discountPrice: 115.00,
    countInStock: 22,
    sku: 'LUM-BLN-12',
    isFeatured: false,
    ratingsAverage: 4.9,
    ratingsQuantity: 65,
    images: [
      { url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', isPrimary: true }
    ],
    attributes: [
      { name: 'Weight', value: '15 lbs (6.8 kg)' },
      { name: 'Dimensions', value: '60 x 80 inches' }
    ]
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected! Starting catalog seed...');

    // 1. Seed Categories
    console.log('Seeding categories...');
    const createdCategories = {};
    for (const cat of categoriesData) {
      let existingCat = await Category.findOne({ slug: cat.slug });
      if (!existingCat) {
        existingCat = await Category.create(cat);
      }
      createdCategories[cat.slug] = existingCat._id;
    }
    console.log(`Synced ${Object.keys(createdCategories).length} categories.`);

    // 2. Seed Users & Vendors
    console.log('Seeding merchants & stores...');
    const createdVendors = {};
    for (const v of vendorsData) {
      let user = await User.findOne({ email: v.email });
      if (!user) {
        user = await User.create({
          name: v.userName,
          email: v.email,
          password: 'Password123!',
          role: 'vendor'
        });
      }

      let vendor = await Vendor.findOne({ slug: v.slug });
      if (!vendor) {
        vendor = await Vendor.create({
          user: user._id,
          storeName: v.storeName,
          slug: v.slug,
          description: v.description,
          status: 'approved',
          rating: 4.9,
          numReviews: 48,
          commissionRate: 10
        });
      }
      createdVendors[v.slug] = vendor._id;
    }
    console.log(`Synced ${Object.keys(createdVendors).length} vendors.`);

    // 3. Seed Products
    console.log('Seeding products...');
    let seededCount = 0;
    for (const p of sampleProducts) {
      const categoryId = createdCategories[p.categorySlug];
      const vendorId = createdVendors[p.vendorSlug];

      let existingProd = await Product.findOne({ slug: p.slug });
      const productDoc = {
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: categoryId,
        vendor: vendorId,
        price: p.price,
        discountPrice: p.discountPrice,
        countInStock: p.countInStock,
        sku: p.sku,
        isFeatured: p.isFeatured,
        ratingsAverage: p.ratingsAverage,
        ratingsQuantity: p.ratingsQuantity,
        images: p.images,
        attributes: p.attributes,
        status: 'active'
      };

      if (!existingProd) {
        await Product.create(productDoc);
        seededCount++;
      } else {
        await Product.findByIdAndUpdate(existingProd._id, productDoc);
        seededCount++;
      }
    }

    console.log(`Successfully seeded ${seededCount} products into database!`);
    process.exit(0);
  } catch (error) {
    console.error('Seeder execution error:', error);
    process.exit(1);
  }
};

seedDatabase();
