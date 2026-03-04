const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { validationResult } = require("express-validator");
const { sendEmail, emailTemplates } = require("../utils/email");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    // Send welcome email (non-blocking)
    setImmediate(async () => {
      try {
        const welcomeEmail = emailTemplates.welcome(user.name);
        await sendEmail({
          to: user.email,
          subject: welcomeEmail.subject,
          html: welcomeEmail.html,
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError.message);
        // Don't fail registration if email fails
      }
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        selectedLevel: user.selectedLevel,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated. Contact admin.",
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        selectedLevel: user.selectedLevel,
        activeSubscriptions: user.activeSubscriptions,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "activeSubscriptions.plan"
    );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user level selection
// @route   PUT /api/auth/select-level
// @access  Private
const selectLevel = async (req, res, next) => {
  try {
    const { level } = req.body;

    if (!["foundation", "intermediate", "final"].includes(level)) {
      return res.status(400).json({
        success: false,
        message: "Invalid level. Choose foundation, intermediate, or final.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { selectedLevel: level },
      { new: true }
    );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update User Study Streak
// @route   PUT /api/auth/streak
// @access  Private
const updateStreak = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of today local time
    
    let lastDate = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    let streakUpdated = false;

    if (!lastDate) {
      // First time studying
      user.currentStreak = 1;
      user.longestStreak = 1;
      user.lastStudyDate = new Date();
      streakUpdated = true;
    } else {
      const diffTime = Math.abs(today - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Studied yesterday, increment streak
        user.currentStreak += 1;
        user.lastStudyDate = new Date();
        if (user.currentStreak > user.longestStreak) {
          user.longestStreak = user.currentStreak;
        }
        streakUpdated = true;
      } else if (diffDays > 1) {
        // Missed a day, reset streak
        user.currentStreak = 1;
        user.lastStudyDate = new Date();
        streakUpdated = true;
      }
      // If diffDays === 0, they already studied today. Do nothing but return success.
    }

    if (streakUpdated) {
      await user.save();
    }

    res.json({
      success: true,
      data: {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastStudyDate: user.lastStudyDate
      }
    });

  } catch (error) {
    next(error);
  }
};
// @desc    Get Global Student Leaderboard by Streak
// @route   GET /api/auth/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    // Return top 50 active students with highest current streak
    const users = await User.find({ role: 'student', isActive: true })
      .select('name activeSubscriptions currentStreak longestStreak updatedAt createdAt')
      .sort({ currentStreak: -1, longestStreak: -1 }) // Sort by active streak, tiebreaker is longest historical streak
      .limit(50)
      .lean();

    const now = new Date();

    const leaderboard = users.map((user) => {
      // Extract unexpired overlapping active subscriptions
      const validSubs = (user.activeSubscriptions || []).filter(
        (sub) => new Date(sub.expiresAt) > now
      );

      let computedLevel = 'Student'; // Default fallback
      if (validSubs.length > 0) {
        // Collect unique level names (e.g. foundation, intermediate) and capitalize them
        const uniqueLevels = [...new Set(validSubs.map((sub) => sub.level))];
        computedLevel = uniqueLevels
          .map((l) => l.charAt(0).toUpperCase() + l.slice(1))
          .join(', ');
      }

      return {
        name: user.name,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        level: computedLevel,
      };
    });

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  selectLevel,
  updateProfile,
  changePassword,
  updateStreak,
  getLeaderboard,
};
