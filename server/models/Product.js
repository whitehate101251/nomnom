const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['floral', 'woody', 'fresh', 'oriental', 'citrus']
  },
  size: [{
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: 'ml'
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  features: {
    type: Map,
    of: String
  },
  ingredients: [String],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate average rating before saving
productSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((acc, item) => acc + item.rating, 0) / this.ratings.length;
    this.totalReviews = this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema); 