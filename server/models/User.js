const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|caquest\.com)$/,
        'Only @gmail.com email addresses are allowed',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please provide a valid phone number'],
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    selectedLevel: {
      type: String,
      enum: ['foundation', 'intermediate', 'final', null],
      default: null,
    },
    activeSubscriptions: [
      {
        level: {
          type: String,
          enum: ['foundation', 'intermediate', 'final'],
        },
        expiresAt: Date,
        plan: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subscription',
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Gamification properties
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastStudyDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if subscription is active for a level
userSchema.methods.hasActiveSubscription = function (level) {
  const sub = this.activeSubscriptions.find(
    (s) => s.level === level && new Date(s.expiresAt) > new Date()
  );
  return !!sub;
};

module.exports = mongoose.model('User', userSchema);