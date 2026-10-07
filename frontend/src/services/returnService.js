// Return & Refund System Service for BazaarHub
// Manages the 5-step return lifecycle:
// Return Requested -> Seller Review -> Approved -> Pickup -> Refund

const STORAGE_KEY = 'bazaarhub_returns';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const RETURN_REASONS = [
  'Wrong product',
  'Damaged product',
  'Product not as described',
  'Other'
];

export const RETURN_STEPS = [
  {
    key: 'requested',
    label: 'Return Requested',
    shortTitle: 'Requested',
    description: 'Return request submitted by customer with reason & details'
  },
  {
    key: 'seller_review',
    label: 'Seller Review',
    shortTitle: 'In Review',
    description: 'Merchant evaluates return details and product photos'
  },
  {
    key: 'approved',
    label: 'Approved',
    shortTitle: 'Approved',
    description: 'Return request accepted. Courier pickup scheduled'
  },
  {
    key: 'pickup',
    label: 'Pickup',
    shortTitle: 'Pickup Done',
    description: 'Package picked up by courier from customer location'
  },
  {
    key: 'refunded',
    label: 'Refund',
    shortTitle: 'Refunded',
    description: 'Refund credited to customer payment method'
  }
];

// Sample initial return for immediate testing
const INITIAL_SAMPLE_RETURNS = [
  {
    id: 'RET-739201',
    orderId: 'ORD-723019',
    product: {
      id: 'prod-13',
      name: 'Sony WH-1000XM5 ANC Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      price: 29990,
      sellerName: 'TechWorld Store'
    },
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.verma@example.com',
    customerPhone: '+91 98765 43210',
    reason: 'Wrong product',
    customerComments: 'Ordered Black color edition, but received Silver edition inside the sealed box.',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80'
    ],
    refundAmount: 29990,
    refundMethod: 'Original Payment Method (UPI / Card)',
    pickupAddress: 'Flat 402, Lotus Residency, 12th Main Indiranagar, Bengaluru - 560038',
    status: 'seller_review',
    trackingAwb: 'BZH-RET-981240',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    timeline: [
      {
        step: 'requested',
        title: 'Return Requested',
        description: 'Customer selected "Wrong product". Comments: Ordered Black color edition, but received Silver.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        completed: true
      },
      {
        step: 'seller_review',
        title: 'Seller Review in Progress',
        description: 'TechWorld Store merchant is verifying barcode and serial number from package photos.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        completed: true
      }
    ]
  }
];

