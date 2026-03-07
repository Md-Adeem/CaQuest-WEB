const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');

module.exports = function initializeSocket(io) {
  // Track online users: { oderId: socket.id }
  const onlineUsers = new Map();

  // Authenticate socket connections via JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication error'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password').lean();
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    const role = socket.user.role;

    // Register user as online
    onlineUsers.set(userId, socket.id);
    console.log(`🔌 Socket connected: ${socket.user.name} (${role})`);

    // If admin connects, join the "admins" room
    if (role === 'admin') {
      socket.join('admins');
    }

    // ========= SEND MESSAGE =========
    socket.on('send_message', async (data, callback) => {
      try {
        const { text, conversationId } = data;

        if (!text || !text.trim()) return;

        // Determine conversation ID
        // For students: conversationId is always their own userId
        // For admins: conversationId is the student's userId they're replying to
        const convId = role === 'student' ? userId : conversationId;

        if (!convId) return;

        const message = await Message.create({
          conversationId: convId,
          sender: userId,
          senderRole: role,
          text: text.trim(),
        });

        const messageData = {
          _id: message._id,
          conversationId: message.conversationId,
          sender: userId,
          senderRole: role,
          senderName: socket.user.name,
          text: message.text,
          read: false,
          createdAt: message.createdAt,
        };

        // Deliver the message
        if (role === 'student') {
          // Student sent → deliver to all connected admins
          io.to('admins').emit('new_message', messageData);
          // Also echo back to the sender
          socket.emit('new_message', messageData);
        } else {
          // Admin sent → deliver to the specific student
          const studentSocketId = onlineUsers.get(convId);
          if (studentSocketId) {
            io.to(studentSocketId).emit('new_message', messageData);
          }
          // Also echo back to the sending admin
          socket.emit('new_message', messageData);
          // Also broadcast to other admins so their inbox updates
          socket.to('admins').emit('new_message', messageData);
        }

        if (callback) callback({ success: true, message: messageData });
      } catch (error) {
        console.error('send_message error:', error);
        if (callback) callback({ success: false, error: error.message });
      }
    });

    // ========= MARK AS READ =========
    socket.on('mark_read', async ({ conversationId }) => {
      try {
        const filter = role === 'admin'
          ? { conversationId, senderRole: 'student', read: false }
          : { conversationId, senderRole: 'admin', read: false };

        await Message.updateMany(filter, { $set: { read: true } });

        // Notify the other side that messages were read
        if (role === 'admin') {
          const studentSocketId = onlineUsers.get(conversationId);
          if (studentSocketId) {
            io.to(studentSocketId).emit('messages_read', { conversationId });
          }
        } else {
          io.to('admins').emit('messages_read', { conversationId });
        }
      } catch (error) {
        console.error('mark_read error:', error);
      }
    });

    // ========= TYPING INDICATOR =========
    socket.on('typing', ({ conversationId }) => {
      if (role === 'student') {
        io.to('admins').emit('user_typing', { conversationId, userName: socket.user.name });
      } else {
        const studentSocketId = onlineUsers.get(conversationId);
        if (studentSocketId) {
          io.to(studentSocketId).emit('user_typing', { conversationId, userName: 'Admin' });
        }
      }
    });

    socket.on('stop_typing', ({ conversationId }) => {
      if (role === 'student') {
        io.to('admins').emit('user_stop_typing', { conversationId });
      } else {
        const studentSocketId = onlineUsers.get(conversationId);
        if (studentSocketId) {
          io.to(studentSocketId).emit('user_stop_typing', { conversationId });
        }
      }
    });

    // ========= DISCONNECT =========
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      console.log(`🔌 Socket disconnected: ${socket.user.name}`);
    });
  });
};
