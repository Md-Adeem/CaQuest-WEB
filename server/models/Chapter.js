const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Chapter name is required'],
      trim: true,
    },
    chapterNumber: {
      type: Number,
      required: [true, 'Chapter number is required'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    level: {
      type: String,
      required: true,
      enum: ['foundation', 'intermediate', 'final'],
    },
    description: {
      type: String,
      trim: true,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

chapterSchema.index({ subject: 1, chapterNumber: 1 });

module.exports = mongoose.model('Chapter', chapterSchema);