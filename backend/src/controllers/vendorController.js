const { Vendor, User, Product, Order } = require('../models');

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
 * @desc    Register or setup a vendor store profile
 * @route   POST /api/vendors/register
 * @access  Private
 */
const registerVendor = async (req, res) => {
  try {
    const {
      storeName,
      description,
      contactEmail,
      contactPhone,
      address,
      logo,
      banner,
      payoutDetails
    } = req.body;

    if (!storeName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a store name'
      });
    }

    // Check if user already has a vendor profile
    const existingVendor = await Vendor.findOne({ user: req.user._id });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'You already have a vendor profile registered'
      });
    }

    // Check if store name is already taken
    const baseSlug = slugify(storeName);
    let slug = baseSlug;
    let counter = 1;
    while (await Vendor.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const vendor = await Vendor.create({
      user: req.user._id,
      storeName: storeName.trim(),
      slug,
      description: description || '',
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || req.user.phone || '',
      address: address || {},
      logo: logo || '',
      banner: banner || '',
      payoutDetails: payoutDetails || {},
      status: 'pending' // pending admin approval
    });

    // Upgrade user's role to vendor if currently customer
    if (req.user.role === 'customer') {
      await User.findByIdAndUpdate(req.user._id, { role: 'vendor' });
    }

    return res.status(201).json({
      success: true,
      message: 'Vendor application submitted successfully. It will be reviewed by admin.',
      data: vendor
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating vendor profile'
    });
  }
};

/**
 * @desc    Get current logged-in vendor's profile
 * @route   GET /api/vendors/me
 * @access  Private (Vendor only)
 */
const getMyVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id }).populate('user', 'name email phone avatar');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found for this user'
      });
    }

    return res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching vendor profile'
    });
  }
};

/**
 * @desc    Update current vendor's profile
 * @route   PUT /api/vendors/me
 * @access  Private (Vendor only)
 */
const updateMyVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    const {
      storeName,
      description,
      contactEmail,
      contactPhone,
      address,
      logo,
      banner,
      payoutDetails
    } = req.body;

    if (storeName && storeName.trim() !== vendor.storeName) {
      // Check if new store name is taken
      const storeExists = await Vendor.findOne({
        storeName: storeName.trim(),
        _id: { $ne: vendor._id }
      });
      if (storeExists) {
        return res.status(400).json({
          success: false,
          message: 'Store name is already taken'
        });
      }
      vendor.storeName = storeName.trim();
      vendor.slug = slugify(storeName.trim());
    }

    if (description !== undefined) vendor.description = description;
    if (contactEmail !== undefined) vendor.contactEmail = contactEmail;
    if (contactPhone !== undefined) vendor.contactPhone = contactPhone;
    if (address !== undefined) vendor.address = address;
    if (logo !== undefined) vendor.logo = logo;
    if (banner !== undefined) vendor.banner = banner;
    if (payoutDetails !== undefined) vendor.payoutDetails = payoutDetails;

    const updatedVendor = await vendor.save();

    return res.status(200).json({
      success: true,
      message: 'Vendor profile updated successfully',
      data: updatedVendor
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating vendor profile'
    });
  }
};

/**
 * @desc    Get all vendors (Public directory)
 * @route   GET /api/vendors
 * @access  Public
 */
const getAllVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const filter = { status: 'approved' };

    if (req.query.keyword) {
      filter.storeName = { $regex: req.query.keyword, $options: 'i' };
    }

    const total = await Vendor.countDocuments(filter);
    const vendors = await Vendor.find(filter)
      .select('storeName slug description logo banner rating numReviews')
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: vendors.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: vendors
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching vendors'
    });
  }
};

/**
 * @desc    Get single vendor by slug
 * @route   GET /api/vendors/:slug
 * @access  Public
 */
const getVendorBySlug = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ slug: req.params.slug });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor store not found'
      });
    }

    // Get product count
    const productCount = await Product.countDocuments({
      vendor: vendor._id,
      status: 'active'
    });

    return res.status(200).json({
      success: true,
      data: {
        vendor,
        totalProducts: productCount
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching vendor'
    });
  }
};

/**
 * @desc    Get vendor dashboard statistics
 * @route   GET /api/vendors/stats
 * @access  Private (Vendor only)
 */
const getVendorStats = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    // Total products count
    const totalProducts = await Product.countDocuments({ vendor: vendor._id });

    // Orders with items belonging to this vendor
    const orders = await Order.find({ 'orderItems.vendor': vendor._id });

    let totalRevenue = 0;
    let totalItemsSold = 0;

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.vendor.toString() === vendor._id.toString()) {
          totalItemsSold += item.quantity;
          if (order.isPaid) {
            totalRevenue += item.price * item.quantity;
          }
        }
      });
    });

    return res.status(200).json({
      success: true,
      data: {
        storeName: vendor.storeName,
        status: vendor.status,
        rating: vendor.rating,
        totalProducts,
        totalOrders: orders.length,
        totalItemsSold,
        totalRevenue: Math.round(totalRevenue * 100) / 100
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching vendor statistics'
    });
  }
};

/**
 * @desc    Admin: Update vendor status (approve, reject, suspend)
 * @route   PATCH /api/vendors/:id/status
 * @access  Private (Admin only)
 */
const updateVendorStatus = async (req, res) => {
  try {
    const { status, commissionRate } = req.body;

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (status) vendor.status = status;
    if (commissionRate !== undefined) vendor.commissionRate = commissionRate;

    const updatedVendor = await vendor.save();

    return res.status(200).json({
      success: true,
      message: `Vendor status updated to ${vendor.status}`,
      data: updatedVendor
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating vendor status'
    });
  }
};

module.exports = {
  registerVendor,
  getMyVendorProfile,
  updateMyVendorProfile,
  getAllVendors,
  getVendorBySlug,
  getVendorStats,
  updateVendorStatus
};
