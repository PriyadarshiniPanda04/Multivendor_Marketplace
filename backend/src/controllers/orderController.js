const { Order, Product, Vendor } = require('../models');
const { sendOrderConfirmationEmail, sendVendorOrderNotification } = require('../services/emailService');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private (Customer)
 */
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // Verify each product exists, is active, has enough stock, and attach its vendor
    const processedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`
        });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product "${product.name}". Available: ${product.countInStock}`
        });
      }

      // Deduct stock
      product.countInStock -= item.quantity;
      if (product.countInStock === 0) {
        product.status = 'out_of_stock';
      }
      await product.save();

      processedItems.push({
        product: product._id,
        vendor: product.vendor,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0].url : '',
        price: product.discountPrice || product.price,
        quantity: item.quantity,
        itemStatus: 'pending'
      });
    }

    const order = await Order.create({
      customer: req.user._id,
      orderItems: processedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice),
      orderStatus: 'placed'
    });

    // Send asynchronous order confirmation to customer
    sendOrderConfirmationEmail({
      order,
      customerEmail: req.user.email,
      customerName: req.user.name
    }).catch(err => console.warn('Order confirmation email could not be sent:', err.message));

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating order'
    });
  }
};

/**
 * @desc    Get order details by ID
 * @route   GET /api/orders/:id
 * @access  Private (Owner customer, relevant Vendor, or Admin)
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('orderItems.product', 'name slug images')
      .populate('orderItems.vendor', 'storeName slug logo');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Authorization check: User must be either the customer, an admin, or a vendor in the order
    const isCustomer = order.customer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    let isVendorInOrder = false;
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (vendor) {
        isVendorInOrder = order.orderItems.some(
          item => item.vendor && item.vendor._id.toString() === vendor._id.toString()
        );
      }
    }

    if (!isCustomer && !isAdmin && !isVendorInOrder) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching order'
    });
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private (Customer)
 */
const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ customer: req.user._id });
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user orders'
    });
  }
};

/**
 * @desc    Get vendor's incoming orders (items belonging to this vendor)
 * @route   GET /api/orders/vendor/orders
 * @access  Private (Vendor only)
 */
const getVendorOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const filter = { 'orderItems.vendor': vendor._id };

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Format response so vendor easily sees their specific items
    const vendorOrders = orders.map(order => {
      const myItems = order.orderItems.filter(
        item => item.vendor.toString() === vendor._id.toString()
      );
      const myTotal = myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      return {
        _id: order._id,
        customer: order.customer,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        isPaid: order.isPaid,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        vendorItems: myItems,
        vendorSubtotal: Math.round(myTotal * 100) / 100
      };
    });

    return res.status(200).json({
      success: true,
      count: vendorOrders.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: vendorOrders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching vendor orders'
    });
  }
};

/**
 * @desc    Vendor updates status of their item in an order
 * @route   PATCH /api/orders/:orderId/items/:itemId/status
 * @access  Private (Vendor only)
 */
const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { itemStatus } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(itemStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid item status. Allowed: ${validStatuses.join(', ')}`
      });
    }

    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const item = order.orderItems.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      });
    }

    // Verify vendor owns this order item
    if (item.vendor.toString() !== vendor._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update status of this item'
      });
    }

    item.itemStatus = itemStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Item status updated to ${itemStatus}`,
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating order item status'
    });
  }
};

/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id || 'N/A',
      status: req.body.status || 'completed',
      updateTime: req.body.update_time || new Date().toISOString(),
      emailAddress: req.body.payer ? req.body.payer.email_address : ''
    };

    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order marked as paid',
      data: updatedOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating payment status'
    });
  }
};

/**
 * @desc    Admin: get all orders across the marketplace
 * @route   GET /api/orders
 * @access  Private (Admin only)
 */
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments();
    const orders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching all orders'
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getVendorOrders,
  updateOrderItemStatus,
  updateOrderToPaid,
  getAllOrders
};
