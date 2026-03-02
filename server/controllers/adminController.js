const Payment = require('../models/Payment');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Question = require('../models/Question');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const { sendEmail, emailTemplates } = require('../utils/email');


// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalQuestions,
      totalSubjects,
      totalChapters,
      pendingPayments,
      approvedPayments,
      rejectedPayments,
      recentPayments,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Question.countDocuments({ isActive: true }),
      Subject.countDocuments({ isActive: true }),
      Chapter.countDocuments({ isActive: true }),
      Payment.countDocuments({ status: 'pending' }),
      Payment.countDocuments({ status: 'approved' }),
      Payment.countDocuments({ status: 'rejected' }),
      Payment.find()
        .populate('user', 'name email')
        .populate('subscriptionPlan', 'name level price')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    // Revenue calculation
    const revenue = await Payment.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalQuestions,
        totalSubjects,
        totalChapters,
        pendingPayments,
        approvedPayments,
        rejectedPayments,
        totalRevenue: revenue[0]?.total || 0,
        recentPayments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending payments
// @route   GET /api/admin/payments?status=pending
// @access  Admin
const getPayments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const payments = await Payment.find(filter)
      .populate('user', 'name email phone')
      .populate('subscriptionPlan', 'name level duration price durationLabel')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(filter);

    res.json({
      success: true,
      count: payments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve payment
// @route   PUT /api/admin/payments/:id/approve
// @access  Admin
const approvePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('subscriptionPlan');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Payment has already been ${payment.status}`,
      });
    }

    // Update payment status
    payment.status = 'approved';
    payment.reviewedBy = req.user._id;
    payment.reviewedAt = new Date();
    await payment.save();

    // Activate user subscription
    const plan = payment.subscriptionPlan;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.duration);

    const user = await User.findById(payment.user);

    // Check if user already has a subscription for this level
    const existingSubIndex = user.activeSubscriptions.findIndex(
      (s) => s.level === plan.level
    );

    if (existingSubIndex >= 0) {
      // Extend existing subscription
      const currentExpiry = new Date(user.activeSubscriptions[existingSubIndex].expiresAt);
      const newExpiry = currentExpiry > new Date() ? currentExpiry : new Date();
      newExpiry.setDate(newExpiry.getDate() + plan.duration);
      user.activeSubscriptions[existingSubIndex].expiresAt = newExpiry;
      user.activeSubscriptions[existingSubIndex].plan = plan._id;
    } else {
      // Add new subscription
      user.activeSubscriptions.push({
        level: plan.level,
        expiresAt,
        plan: plan._id,
      });
    }

    await user.save();

    const levelNames = {
      foundation: 'CA Foundation',
      intermediate: 'CA Intermediate',
      final: 'CA Final',
    };

    const approvedUser = await User.findById(payment.user);

    const emailData = emailTemplates.paymentApproved(
      approvedUser.name,
      plan.name,
      levelNames[plan.level],
      expiresAt.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );

    await sendEmail({
      to: approvedUser.email,
      ...emailData,
    });

    res.json({
      success: true,
      message: 'Payment approved and subscription activated',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject payment
// @route   PUT /api/admin/payments/:id/reject
// @access  Admin
const rejectPayment = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Payment has already been ${payment.status}`,
      });
    }

    payment.status = 'rejected';
    payment.reviewedBy = req.user._id;
    payment.reviewedAt = new Date();
    payment.rejectionReason = reason || 'Payment verification failed';
    await payment.save();

    const rejectedUser = await User.findById(payment.user);
const rejectEmail = emailTemplates.paymentRejected(
  rejectedUser.name,
  payment.subscriptionPlan?.name || 'Subscription',
  reason
);
await sendEmail({ to: rejectedUser.email, ...rejectEmail });

    res.json({
      success: true,
      message: 'Payment rejected',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const filter = { role: 'student' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .populate('activeSubscriptions.plan', 'name level duration price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getPayments,
  approvePayment,
  rejectPayment,
  getUsers,
};