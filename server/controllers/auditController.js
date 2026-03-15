const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs (paginated)
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
exports.getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};
    if (req.query.action) {
      query.action = req.query.action;
    }

    // Execute query
    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .lean();

    // Pagination result
    const pagination = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };

    res.status(200).json({
      success: true,
      count: logs.length,
      pagination,
      data: logs
    });
  } catch (error) {
    console.error('getAuditLogs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error retrieving audit logs'
    });
  }
};
