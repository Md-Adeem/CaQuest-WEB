const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Question = require('../models/Question');

// @desc    Get subjects by level
// @route   GET /api/subjects?level=foundation
// @access  Private
const getSubjects = async (req, res, next) => {
  try {
    const { level, search, page = 1, limit = 50 } = req.query;

    const filter = { isActive: true };
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const subjects = await Subject.find(filter)
      .sort({ order: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Subject.countDocuments(filter);

    res.json({
      success: true,
      count: subjects.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: subjects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ALL subjects including inactive (Admin)
// @route   GET /api/subjects/all
// @access  Admin
const getAllSubjects = async (req, res, next) => {
  try {
    const { level } = req.query;
    const filter = {};
    if (level) filter.level = level;

    const subjects = await Subject.find(filter).sort({ level: 1, order: 1 });

    res.json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single subject with chapters
// @route   GET /api/subjects/:id
// @access  Private
const getSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    const chapters = await Chapter.find({
      subject: subject._id,
      isActive: true,
    }).sort({ chapterNumber: 1 });

    res.json({
      success: true,
      data: { ...subject.toObject(), chapters },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create subject (Admin)
// @route   POST /api/subjects
// @access  Admin
const createSubject = async (req, res, next) => {
  try {
    const { name, code, level, description, order, icon } = req.body;

    // Check duplicate code
    const existing = await Subject.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A subject with this code already exists',
      });
    }

    // Auto-calculate order if not provided
    let subjectOrder = order;
    if (!subjectOrder) {
      const lastSubject = await Subject.findOne({ level })
        .sort({ order: -1 });
      subjectOrder = lastSubject ? lastSubject.order + 1 : 1;
    }

    const subject = await Subject.create({
      name,
      code: code.toUpperCase(),
      level,
      description,
      order: subjectOrder,
      icon: icon || '📚',
    });

    res.status(201).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subject (Admin)
// @route   PUT /api/subjects/:id
// @access  Admin
const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    res.json({
      success: true,
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subject (soft delete) (Admin)
// @route   DELETE /api/subjects/:id
// @access  Admin
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // Soft delete subject and all its chapters/questions
    await Subject.findByIdAndUpdate(req.params.id, { isActive: false });
    await Chapter.updateMany({ subject: req.params.id }, { isActive: false });
    await Question.updateMany({ subject: req.params.id }, { isActive: false });

    res.json({
      success: true,
      message: 'Subject and related chapters/questions deactivated',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder subjects (Admin)
// @route   PUT /api/subjects/reorder
// @access  Admin
const reorderSubjects = async (req, res, next) => {
  try {
    const { orderedIds } = req.body; // Array of subject IDs in new order

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index + 1 },
      },
    }));

    await Subject.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: 'Subjects reordered successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjects,
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  reorderSubjects,
};