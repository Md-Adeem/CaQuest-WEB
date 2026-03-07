const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get messages for a conversation
// @route   GET /api/chat/conversation/:conversationId
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    // Security: Students can only access their own conversation
    if (req.user.role !== 'admin' && conversationId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(200)
      .lean();

    // Mark messages as read when the recipient opens the conversation
    const updateFilter = req.user.role === 'admin'
      ? { conversationId, senderRole: 'student', read: false }
      : { conversationId, senderRole: 'admin', read: false };

    await Message.updateMany(updateFilter, { $set: { read: true } });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('getConversation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get list of all conversations (Admin only)
// @route   GET /api/chat/conversations
// @access  Private (Admin)
exports.getConversations = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only.' });
    }

    // Aggregate to find unique conversations with latest message
    const conversations = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$text' },
          lastMessageAt: { $first: '$createdAt' },
          lastSenderRole: { $first: '$senderRole' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$senderRole', 'student'] }, { $eq: ['$read', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    // Populate student info for each conversation
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const student = await User.findById(conv._id).select('name email').lean();
        return {
          conversationId: conv._id,
          student: student || { name: 'Deleted User', email: '' },
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          lastSenderRole: conv.lastSenderRole,
          unreadCount: conv.unreadCount,
        };
      })
    );

    res.status(200).json({ success: true, data: populatedConversations });
  } catch (error) {
    console.error('getConversations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get total unread count for admin badge
// @route   GET /api/chat/unread-count
// @access  Private (Admin)
exports.getUnreadCount = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only.' });
    }

    const count = await Message.countDocuments({
      senderRole: 'student',
      read: false,
    });

    res.status(200).json({ success: true, data: { count } });
  } catch (error) {
    console.error('getUnreadCount error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
