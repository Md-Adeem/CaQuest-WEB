import api from '../../../shared/utils/api';

const chatService = {
  getConversation: (conversationId) => api.get(`/chat/conversation/${conversationId}`),
  getConversations: () => api.get('/chat/conversations'),
  getUnreadCount: () => api.get('/chat/unread-count'),
};

export default chatService;
