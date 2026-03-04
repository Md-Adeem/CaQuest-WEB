import React from 'react';
import { HiBookOpen, HiClipboardList, HiCreditCard, HiStar } from 'react-icons/hi';

const DashboardStats = ({ user, stats }) => {
  const activeSubCount = user?.activeSubscriptions?.filter(
    (s) => new Date(s.expiresAt) > new Date()
  ).length || 0;

  const overall = stats?.overall || {};
  const totalAttempted = overall.totalAttempted || 0;
  const accuracy = overall.accuracy || 0;

  const displayAttempted = stats ? totalAttempted : '—';
  const displayAccuracy = stats ? `${accuracy}%` : '—';

  const dashboardStats = [
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
      value: displayAttempted,
      icon: <HiClipboardList className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      label: 'Accuracy',
      value: displayAccuracy,
      icon: <HiStar className="w-6 h-6" />,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {dashboardStats.map((stat, index) => (
        <div key={index} className="card flex flex-col xl:flex-row items-center text-center xl:text-left gap-3 xl:gap-4 p-4">
          <div className={`${stat.color} text-white p-3 rounded-xl`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;