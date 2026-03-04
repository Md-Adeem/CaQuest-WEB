import React from 'react';
import { formatCurrency } from '../../../shared/utils/helpers';
import {
  HiUsers,
  HiQuestionMarkCircle,
  HiCreditCard,
  HiCurrencyRupee,
  HiClock,
  HiBookOpen,
} from 'react-icons/hi';

const AdminStats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      label: 'Total Students',
      value: stats.totalUsers,
      icon: HiUsers,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Questions',
      value: stats.totalQuestions,
      icon: HiQuestionMarkCircle,
      color: 'bg-purple-500',
    },
    {
      label: 'Pending Payments',
      value: stats.pendingPayments,
      icon: HiClock,
      color: 'bg-yellow-500',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: HiCurrencyRupee,
      color: 'bg-green-500',
    },
    {
      label: 'Approved Payments',
      value: stats.approvedPayments,
      icon: HiCreditCard,
      color: 'bg-emerald-500',
    },
    {
      label: 'Total Subjects',
      value: stats.totalSubjects,
      icon: HiBookOpen,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="card text-center">
          <div
            className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
          >
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;