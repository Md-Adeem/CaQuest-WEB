import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiChartBar, HiCreditCard, HiQuestionMarkCircle,
  HiArrowLeft, HiBookOpen, HiCog, HiUsers, HiChat
} from 'react-icons/hi';
import api from '../../../shared/utils/api';
import socketService from '../../chat/services/socketService';

const AdminSidebar = () => {
  const location = useLocation();
  const [pendingPayments, setPendingPayments] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);

  // Fetch badge counts on mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [statsRes, chatRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/chat/unread-count'),
        ]);
        setPendingPayments(statsRes.data.data.pendingPayments || 0);
        setUnreadChats(chatRes.data.data.count || 0);
      } catch (err) {
        // Silently fail — badges are non-critical
      }
    };
    fetchCounts();
  }, [location.pathname]);

  // Listen for real-time chat messages to update badge live
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) socketService.connect(token);

    const handleNewMessage = (msg) => {
      // Only increment if the student sent it and we're NOT already on the chat page
      if (msg.senderRole === 'student' && !location.pathname.startsWith('/admin/chat')) {
        setUnreadChats((prev) => prev + 1);
      }
    };

    socketService.onNewMessage(handleNewMessage);
    return () => socketService.offNewMessage(handleNewMessage);
  }, [location.pathname]);

  // Reset chat badge when navigating to the chat page
  useEffect(() => {
    if (location.pathname.startsWith('/admin/chat')) {
      setUnreadChats(0);
    }
  }, [location.pathname]);

  const links = [
    { path: '/admin', icon: HiChartBar, label: 'Dashboard', exact: true },
    { path: '/admin/students', icon: HiUsers, label: 'Students' },
    { path: '/admin/payments', icon: HiCreditCard, label: 'Payments', badge: pendingPayments },
    { path: '/admin/content', icon: HiBookOpen, label: 'Content' },
    { path: '/admin/questions', icon: HiQuestionMarkCircle, label: 'Questions' },
    { path: '/admin/plans', icon: HiCog, label: 'Plans' },
    { path: '/admin/chat', icon: HiChat, label: 'Support Chat', badge: unreadChats },
  ];

  return (
    <aside className="lg:w-64 bg-white dark:bg-gray-800 border-b lg:border-r border-gray-100 dark:border-gray-700 lg:min-h-[calc(100vh-4rem)] p-4 lg:p-6 sticky top-16 z-40">
      <div className="hidden lg:block mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Admin Panel</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Manage your platform</p>
      </div>

      <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:space-y-1 hide-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
        {links.map((link) => {
          const isActive = link.exact
            ? location.pathname === link.path
            : location.pathname.startsWith(link.path);

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex-shrink-0 flex items-center gap-2 lg:gap-3 px-3 py-2 lg:px-4 lg:py-3 rounded-xl text-sm font-medium transition-all relative ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="whitespace-nowrap">{link.label}</span>
              {link.badge > 0 && (
                <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {link.badge > 99 ? '99+' : link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="hidden lg:block mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Student View
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;