export const returnService = {
  // Get all returns from local storage (or seed if empty)
  getReturns() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_RETURNS));
        return INITIAL_SAMPLE_RETURNS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading returns from localStorage:', e);
      return INITIAL_SAMPLE_RETURNS;
    }
  },

  // Get single return by ID or order ID
  getReturnById(returnId) {
    const list = this.getReturns();
    return list.find((r) => r.id === returnId || r.returnNumber === returnId);
  },

  getReturnsByOrder(orderId) {
    const list = this.getReturns();
    return list.filter((r) => r.orderId === orderId);
  },

  getReturnForProduct(orderId, productId) {
    const list = this.getReturns();
    return list.find((r) => r.orderId === orderId && (r.product?.id === productId || r.productId === productId));
  },

  // Create new return request
  async createReturnRequest({
    orderId,
    product,
    reason,
    customerComments,
    images = [],
    refundAmount,
    refundMethod = 'Original Payment Method (UPI / Card)',
    pickupAddress = 'Registered customer address',
    customerName = 'Rahul Verma'
  }) {
    const returnId = `RET-${Math.floor(100000 + Math.random() * 900000)}`;

    const newReturn = {
      id: returnId,
      returnNumber: returnId,
      orderId,
      product: {
        id: product.id || 'prod-item',
        name: product.name,
        image: product.images?.[0] || product.image || '',
        price: product.price || 0,
        sellerName: product.sellerName || 'TechWorld Store'
      },
      customerName,
      customerPhone: '+91 98765 43210',
      reason,
      customerComments,
      images,
      refundAmount: Number(refundAmount || product.price || 0),
      refundMethod,
      pickupAddress,
      status: 'requested',
      trackingAwb: `BZH-RET-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          step: 'requested',
          title: 'Return Requested',
          description: `Customer submitted return request for reason: "${reason}". Details: ${customerComments || 'No additional remarks provided.'}`,
          timestamp: new Date().toISOString(),
          completed: true
        }
      ]
    };

    const current = this.getReturns();
    const updated = [newReturn, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Try optional sync to backend if server is accessible
    try {
      fetch(`${API_BASE}/returns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          productId: product.id,
          productName: product.name,
          productImage: product.images?.[0] || product.image || '',
          reason,
          customerComments,
          images,
          refundAmount: newReturn.refundAmount,
          refundMethod,
          pickupAddress
        })
      }).catch(() => {});
    } catch (_) {}

    this.notifyUpdate(newReturn);
    return newReturn;
  },

  // Update return status (e.g. Seller Review -> Approved -> Pickup -> Refund)
  async updateReturnStatus(returnId, newStatus, customNotes = '') {
    const list = this.getReturns();
    const index = list.findIndex((r) => r.id === returnId || r.returnNumber === returnId);
    if (index === -1) return null;

    const returnItem = { ...list[index] };
    returnItem.status = newStatus;

    let stepTitle = '';
    let stepDescription = '';

    switch (newStatus) {
      case 'seller_review':
        stepTitle = 'Seller Review';
        stepDescription = customNotes || `${returnItem.product.sellerName} is reviewing the return details and package photos.`;
        break;
      case 'approved':
        stepTitle = 'Approved';
        stepDescription = customNotes || 'Return request approved by merchant. Courier pickup has been scheduled for your address.';
        returnItem.pickupDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        break;
      case 'pickup':
        stepTitle = 'Pickup Completed';
        stepDescription = customNotes || `Courier executive has verified and picked up the parcel (AWB: ${returnItem.trackingAwb}). Package is in transit to seller.`;
        break;
      case 'refunded':
        stepTitle = 'Refund Processed';
        returnItem.refundTxnId = `UPI-REF-${Math.floor(100000 + Math.random() * 900000)}`;
        stepDescription = customNotes || `Full refund of ₹${returnItem.refundAmount.toLocaleString('en-IN')} has been successfully credited via ${returnItem.refundMethod}. (Ref: ${returnItem.refundTxnId})`;
        returnItem.refundedAt = new Date().toISOString();
        break;
      case 'rejected':
        stepTitle = 'Return Rejected';
        stepDescription = customNotes || 'Return request was declined as it did not fulfill return policy conditions.';
        break;
      default:
        stepTitle = 'Status Updated';
        stepDescription = customNotes || `Status updated to ${newStatus}`;
    }

    const existingTimeline = returnItem.timeline || [];
    const newEntry = {
      step: newStatus,
      title: stepTitle,
      description: stepDescription,
      timestamp: new Date().toISOString(),
      completed: true
    };

    returnItem.timeline = [...existingTimeline, newEntry];

    list[index] = returnItem;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    // Try backend update if online
    try {
      fetch(`${API_BASE}/returns/${returnId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          vendorNotes: customNotes
        })
      }).catch(() => {});
    } catch (_) {}

    this.notifyUpdate(returnItem);
    return returnItem;
  },

  // Advance to next step in the 5-step workflow (convenient helper for quick progression/demo)
  advanceNextStep(returnId) {
    const r = this.getReturnById(returnId);
    if (!r) return null;

    const stepOrder = ['requested', 'seller_review', 'approved', 'pickup', 'refunded'];
    const currentIndex = stepOrder.indexOf(r.status);

    if (currentIndex >= 0 && currentIndex < stepOrder.length - 1) {
      const nextStatus = stepOrder[currentIndex + 1];
      return this.updateReturnStatus(returnId, nextStatus);
    }
    return r;
  },

  // Notify components across app of updates
  notifyUpdate(returnItem) {
    window.dispatchEvent(
      new CustomEvent('bazaarhub_return_updated', {
        detail: returnItem
      })
    );
  }
};
