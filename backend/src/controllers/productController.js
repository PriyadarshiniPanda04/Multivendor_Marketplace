const { Product, Vendor, Category } = require('../models');

// Helper to create URL-friendly slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

/**
 * @desc    Fetch all products with filtering, search, pagination, and sorting
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const filter = { status: 'active' };

    // Search keyword by name or description
    if (req.query.keyword) {
      filter.$text = { $search: req.query.keyword };
    }

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Vendor filter
    if (req.query.vendor) {
      filter.vendor = req.query.vendor;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Sort options
    let sort = { createdAt: -1 }; // default newest
    if (req.query.sort === 'price_asc') sort = { price: 1 };
    if (req.query.sort === 'price_desc') sort = { price: -1 };
    if (req.query.sort === 'rating') sort = { ratingsAverage: -1 };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('vendor', 'storeName slug logo rating')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching products'
    });
  }
};

/**
 * @desc    Get featured products for homepage
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, status: 'active' })
      .populate('category', 'name slug')
      .populate('vendor', 'storeName slug logo')
      .limit(8)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching featured products'
    });
  }
};

/**
 * @desc    Get single product by ID or slug
 * @route   GET /api/products/:idOrSlug
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const product = await Product.findOne(query)
      .populate('category', 'name slug')
      .populate('vendor', 'storeName slug description logo rating numReviews');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching product'
    });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Vendor only)
 */
const createProduct = async (req, res) => {
  try {
    // Find current user's vendor profile
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'You need an active vendor profile to list products'
      });
    }

    if (vendor.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: `Your vendor account is ${vendor.status}. Products can only be created once approved.`
      });
    }

    const {
      name,
      description,
      category,
      price,
      discountPrice,
      countInStock,
      sku,
      images,
      attributes,
      isFeatured,
      status
    } = req.body;

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, category, and price'
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Selected category does not exist'
      });
    }

    // Generate unique slug
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const product = await Product.create({
      vendor: vendor._id,
      name: name.trim(),
      slug,
      description,
      category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      countInStock: countInStock !== undefined ? Number(countInStock) : 0,
      sku: sku || '',
      images: images || [],
      attributes: attributes || [],
      isFeatured: isFeatured || false,
      status: status || 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating product'
    });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private (Product Owner Vendor or Admin)
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Ownership check (unless admin)
    if (req.user.role !== 'admin') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this product'
        });
      }
    }

    const {
      name,
      description,
      category,
      price,
      discountPrice,
      countInStock,
      sku,
      images,
      attributes,
      isFeatured,
      status
    } = req.body;

    if (name && name.trim() !== product.name) {
      product.name = name.trim();
      product.slug = slugify(name.trim());
    }

    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = discountPrice ? Number(discountPrice) : null;
    if (countInStock !== undefined) product.countInStock = Number(countInStock);
    if (sku !== undefined) product.sku = sku;
    if (images !== undefined) product.images = images;
    if (attributes !== undefined) product.attributes = attributes;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (status !== undefined) product.status = status;

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating product'
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private (Product Owner Vendor or Admin)
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Ownership check (unless admin)
    if (req.user.role !== 'admin') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this product'
        });
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting product'
    });
  }
};

/**
 * @desc    Get all products for the logged-in vendor
 * @route   GET /api/products/vendor/me
 * @access  Private (Vendor only)
 */
const getMyVendorProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = { vendor: vendor._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching vendor products'
    });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyVendorProducts
};
