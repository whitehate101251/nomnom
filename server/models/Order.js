const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    size: {
      value: Number,
      unit: String,
      price: Number
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['stripe', 'paypal'],
      required: true
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  trackingNumber: String,
  estimatedDelivery: Date,
  notes: String
}, {
  timestamps: true
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
  this.total = this.subtotal + this.shippingCost + this.tax;
  next();
});

module.exports = mongoose.model('Order', orderSchema); 