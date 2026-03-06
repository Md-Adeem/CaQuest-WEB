const express = require('express');
const { askTutor } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Strict rate limiter for AI to prevent API token abuse
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each user to 30 AI questions per hour
  message: {
    success: false,
    message: 'Too many queries to the AI Tutor. Please take a break and try again in an hour.'
  }
});

// @route   POST /api/ai/ask
// @desc    Ask the AI tutor a question
// @access  Private (Logged in students only)
router.post('/ask', protect, aiLimiter, askTutor);

module.exports = router;
