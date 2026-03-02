const Question = require("../models/Question");
const Chapter = require("../models/Chapter");
const Subject = require("../models/Subject");
const User = require("../models/User");

// @desc    Get questions by chapter (requires subscription)
// @route   GET /api/questions?chapter=chapterId
// @access  Private (Subscribed)
const getQuestions = async (req, res, next) => {
  try {
    const { chapter, page = 1, limit = 20, paperType } = req.query;

    if (!chapter) {
      return res.status(400).json({
        success: false,
        message: "Chapter ID is required",
      });
    }

    // Get the chapter to find its level
    const chapterDoc = await Chapter.findById(chapter);
    if (!chapterDoc) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    // Check if user has active subscription for this level
    const user = await User.findById(req.user._id);
    if (
      !user.hasActiveSubscription(chapterDoc.level) &&
      user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Active subscription required to access questions",
        requiresSubscription: true,
        level: chapterDoc.level,
      });
    }

    const filter = { chapter, isActive: true };
    if (paperType) {
      filter.paperType = paperType;
    }

    const skip = (page - 1) * limit;

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(filter);

    res.json({
      success: true,
      count: questions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check subscription status for a chapter
// @route   GET /api/questions/check-access/:chapterId
// @access  Private
  const checkAccess = async (req, res, next) => {
  try {
    // ✅ Populate subject
    const chapter = await Chapter.findById(req.params.chapterId).populate(
      "subject"
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    const user = await User.findById(req.user._id);
    const hasAccess =
      user.hasActiveSubscription(chapter.level) || user.role === "admin";

    res.json({
      success: true,
      data: {
        hasAccess,
        level: chapter.level,
        totalQuestions: chapter.totalQuestions,
        subjectType: chapter.subject?.type, // ✅ added safely
        chapterName: chapter.name, // ✅ Include chapter name
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create question (Admin)
// @route   POST /api/questions
// @access  Admin
const createQuestion = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.body.chapter).populate(
      "subject"
    );
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    req.body.subject = chapter.subject._id;
    req.body.level = chapter.level;
    req.body.createdBy = req.user._id;

    const question = await Question.create(req.body);

    // Update counts
    await Chapter.findByIdAndUpdate(chapter._id, {
      $inc: { totalQuestions: 1 },
    });
    await Subject.findByIdAndUpdate(chapter.subject._id, {
      $inc: { totalQuestions: 1 },
    });

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create questions (Admin)
// @route   POST /api/questions/bulk
// @access  Admin
const bulkCreateQuestions = async (req, res, next) => {
  try {
    const { questions, chapterId } = req.body;

    const chapter = await Chapter.findById(chapterId).populate("subject");
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    const questionsToInsert = questions.map((q) => ({
      ...q,
      chapter: chapter._id,
      subject: chapter.subject._id,
      level: chapter.level,
      createdBy: req.user._id,
    }));

    const createdQuestions = await Question.insertMany(questionsToInsert);

    // Update counts
    await Chapter.findByIdAndUpdate(chapter._id, {
      $inc: { totalQuestions: createdQuestions.length },
    });
    await Subject.findByIdAndUpdate(chapter.subject._id, {
      $inc: { totalQuestions: createdQuestions.length },
    });

    res.status(201).json({
      success: true,
      count: createdQuestions.length,
      data: createdQuestions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question (Admin)
// @route   PUT /api/questions/:id
// @access  Admin
const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question (Admin)
// @route   DELETE /api/questions/:id
// @access  Admin
const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await Question.findByIdAndUpdate(req.params.id, { isActive: false });

    // Update counts
    await Chapter.findByIdAndUpdate(question.chapter, {
      $inc: { totalQuestions: -1 },
    });
    await Subject.findByIdAndUpdate(question.subject, {
      $inc: { totalQuestions: -1 },
    });

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestions,
  checkAccess,
  createQuestion,
  bulkCreateQuestions,
  updateQuestion,
  deleteQuestion,
};
