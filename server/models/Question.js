const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },

    // ✅ NEW TYPE FIELD
    type: {
      type: String,
      enum: ['MCQ', 'SUBJECTIVE'],
      default: 'MCQ',
      required: true,
    },

    // For MCQ only
    options: [
      {
        type: String,
        trim: true,
      },
    ],

    correctAnswer: {
      type: Number,
    },

    // For SUBJECTIVE only
    modelAnswer: {
      type: String,
      trim: true,
    },

    explanation: {
      type: String,
      trim: true,
    },

    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: [true, 'Chapter is required'],
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

    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },

    marks: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// ✅ CONDITIONAL VALIDATION
questionSchema.pre('validate', function (next) {
  if (this.type === 'MCQ') {
    if (!this.options || this.options.length < 2) {
      return next(new Error('MCQ must have at least 2 options'));
    }
    if (this.correctAnswer === undefined) {
      return next(new Error('MCQ must have correct answer'));
    }
  }

  if (this.type === 'SUBJECTIVE') {
    if (!this.modelAnswer) {
      return next(new Error('Subjective question must have model answer'));
    }
  }

  next();
});

questionSchema.index({ chapter: 1, difficulty: 1 });
questionSchema.index({ subject: 1, level: 1 });

module.exports = mongoose.model('Question', questionSchema);
