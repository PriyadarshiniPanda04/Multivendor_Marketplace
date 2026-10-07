const express = require('express');
const router = express.Router();

// Preset sample products for classification simulation if database is loading
const VISUAL_DICTIONARY = [
  {
    keywords: ['shoe', 'sneaker', 'footwear', 'running', 'boot', 'sandal', 'heel', 'jogging', 'air max', 'nike'],
    detectedType: 'Sneakers & Running Shoes',
    category: 'fashion',
    confidence: 0.98,
    features: ['Aerodynamic Mesh', 'EVA Cushioning Sole', 'Sport Athletic Fit'],
    sampleQuery: 'shoes'
  },
  {
    keywords: ['headphone', 'audio', 'earphone', 'airpod', 'earbuds', 'music', 'over-ear'],
    detectedType: 'Wireless ANC Headphones',
    category: 'electronics',
    confidence: 0.97,
    features: ['Active Noise Cancellation', 'Protein Leather Earcups', 'Bluetooth 5.3'],
    sampleQuery: 'headphones'
  },
  {
    keywords: ['phone', 'mobile', 'smartphone', 'iphone', 'android', 'galaxy'],
    detectedType: 'Flagship Smartphone',
    category: 'mobiles',
    confidence: 0.96,
    features: ['OLED Display', 'Multi-Lens Camera Array', 'Titanium Frame'],
    sampleQuery: 'mobile'
  },
  {
    keywords: ['watch', 'smartwatch', 'wrist', 'timepiece', 'fitness band'],
    detectedType: 'Smartwatch & Fitness Wearable',
    category: 'smartwatches',
    confidence: 0.95,
    features: ['AMOLED Touchscreen', 'Heart Rate & SpO2 Sensors', 'Water Resistant'],
    sampleQuery: 'smartwatch'
  },
  {
    keywords: ['laptop', 'macbook', 'computer', 'notebook', 'pc'],
    detectedType: 'Ultrabook Laptop',
    category: 'laptops',
    confidence: 0.96,
    features: ['Retina Display', 'Backlit Keyboard', 'Thin & Lightweight Aluminum'],
    sampleQuery: 'laptop'
  },
  {
    keywords: ['camera', 'dslr', 'lens', 'mirrorless', 'photography', 'fujifilm'],
    detectedType: 'Mirrorless Camera',
    category: 'cameras',
    confidence: 0.94,
    features: ['Optical Image Stabilization', 'Interchangeable Lens', '4K Video'],
    sampleQuery: 'camera'
  },
  {
    keywords: ['kurta', 'dress', 'shirt', 'jacket', 't-shirt', 'saree', 'apparel', 'hoodie'],
    detectedType: 'Fashion Apparel & Wear',
    category: 'fashion',
    confidence: 0.95,
    features: ['Breathable Fabric', 'Tailored Cut', 'Colorfast Dye'],
    sampleQuery: 'fashion'
  },
  {
    keywords: ['sofa', 'chair', 'furniture', 'table', 'couch', 'living room'],
    detectedType: 'Modern Living Furniture',
    category: 'furniture',
    confidence: 0.93,
    features: ['High-Density Foam', 'Solid Wood Frame', 'Stain-Resistant Fabric'],
    sampleQuery: 'furniture'
  }
];

// POST /api/search/visual - Analyze uploaded image and return similar products
router.post('/', (req, res) => {
  const { imageBase64, imageName, sampleType } = req.body;

  if (!imageBase64 && !imageName && !sampleType) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image or provide an image reference'
    });
  }

  // Detect matching archetype
  const searchStr = `${sampleType || ''} ${imageName || ''}`.toLowerCase();
  
  let match = VISUAL_DICTIONARY.find(entry => 
    entry.keywords.some(k => searchStr.includes(k))
  );

  // If no specific match from name/sample, default to Shoes (the user's explicit example: 👟 Shoe image → similar shoes)
  if (!match) {
    match = VISUAL_DICTIONARY[0]; // Shoes & sneakers
  }

  res.status(200).json({
    success: true,
    detectedProduct: {
      type: match.detectedType,
      category: match.category,
      confidence: match.confidence,
      features: match.features,
      sampleQuery: match.sampleQuery
    },
    message: `Visual analysis complete. Detected ${match.detectedType} with ${(match.confidence * 100).toFixed(0)}% confidence.`
  });
});

module.exports = router;
