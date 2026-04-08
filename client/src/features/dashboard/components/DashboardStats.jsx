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
      icon: <HiBookOpen className="w-7 h-7" />,
      iconBg: 'bg-gradient-to-br from-sky-400 to-indigo-600',
      glowColor: 'shadow-indigo-500/30 dark:shadow-indigo-500/20',
    },
    {
      label: 'Active Subscriptions',
      value: activeSubCount,
      icon: <HiCreditCard className="w-7 h-7" />,
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600',
      glowColor: 'shadow-emerald-500/30 dark:shadow-teal-500/20',
    },
    {
      label: 'Questions Attempted',
      value: displayAttempted,
      icon: <HiClipboardList className="w-7 h-7" />,
      iconBg: 'bg-gradient-to-br from-fuchsia-400 to-purple-600',
      glowColor: 'shadow-purple-500/30 dark:shadow-fuchsia-500/20',
    },
    {
      label: 'Accuracy',
      value: displayAccuracy,
      icon: <HiStar className="w-7 h-7" />,
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      glowColor: 'shadow-orange-500/30 dark:shadow-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {dashboardStats.map((stat, index) => (
        <div 
          key={index} 
          className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/50 dark:border-gray-700/50 shadow-sm hover:shadow-xl dark:shadow-none hover:-translate-y-1 transition-all duration-300 rounded-3xl p-5 flex flex-col xl:flex-row items-center text-center xl:text-left gap-4 overflow-hidden group"
        >
          {/* Subtle geometric wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          
          <div className={`${stat.iconBg} ${stat.glowColor} text-white p-3.5 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            {stat.icon}
          </div>
          <div className="z-10">
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{stat.value}</p>
            <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;