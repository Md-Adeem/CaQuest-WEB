const express = require('express');
const router = express.Router();
const {
  getSubscriptionPlans,
  getSubscriptionPlan,
  createSubscriptionPlan,
  updateSubscriptionPlan,
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { cacheMiddleware } = require('../middleware/cache');

router.get('/', cacheMiddleware(600), getSubscriptionPlans); // Cache 10 min
router.get('/:id', getSubscriptionPlan);
router.post('/', protect, adminOnly, createSubscriptionPlan);
router.put('/:id', protect, adminOnly, updateSubscriptionPlan);

module.exports = router;