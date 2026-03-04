const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  selectLevel,
  updateProfile,
  changePassword,
  updateStreak,
  getLeaderboard,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../utils/validators');
const { authLimiter } = require('../middleware/rateLimiter');

router.get('/leaderboard', getLeaderboard);


router.post('/login', authLimiter, loginValidation, login);
router.post('/register', authLimiter, registerValidation, register);
router.get('/me', protect, getMe);
router.put('/select-level', protect, selectLevel);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/streak', protect, updateStreak);

module.exports = router;