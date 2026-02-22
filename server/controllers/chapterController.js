const Chapter = require('../models/Chapter');
const Subject = require('../models/Subject');
const Question = require('../models/Question');

// @desc    Get chapters by subject
// @route   GET /api/chapters?subject=subjectId
// @access  Private
const getChapters = async (req, res, next) => {
  try {
    const { subject, level } = req.query;

    const filter = { isActive: true };
    if (subject) filter.subject = subject;
    if (level) filter.level = level;

    const chapters = await Chapter.find(filter)
      .populate('subject', 'name code level icon')
      .sort({ chapterNumber: 1 });

    res.json({
      success: true,
      count: chapters.length,
      data: chapters,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single chapter
// @route   GET /api/chapters/:id
// @access  Private
const getChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id)
      .populate('subject', 'name code level icon');

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    res.json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create chapter (Admin)
// @route   POST /api/chapters
// @access  Admin
const createChapter = async (req, res, next) => {
  try {
    const { name, chapterNumber, subject, description } = req.body;

    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // Check duplicate chapter number within subject
    const existingChapter = await Chapter.findOne({
      subject,
      chapterNumber,
      isActive: true,
    });

    if (existingChapter) {
      return res.status(400).json({
        success: false,
        message: `Chapter ${chapterNumber} already exists in this subject`,
      });
    }

    const chapter = await Chapter.create({
      name,
      chapterNumber,
      subject,
      level: subjectDoc.level,
      description,
    });

    // Update subject's chapter count
    const chapterCount = await Chapter.countDocuments({
      subject,
      isActive: true,
    });
    await Subject.findByIdAndUpdate(subject, {
      totalChapters: chapterCount,
    });

    const populated = await Chapter.findById(chapter._id)
      .populate('subject', 'name code level');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update chapter (Admin)
// @route   PUT /api/chapters/:id
// @access  Admin
const updateChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('subject', 'name code level');

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    res.json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete chapter (soft delete) (Admin)
// @route   DELETE /api/chapters/:id
// @access  Admin
const deleteChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    await Chapter.findByIdAndUpdate(req.params.id, { isActive: false });
    await Question.updateMany(
      { chapter: req.params.id },
      { isActive: false }
    );

    // Update subject's chapter count
    const chapterCount = await Chapter.countDocuments({
      subject: chapter.subject,
      isActive: true,
    });
    await Subject.findByIdAndUpdate(chapter.subject, {
      totalChapters: chapterCount,
    });

    res.json({
      success: true,
      message: 'Chapter and related questions deactivated',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter,
};