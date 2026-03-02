import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiChartBar, HiCreditCard, HiQuestionMarkCircle,
  HiArrowLeft, HiBookOpen, HiCog, HiUsers
} from 'react-icons/hi';

const AdminSidebar = () => {
  const location = useLocation();

  const links = [
    { path: '/admin', icon: HiChartBar, label: 'Dashboard', exact: true },
    { path: '/admin/students', icon: HiUsers, label: 'Students' },
    { path: '/admin/payments', icon: HiCreditCard, label: 'Payments' },
    { path: '/admin/content', icon: HiBookOpen, label: 'Content' },
    { path: '/admin/questions', icon: HiQuestionMarkCircle, label: 'Questions' },
    { path: '/admin/plans', icon: HiCog, label: 'Plans' },
  ];

  return (
    <aside className="lg:w-64 bg-white border-b lg:border-r border-gray-100 lg:min-h-[calc(100vh-4rem)] p-4 lg:p-6 sticky top-16 z-40">
      <div className="hidden lg:block mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Admin Panel</h2>
        <p className="text-xs text-gray-500">Manage your platform</p>
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
              className={`flex-shrink-0 flex items-center gap-2 lg:gap-3 px-3 py-2 lg:px-4 lg:py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="whitespace-nowrap">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden lg:block mt-8 pt-8 border-t border-gray-100">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Student View
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;