import React, { useState, useEffect, useRef } from 'react';
import { HiChat, HiPaperAirplane, HiArrowLeft } from 'react-icons/hi';
import { useAuth } from '../../auth/hooks/useAuth';
import socketService from '../services/socketService';
import chatService from '../services/chatService';
import { getInitials } from '../../../shared/utils/helpers';
import AdminSidebar from '../../admin/components/AdminSidebar';

const AdminChatDashboard = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Connect socket
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) socketService.connect(token);
  }, []);

  // Load conversations list
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await chatService.getConversations();
      setConversations(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load messages when a conversation is selected
  useEffect(() => {
    if (!activeConv) return;
    chatService
      .getConversation(activeConv.conversationId)
      .then((res) => {
        setMessages(res.data.data);
        socketService.markRead(activeConv.conversationId);
        // Update unread count in sidebar
        setConversations((prev) =>
          prev.map((c) =>
            c.conversationId === activeConv.conversationId ? { ...c, unreadCount: 0 } : c
          )
        );
      })
      .catch(console.error);
  }, [activeConv?.conversationId]);

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (msg) => {
      // If we're viewing this conversation, add the message
      if (activeConv && msg.conversationId === activeConv.conversationId) {
        setMessages((prev) => [...prev, msg]);
        socketService.markRead(msg.conversationId);
      } else {
        // Update unread count in sidebar
        setConversations((prev) =>
          prev.map((c) =>
            c.conversationId === msg.conversationId
              ? { ...c, unreadCount: (c.unreadCount || 0) + 1, lastMessage: msg.text, lastMessageAt: msg.createdAt }
              : c
          )
        );
        // If this is a brand new conversation, add it to the list
        if (msg.senderRole === 'student' && !conversations.find((c) => c.conversationId === msg.conversationId)) {
          loadConversations();
        }
      }
    };

    const handleTyping = (data) => {
      if (activeConv && data.conversationId === activeConv.conversationId) setIsTyping(true);
    };
    const handleStopTyping = (data) => {
      if (activeConv && data.conversationId === activeConv.conversationId) setIsTyping(false);
    };

    socketService.onNewMessage(handleNewMessage);
    socketService.onTyping(handleTyping);
    socketService.onStopTyping(handleStopTyping);

    return () => {
      socketService.offNewMessage(handleNewMessage);
      socketService.offTyping(handleTyping);
      socketService.offStopTyping(handleStopTyping);
    };
  }, [activeConv?.conversationId, conversations]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || !activeConv) return;

    socketService.sendMessage({
      text: input.trim(),
      conversationId: activeConv.conversationId,
    });
    socketService.stopTyping(activeConv.conversationId);
    setInput('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (activeConv) {
      socketService.startTyping(activeConv.conversationId);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(activeConv.conversationId);
      }, 1500);
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] relative">
      <AdminSidebar />
      <div className="flex-1 flex h-[calc(100vh-4rem)] lg:h-auto overflow-hidden">
      {/* Left: Conversations List */}
      <div
        className={`w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 ${
          activeConv ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HiChat className="w-5 h-5 text-primary-600" />
            Support Inbox
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <HiChat className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Messages from students will appear here</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.conversationId}
                onClick={() => setActiveConv(conv)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50 ${
                  activeConv?.conversationId === conv.conversationId
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-l-primary-600'
                    : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-700 dark:text-primary-400">
                    {getInitials(conv.student?.name || 'U')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {conv.student?.name || 'Unknown'}
                    </p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mr-2">
                      {conv.lastSenderRole === 'admin' && 'You: '}
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right: Active Chat */}
      <div className={`flex-1 flex flex-col ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <HiChat className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm mt-1">Choose a student from the sidebar to start replying</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setActiveConv(null)}
                className="md:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <HiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-700 dark:text-primary-400">
                  {getInitials(activeConv.student?.name || 'U')}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activeConv.student?.name || 'Unknown'}
                </p>
                <p className="text-[11px] text-gray-400">{activeConv.student?.email}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
              {messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                      msg.senderRole === 'admin'
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        msg.senderRole === 'admin' ? 'text-white/60' : 'text-gray-400'
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
              className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 flex-shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Reply to student..."
                className="flex-1 bg-gray-100 dark:bg-gray-900 border-none rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/30 text-gray-900 dark:text-white placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <HiPaperAirplane className="w-5 h-5" />
              </button>
            </form>
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default AdminChatDashboard;
