const express = require('express');
const router = express.Router();
const {
  submitPayment,
  getMyPayments,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { paymentLimiter } = require('../middleware/rateLimiter');
const { paymentValidation } = require('../utils/validators');

router.post('/', protect, paymentLimiter, upload.single('screenshot'), paymentValidation, submitPayment);
router.get('/my-payments', protect, getMyPayments);

module.exports = router;