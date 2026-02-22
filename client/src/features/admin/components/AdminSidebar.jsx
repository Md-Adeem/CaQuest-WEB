import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiChartBar, HiCreditCard, HiQuestionMarkCircle,
  HiArrowLeft, HiBookOpen, HiCog,
} from 'react-icons/hi';

const AdminSidebar = () => {
  const location = useLocation();

  const links = [
    { path: '/admin', icon: HiChartBar, label: 'Dashboard', exact: true },
    { path: '/admin/payments', icon: HiCreditCard, label: 'Payments' },
    { path: '/admin/content', icon: HiBookOpen, label: 'Content' },
    { path: '/admin/questions', icon: HiQuestionMarkCircle, label: 'Questions' },
    { path: '/admin/plans', icon: HiCog, label: 'Plans' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] p-6 hidden lg:block sticky top-16">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Admin Panel</h2>
        <p className="text-xs text-gray-500">Manage your platform</p>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = link.exact
            ? location.pathname === link.path
            : location.pathname.startsWith(link.path);

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-100">
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