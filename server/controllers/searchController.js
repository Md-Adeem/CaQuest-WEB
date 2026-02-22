const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Question = require('../models/Question');

// @desc    Global search across subjects, chapters, questions
// @route   GET /api/search?q=accounting&type=all
// @access  Private
const search = async (req, res, next) => {
  try {
    const { q, type = 'all', level, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    const regex = new RegExp(q, 'i');
    const results = {};

    const levelFilter = level ? { level } : {};

    // Search subjects
    if (type === 'all' || type === 'subjects') {
      results.subjects = await Subject.find({
        isActive: true,
        ...levelFilter,
        $or: [
          { name: regex },
          { code: regex },
          { description: regex },
        ],
      })
        .limit(parseInt(limit))
        .select('name code level icon description totalChapters totalQuestions');
    }

    // Search chapters
    if (type === 'all' || type === 'chapters') {
      results.chapters = await Chapter.find({
        isActive: true,
        ...levelFilter,
        $or: [
          { name: regex },
          { description: regex },
        ],
      })
        .populate('subject', 'name code icon')
        .limit(parseInt(limit))
        .select('name chapterNumber subject level totalQuestions');
    }

    // Search questions (only if user has subscription - handled in frontend)
    if (type === 'all' || type === 'questions') {
      results.questions = await Question.find({
        isActive: true,
        ...levelFilter,
        $or: [
          { questionText: regex },
          { explanation: regex },
        ],
      })
        .populate('chapter', 'name chapterNumber')
        .populate('subject', 'name code')
        .limit(parseInt(limit))
        .select('questionText difficulty level chapter subject');
    }

    // Count total results
    const totalResults =
      (results.subjects?.length || 0) +
      (results.chapters?.length || 0) +
      (results.questions?.length || 0);

    res.json({
      success: true,
      query: q,
      totalResults,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { search };