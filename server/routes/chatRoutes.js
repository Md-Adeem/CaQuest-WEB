const express = require('express');
const { getConversation, getConversations, getUnreadCount } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/unread-count', protect, getUnreadCount);
router.get('/conversation/:conversationId', protect, getConversation);

module.exports = router;
