const { Return, Order, Vendor, User } = require('../models');
const { sendReturnNotificationEmail } = require('../services/emailService');

/**
 * @desc    Create new return request
 * @route   POST /api/returns
 * @access  Private (Customer)
 */
const createReturnRequest = async (req, res) => {
  try {
    const {
      orderId,
      productId,
      productName,
      productImage,
      reason,
      customerComments,
      images,
      refundAmount,
      refundMethod,
      pickupAddress
    } = req.body;

    if (!orderId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and return reason are required'
      });
    }

    // Try finding order in DB if valid ObjectId
    let order = null;
    let vendorId = null;
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(orderId);
      if (order && order.orderItems && order.orderItems.length > 0) {
        const item = order.orderItems.find(i => 
          (productId && i.product.toString() === productId.toString()) || 
          (productId && i._id.toString() === productId.toString())
        ) || order.orderItems[0];
        vendorId = item?.vendor || null;
      }
    }

    // Fallback or default vendor if mock/local order
    if (!vendorId) {
      const firstVendor = await Vendor.findOne();
      vendorId = firstVendor ? firstVendor._id : null;
    }

    const returnNumber = `RET-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const initialTimeline = [
      {
        step: 'requested',
        title: 'Return Requested',
        description: `Return initiated for reason: "${reason}". Customer comments: ${customerComments || 'No additional comments.'}`,
        timestamp: new Date(),
        completed: true
      }
    ];

    const returnDoc = await Return.create({
      returnNumber,
      order: order ? order._id : (orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : undefined),
      customer: req.user ? req.user._id : undefined,
      vendor: vendorId,
      product: (productId && productId.match(/^[0-9a-fA-F]{24}$/)) ? productId : undefined,
      productName: productName || 'Marketplace Item',
      productImage: productImage || '',
      reason,
      customerComments: customerComments || '',
      images: images || [],
      refundAmount: Number(refundAmount) || 0,
      refundMethod: refundMethod || 'original_payment_method',
      pickupAddress: pickupAddress || 'Customer registered address',
      status: 'requested',
      timeline: initialTimeline
    });

    // Send email alert to admin/customer
    sendReturnNotificationEmail({
      to: req.user?.email || process.env.ADMIN_EMAIL,
      customerName: req.user?.name || 'Valued Customer',
      returnNumber,
      orderId,
      productName: returnDoc.productName,
      status: 'requested',
      reason,
      refundAmount: returnDoc.refundAmount
    }).catch(err => console.warn('Return notification email error:', err.message));

    return res.status(201).json({
      success: true,
      message: 'Return request submitted successfully',
      data: returnDoc
    });
  } catch (error) {
    console.error('Error creating return request:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating return request'
    });
  }
};

/**
 * @desc    Get logged in user returns
 * @route   GET /api/returns/my-returns
 * @access  Private (Customer)
 */
const getMyReturns = async (req, res) => {
  try {
    const returns = await Return.find({ customer: req.user._id })
      .populate('order', 'orderStatus paymentMethod createdAt')
      .populate('vendor', 'storeName slug logo')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: returns.length,
      data: returns
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user returns'
    });
  }
};

/**
 * @desc    Get vendor returns
 * @route   GET /api/returns/seller/returns
 * @access  Private (Vendor only)
 */
const getVendorReturns = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    const filter = vendor ? { vendor: vendor._id } : {};

    const returns = await Return.find(filter)
      .populate('customer', 'name email phone')
      .populate('order', 'orderStatus totalPrice createdAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: returns.length,
      data: returns
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching vendor returns'
    });
  }
};

/**
 * @desc    Get single return by ID or Return Number
 * @route   GET /api/returns/:id
 * @access  Private
 */
const getReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { returnNumber: id };

    const returnDoc = await Return.findOne(query)
      .populate('customer', 'name email phone')
      .populate('vendor', 'storeName slug logo')
      .populate('order', 'orderStatus paymentMethod totalPrice createdAt');

    if (!returnDoc) {
      return res.status(404).json({
        success: false,
        message: 'Return record not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: returnDoc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching return'
    });
  }
};

/**
 * @desc    Update return status (Workflow: requested -> seller_review -> approved -> pickup -> refunded)
 * @route   PATCH /api/returns/:id/status
 * @access  Private (Vendor / Admin)
 */
const updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, vendorNotes, adminNotes, trackingAwb, refundTransactionId } = req.body;

    const validStatuses = ['requested', 'seller_review', 'approved', 'pickup', 'refunded', 'rejected', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { returnNumber: id };
    const returnDoc = await Return.findOne(query);

    if (!returnDoc) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    returnDoc.status = status;
    if (vendorNotes) returnDoc.vendorNotes = vendorNotes;
    if (adminNotes) returnDoc.adminNotes = adminNotes;
    if (trackingAwb) returnDoc.trackingAwb = trackingAwb;
    if (refundTransactionId) returnDoc.refundTransactionId = refundTransactionId;

    // Milestone title and description for 5-step lifecycle
    let stepTitle = '';
    let stepDesc = '';

    switch (status) {
      case 'seller_review':
        stepTitle = 'Seller Review';
        stepDesc = vendorNotes || 'The merchant is actively reviewing your return request and evidence.';
        break;
      case 'approved':
        stepTitle = 'Approved';
        stepDesc = vendorNotes || 'Return request approved by merchant. Courier pickup has been scheduled.';
        returnDoc.pickupDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Next day pickup
        returnDoc.trackingAwb = returnDoc.trackingAwb || `RET-AWB-${Math.floor(100000 + Math.random() * 900000)}`;
        break;
      case 'pickup':
        stepTitle = 'Pickup';
        stepDesc = 'Courier executive has verified and picked up the item from your address.';
        break;
      case 'refunded':
        stepTitle = 'Refund Processed';
        stepDesc = `Full refund of ₹${returnDoc.refundAmount.toLocaleString('en-IN')} has been credited. Reference: ${returnDoc.refundTransactionId || 'TXN-REF-' + Date.now().toString().slice(-6)}`;
        returnDoc.resolvedAt = new Date();
        returnDoc.refundTransactionId = returnDoc.refundTransactionId || `TXN-REF-${Date.now().toString().slice(-6)}`;
        break;
      case 'rejected':
        stepTitle = 'Return Rejected';
        stepDesc = vendorNotes || 'Return request did not meet return policy criteria.';
        returnDoc.resolvedAt = new Date();
        break;
      default:
        stepTitle = 'Status Updated';
        stepDesc = `Return status changed to ${status}`;
    }

    returnDoc.timeline.push({
      step: status,
      title: stepTitle,
      description: stepDesc,
      timestamp: new Date(),
      completed: true
    });

    await returnDoc.save();

    // Send email alert on status transition
    sendReturnNotificationEmail({
      to: process.env.ADMIN_EMAIL,
      returnNumber: returnDoc.returnNumber,
      orderId: returnDoc.order?.toString() || id,
      productName: returnDoc.productName,
      status,
      reason: returnDoc.reason,
      refundAmount: returnDoc.refundAmount,
      refundTxnId: returnDoc.refundTransactionId
    }).catch(err => console.warn('Return status update email error:', err.message));

    return res.status(200).json({
      success: true,
      message: `Return status updated to ${status}`,
      data: returnDoc
    });
  } catch (error) {
    console.error('Error updating return status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating return status'
    });
  }
};

/**
 * @desc    Get all returns (Admin)
 * @route   GET /api/returns
 * @access  Private (Admin only)
 */
const getAllReturns = async (req, res) => {
  try {
    const returns = await Return.find()
      .populate('customer', 'name email')
      .populate('vendor', 'storeName slug')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: returns.length,
      data: returns
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching all returns'
    });
  }
};

module.exports = {
  createReturnRequest,
  getMyReturns,
  getVendorReturns,
  getReturnById,
  updateReturnStatus,
  getAllReturns
};
