const express = require('express');
const router = express.Router();
const { search } = require('../controllers/searchController');
const { protect } = require('../middleware/auth');
const { searchLimiter } = require('../middleware/rateLimiter');

router.get('/', protect, searchLimiter, search);

module.exports = router;