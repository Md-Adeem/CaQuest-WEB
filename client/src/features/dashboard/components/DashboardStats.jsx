import React from 'react';
import { HiBookOpen, HiClipboardList, HiCreditCard, HiStar } from 'react-icons/hi';

const DashboardStats = ({ user }) => {
  const activeSubCount = user?.activeSubscriptions?.filter(
    (s) => new Date(s.expiresAt) > new Date()
  ).length || 0;

  const stats = [
    {
      label: 'Active Level',
      value: user?.selectedLevel
        ? user.selectedLevel.charAt(0).toUpperCase() + user.selectedLevel.slice(1)
        : 'Not Selected',
      icon: <HiBookOpen className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Subscriptions',
      value: activeSubCount,
      icon: <HiCreditCard className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      label: 'Questions Attempted',
      value: '—',
      icon: <HiClipboardList className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      label: 'Accuracy',
      value: '—',
      icon: <HiStar className="w-6 h-6" />,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="card flex items-center gap-4">
          <div className={`${stat.color} text-white p-3 rounded-xl`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;