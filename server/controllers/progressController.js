const Progress = require('../models/Progress');
const Bookmark = require('../models/Bookmark');
const Question = require('../models/Question');

// @desc    Save a question attempt
// @route   POST /api/progress/attempt
// @access  Private
const saveAttempt = async (req, res, next) => {
  try {
    const {
      questionId,
      selectedAnswer,
      isCorrect,
      timeTaken,
      chapter,
      subject,
      level,
      mode,
    } = req.body;

    // Check for existing attempt on same question
    const existingAttempt = await Progress.findOne({
      user: req.user._id,
      question: questionId,
    });

    if (existingAttempt) {
      existingAttempt.selectedAnswer = selectedAnswer;
      existingAttempt.isCorrect = isCorrect;
      existingAttempt.timeTaken = timeTaken || existingAttempt.timeTaken;
      existingAttempt.attemptNumber += 1;
      existingAttempt.mode = mode || 'practice';
      await existingAttempt.save();

      return res.json({ success: true, data: existingAttempt });
    }

    const progress = await Progress.create({
      user: req.user._id,
      question: questionId,
      selectedAnswer,
      isCorrect,
      timeTaken: timeTaken || 0,
      chapter,
      subject,
      level,
      mode: mode || 'practice',
    });

    res.status(201).json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Save quiz results (bulk)
// @route   POST /api/progress/quiz
// @access  Private
const saveQuizResults = async (req, res, next) => {
  try {
    const { results, chapter, subject, level } = req.body;
    // results = [{ questionId, selectedAnswer, isCorrect, timeTaken }]

    const operations = results.map((r) => ({
      updateOne: {
        filter: { user: req.user._id, question: r.questionId },
        update: {
          $set: {
            selectedAnswer: r.selectedAnswer,
            isCorrect: r.isCorrect,
            timeTaken: r.timeTaken || 0,
            chapter,
            subject,
            level,
            mode: 'quiz',
          },
          $inc: { attemptNumber: 1 },
          $setOnInsert: {
            user: req.user._id,
            question: r.questionId,
          },
        },
        upsert: true,
      },
    }));

    await Progress.bulkWrite(operations);

    res.json({
      success: true,
      message: `${results.length} results saved`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overall stats for current user
// @route   GET /api/progress/stats?level=foundation
// @access  Private
const getMyStats = async (req, res, next) => {
  try {
    const { level } = req.query;
    const match = { user: req.user._id };
    if (level) match.level = level;

    // Overall stats
    const overall = await Progress.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalAttempted: { $sum: 1 },
          totalCorrect: { $sum: { $cond: ['$isCorrect', 1, 0] } },
          totalWrong: { $sum: { $cond: ['$isCorrect', 0, 1] } },
          avgTimeTaken: { $avg: '$timeTaken' },
          totalAttempts: { $sum: '$attemptNumber' },
        },
      },
      {
        $addFields: {
          accuracy: {
            $cond: [
              { $gt: ['$totalAttempted', 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$totalCorrect', '$totalAttempted'] },
                      100,
                    ],
                  },
                  1,
                ],
              },
              0,
            ],
          },
        },
      },
    ]);

    // Subject-wise stats
    const subjectWise = await Progress.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$subject',
          attempted: { $sum: 1 },
          correct: { $sum: { $cond: ['$isCorrect', 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subjectInfo',
        },
      },
      { $unwind: '$subjectInfo' },
      {
        $project: {
          subjectName: '$subjectInfo.name',
          subjectCode: '$subjectInfo.code',
          subjectIcon: '$subjectInfo.icon',
          attempted: 1,
          correct: 1,
          totalQuestions: '$subjectInfo.totalQuestions',
          accuracy: {
            $round: [
              { $multiply: [{ $divide: ['$correct', '$attempted'] }, 100] },
              1,
            ],
          },
        },
      },
      { $sort: { accuracy: 1 } },
    ]);

    // Chapter-wise stats
    const chapterWise = await Progress.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$chapter',
          attempted: { $sum: 1 },
          correct: { $sum: { $cond: ['$isCorrect', 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'chapters',
          localField: '_id',
          foreignField: '_id',
          as: 'chapterInfo',
        },
      },
      { $unwind: '$chapterInfo' },
      {
        $project: {
          chapterName: '$chapterInfo.name',
          chapterNumber: '$chapterInfo.chapterNumber',
          subject: '$chapterInfo.subject',
          attempted: 1,
          correct: 1,
          totalQuestions: '$chapterInfo.totalQuestions',
          accuracy: {
            $round: [
              { $multiply: [{ $divide: ['$correct', '$attempted'] }, 100] },
              1,
            ],
          },
        },
      },
      { $sort: { accuracy: 1 } },
    ]);

    // Daily activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyActivity = await Progress.aggregate([
      {
        $match: {
          ...match,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
          correct: { $sum: { $cond: ['$isCorrect', 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Difficulty breakdown
    const difficultyStats = await Progress.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'questions',
          localField: 'question',
          foreignField: '_id',
          as: 'questionInfo',
        },
      },
      { $unwind: '$questionInfo' },
      {
        $group: {
          _id: '$questionInfo.difficulty',
          attempted: { $sum: 1 },
          correct: { $sum: { $cond: ['$isCorrect', 1, 0] } },
        },
      },
      {
        $project: {
          difficulty: '$_id',
          attempted: 1,
          correct: 1,
          accuracy: {
            $round: [
              { $multiply: [{ $divide: ['$correct', '$attempted'] }, 100] },
              1,
            ],
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        overall: overall[0] || {
          totalAttempted: 0,
          totalCorrect: 0,
          totalWrong: 0,
          avgTimeTaken: 0,
          accuracy: 0,
        },
        subjectWise,
        chapterWise,
        dailyActivity,
        difficultyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chapter-specific progress
// @route   GET /api/progress/chapter/:chapterId
// @access  Private
const getChapterProgress = async (req, res, next) => {
  try {
    const { chapterId } = req.params;

    const attemptedQuestions = await Progress.find({
      user: req.user._id,
      chapter: chapterId,
    }).select('question isCorrect selectedAnswer attemptNumber');

    const attemptedMap = {};
    attemptedQuestions.forEach((p) => {
      attemptedMap[p.question.toString()] = {
        isCorrect: p.isCorrect,
        selectedAnswer: p.selectedAnswer,
        attemptNumber: p.attemptNumber,
      };
    });

    res.json({
      success: true,
      data: {
        totalAttempted: attemptedQuestions.length,
        correct: attemptedQuestions.filter((p) => p.isCorrect).length,
        attemptedMap,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ====== BOOKMARKS ======

// @desc    Toggle bookmark on a question
// @route   POST /api/progress/bookmark
// @access  Private
const toggleBookmark = async (req, res, next) => {
  try {
    const { questionId, note } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const existing = await Bookmark.findOne({
      user: req.user._id,
      question: questionId,
    });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.json({
        success: true,
        bookmarked: false,
        message: 'Bookmark removed',
      });
    }

    await Bookmark.create({
      user: req.user._id,
      question: questionId,
      chapter: question.chapter,
      subject: question.subject,
      level: question.level,
      note: note || '',
    });

    res.status(201).json({
      success: true,
      bookmarked: true,
      message: 'Question bookmarked',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookmarks
// @route   GET /api/progress/bookmarks?level=foundation&chapter=chapterId
// @access  Private
const getBookmarks = async (req, res, next) => {
  try {
    const { level, chapter, subject, page = 1, limit = 20 } = req.query;

    const filter = { user: req.user._id };
    if (level) filter.level = level;
    if (chapter) filter.chapter = chapter;
    if (subject) filter.subject = subject;

    const skip = (page - 1) * limit;

    const bookmarks = await Bookmark.find(filter)
      .populate({
        path: 'question',
        select: 'questionText options correctAnswer explanation difficulty marks',
      })
      .populate('chapter', 'name chapterNumber')
      .populate('subject', 'name code icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Bookmark.countDocuments(filter);

    res.json({
      success: true,
      count: bookmarks.length,
      total,
      totalPages: Math.ceil(total / limit),
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check which questions are bookmarked (for a chapter)
// @route   GET /api/progress/bookmarks/check/:chapterId
// @access  Private
const checkBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user._id,
      chapter: req.params.chapterId,
    }).select('question');

    const bookmarkedIds = bookmarks.map((b) => b.question.toString());

    res.json({
      success: true,
      data: bookmarkedIds,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveAttempt,
  saveQuizResults,
  getMyStats,
  getChapterProgress,
  toggleBookmark,
  getBookmarks,
  checkBookmarks,
};