import React, { useState, useRef, useEffect } from 'react';
import { HiX, HiSparkles, HiPaperAirplane } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import aiService from '../services/aiService';
import toast from 'react-hot-toast';

const AiTutorModal = ({ isOpen, onClose, questionContext }) => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm your CA AI Tutor. What part of this question would you like me to explain?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Reset chat when opened with a new question
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          role: 'ai',
          text: "Hi! I'm your ICAI AI Tutor. What part of this question would you like me to explain?"
        }
      ]);
      setInput('');
    }
  }, [isOpen, questionContext?.questionText]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await aiService.askTutor(questionContext, userMessage);
      setMessages(prev => [...prev, { role: 'ai', text: res.text }]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to connect to AI Tutor.');
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: "I'm having trouble connecting right now. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm sm:items-end">
      <div 
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden sm:mb-8"
        style={{ height: '80vh', maxHeight: '700px' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-600 to-primary-700 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <HiSparkles className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-lg tracking-wide">CA AI Tutor</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
          {/* Question Context Bubble (Read Only) */}
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-sm">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Question Context</span>
            <p className="text-gray-700 dark:text-gray-300 line-clamp-3 italic">
              "{questionContext?.questionText}"
            </p>
          </div>

          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <form 
            onSubmit={handleSend}
            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for an explanation..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-white placeholder-gray-500 py-2"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiPaperAirplane className="w-5 h-5 translate-x-0.5 -translate-y-0.5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400">AI can make mistakes. Verify important information with ICAI modules.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiTutorModal;
