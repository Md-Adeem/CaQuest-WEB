const Subscription = require('../models/Subscription');

// @desc    Get all subscription plans
// @route   GET /api/subscriptions?level=foundation
// @access  Public
const getSubscriptionPlans = async (req, res, next) => {
  try {
    const { level } = req.query;

    const filter = { isActive: true };
    if (level) {
      filter.level = level;
    }

    const plans = await Subscription.find(filter).sort({ price: 1 });

    res.json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single plan
// @route   GET /api/subscriptions/:id
// @access  Public
const getSubscriptionPlan = async (req, res, next) => {
  try {
    const plan = await Subscription.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found',
      });
    }

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create subscription plan (Admin)
// @route   POST /api/subscriptions
// @access  Admin
const createSubscriptionPlan = async (req, res, next) => {
  try {
    const plan = await Subscription.create(req.body);

    res.status(201).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subscription plan (Admin)
// @route   PUT /api/subscriptions/:id
// @access  Admin
const updateSubscriptionPlan = async (req, res, next) => {
  try {
    const plan = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found',
      });
    }

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscriptionPlans,
  getSubscriptionPlan,
  createSubscriptionPlan,
  updateSubscriptionPlan,
};