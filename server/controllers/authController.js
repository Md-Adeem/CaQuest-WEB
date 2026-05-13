const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const generateToken = require("../utils/generateToken");
const { validationResult } = require("express-validator");
const { sendEmail, emailTemplates } = require("../utils/email");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    const lowercasedEmail = email.toLowerCase();
    if (!lowercasedEmail.endsWith('@gmail.com') && !lowercasedEmail.endsWith('@caquest.com')) {
      return res.status(400).json({
        success: false,
        message: "Registration is restricted to @gmail.com addresses only.",
      });
    }

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

    // Create Audit Log
    try {
      await AuditLog.create({
        user: user._id,
        action: 'register',
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        status: 'success'
      });
    } catch (logError) {
      console.error("Failed to map audit log for registration:", logError.message);
    }

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

    const lowercasedEmail = email.toLowerCase();
    if (!lowercasedEmail.endsWith('@gmail.com') && !lowercasedEmail.endsWith('@caquest.com')) {
      return res.status(401).json({
        success: false,
        message: "Login is restricted to @gmail.com addresses only. Old accounts must re-register.",
      });
    }

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

    // Create Audit Log
    try {
      await AuditLog.create({
        user: user._id,
        action: 'login',
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        status: 'success'
      });
    } catch (logError) {
      console.error("Failed to map audit log for login:", logError.message);
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

// @desc    Google login / registration
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ success: false, message: "Google token missing" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload.email || !payload.email_verified) {
      return res.status(400).json({ success: false, message: "Unverified Google account" });
    }

    const email = payload.email.toLowerCase();
    
    if (!email.endsWith('@gmail.com') && !email.endsWith('@caquest.com')) {
      return res.status(401).json({
        success: false,
        message: "Login is restricted to @gmail.com addresses only.",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      // Existing user: Link google if they don't have it
      if (user.provider === 'local' || !user.provider) {
        user.provider = 'google';
        user.googleId = payload.sub;
        user.avatar = payload.picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name: payload.name,
        email,
        password: Math.random().toString(36).slice(-10) + payload.sub,
        provider: 'google',
        googleId: payload.sub,
        avatar: payload.picture,
      });

      setImmediate(async () => {
        try {
          const welcomeEmail = emailTemplates.welcome(user.name);
          await sendEmail({
            to: user.email,
            subject: welcomeEmail.subject,
            html: welcomeEmail.html,
          });
        } catch (emailError) {}
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated. Contact admin.",
      });
    }

    try {
      await AuditLog.create({
        user: user._id,
        action: 'login',
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        status: 'success'
      });
    } catch (logError) {}

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        selectedLevel: user.selectedLevel,
        activeSubscriptions: user.activeSubscriptions,
        avatar: user.avatar,
        token: generateToken(user._id),
      },
    });

  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ success: false, message: "Google authentication failed" });
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
// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Please provide your email" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal whether a user exists
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    // Google-only users shouldn't reset passwords
    if (user.provider === 'google' && !user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Sign-In. Please login with Google.",
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Build reset URL pointing to frontend
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    // Send email
    const emailData = emailTemplates.passwordReset(user.name, resetUrl);
    const emailResult = await sendEmail({ to: user.email, ...emailData });

    if (!emailResult) {
      // Email failed to send, clean up the token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent. Please try again later.",
      });
    }

    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // Hash the token from the URL and find the matching user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token. Please request a new one.",
      });
    }

    // Set new password (the pre-save hook will hash it)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Log the action
    try {
      await AuditLog.create({
        user: user._id,
        action: 'password_reset',
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        status: 'success',
      });
    } catch (logError) {}

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  forgotPassword,
  resetPassword,
  getMe,
  selectLevel,
  updateProfile,
  changePassword,
  updateStreak,
  getLeaderboard,
};
