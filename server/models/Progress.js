const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    level: {
      type: String,
      enum: ['foundation', 'intermediate', 'final'],
      required: true,
    },
    selectedAnswer: {
      type: Number,
      // Optional to support subjective questions where a numeric choice does not apply
      required: false,
      min: 0,
      max: 3,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    timeTaken: {
      type: Number, // milliseconds
      default: 0,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    mode: {
      type: String,
      enum: ['practice', 'quiz'],
      default: 'practice',
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.index({ user: 1, question: 1 });
progressSchema.index({ user: 1, chapter: 1 });
progressSchema.index({ user: 1, subject: 1 });
progressSchema.index({ user: 1, level: 1, createdAt: -1 });

module.exports = mongoose.model('Progress', progressSchema);