import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HiX, HiPaperAirplane, HiChat } from 'react-icons/hi';
import { useAuth } from '../../auth/hooks/useAuth';
import socketService from '../services/socketService';
import chatService from '../services/chatService';

const StudentChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const shouldRender = user && user.role !== 'admin';
  const conversationId = user?._id;

  // Connect socket on mount
  useEffect(() => {
    if (!shouldRender) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = socketService.connect(token);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    return () => {
      // Don't fully disconnect — keep alive across page navigations
    };
  }, [shouldRender]);

  // Load history when chat is opened
  useEffect(() => {
    if (!shouldRender) return;
    if (isOpen && conversationId) {
      chatService
        .getConversation(conversationId)
        .then((res) => {
          setMessages(res.data.data);
          setUnreadCount(0);
          socketService.markRead(conversationId);
        })
        .catch(console.error);
    }
  }, [isOpen, conversationId, shouldRender]);

  // Listen for new messages
  useEffect(() => {
    if (!shouldRender) return;
    const handleNewMessage = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
        if (!isOpen && msg.senderRole === 'admin') {
          setUnreadCount((c) => c + 1);
        }
        if (isOpen && msg.senderRole === 'admin') {
          socketService.markRead(conversationId);
        }
      }
    };

    const handleTyping = (data) => {
      if (data.conversationId === conversationId) setIsTyping(true);
    };
    const handleStopTyping = (data) => {
      if (data.conversationId === conversationId) setIsTyping(false);
    };

    socketService.onNewMessage(handleNewMessage);
    socketService.onTyping(handleTyping);
    socketService.onStopTyping(handleStopTyping);

    return () => {
      socketService.offNewMessage(handleNewMessage);
      socketService.offTyping(handleTyping);
      socketService.offStopTyping(handleStopTyping);
    };
  }, [isOpen, conversationId, shouldRender]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    socketService.sendMessage({ text: input.trim(), conversationId });
    socketService.stopTyping(conversationId);
    setInput('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    socketService.startTyping(conversationId);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(conversationId);
    }, 1500);
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        >
          <HiChat className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-slide-up">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 flex justify-between items-center text-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <HiChat className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-sm">CaQuest Support</h3>
                <span className="text-[10px] opacity-80">
                  {connected ? '● Online' : '○ Connecting...'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900/50">
            {messages.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                <HiChat className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Send a message to get help from the Admin!</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={msg._id || idx}
                className={`flex ${msg.senderRole === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    msg.senderRole === 'student'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.senderRole === 'student' ? 'text-white/60' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none px-3 py-2 shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 dark:bg-gray-900 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500/30 text-gray-900 dark:text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <HiPaperAirplane className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default StudentChatWidget;
