const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/email');


// @desc    Submit payment for approval
// @route   POST /api/payments
// @access  Private
const submitPayment = async (req, res, next) => {
  try {
    const { subscriptionPlan, transactionId, paymentMethod, amount } = req.body;

    // Verify plan exists
    const plan = await Subscription.findById(subscriptionPlan);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found',
      });
    }

    // Check for duplicate transaction ID
    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'A payment with this transaction ID already exists',
      });
    }

    // Check if user already has a pending payment for this level
    const pendingPayment = await Payment.findOne({
      user: req.user._id,
      level: plan.level,
      status: 'pending',
    });

    if (pendingPayment) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending payment for this level. Please wait for admin approval.',
      });
    }

    const payment = await Payment.create({
      user: req.user._id,
      subscriptionPlan,
      amount,
      transactionId,
      paymentMethod,
      level: plan.level,
      screenshotUrl: req.file ? `/uploads/payments/${req.file.filename}` : null,
    });

     const emailData = emailTemplates.paymentSubmitted(
      req.user.name,
      plan.name,
      amount,
      transactionId
    );

    await sendEmail({
      to: req.user.email,
      ...emailData,
    });

    res.status(201).json({
      success: true,
      message: 'Payment submitted successfully. Awaiting admin approval.',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};



// @desc    Get user's payment history
// @route   GET /api/payments/my-payments
// @access  Private
const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('subscriptionPlan', 'name level duration price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitPayment,
  getMyPayments,
};