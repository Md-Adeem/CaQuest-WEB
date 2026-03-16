const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    tag: {
      type: String,
      trim: true,
      maxlength: 20, // e.g. "Eid Offer", "Limited Time"
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: ['foundation', 'intermediate', 'final'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    duration: {
      type: Number, // in days
      required: [true, 'Duration is required'],
    },
    durationLabel: {
      type: String,
      required: true,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxAttempts: {
      type: Number,
      default: -1, // -1 for unlimited
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);