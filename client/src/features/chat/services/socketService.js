import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5000';

let socket = null;

const socketService = {
  connect: (token) => {
    if (socket?.connected) return socket;

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('💬 Chat connected');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket: () => socket,

  sendMessage: (data, callback) => {
    if (socket) {
      socket.emit('send_message', data, callback);
    }
  },

  markRead: (conversationId) => {
    if (socket) {
      socket.emit('mark_read', { conversationId });
    }
  },

  startTyping: (conversationId) => {
    if (socket) {
      socket.emit('typing', { conversationId });
    }
  },

  stopTyping: (conversationId) => {
    if (socket) {
      socket.emit('stop_typing', { conversationId });
    }
  },

  onNewMessage: (callback) => {
    if (socket) socket.on('new_message', callback);
  },

  offNewMessage: (callback) => {
    if (socket) socket.off('new_message', callback);
  },

  onTyping: (callback) => {
    if (socket) socket.on('user_typing', callback);
  },

  offTyping: (callback) => {
    if (socket) socket.off('user_typing', callback);
  },

  onStopTyping: (callback) => {
    if (socket) socket.on('user_stop_typing', callback);
  },

  offStopTyping: (callback) => {
    if (socket) socket.off('user_stop_typing', callback);
  },

  onMessagesRead: (callback) => {
    if (socket) socket.on('messages_read', callback);
  },

  offMessagesRead: (callback) => {
    if (socket) socket.off('messages_read', callback);
  },
};

export default socketService;
