import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import authService from '../../auth/services/authService';
import progressService from '../../progress/services/progressService';
import LevelSelector from '../components/LevelSelector';
import DashboardStats from '../components/DashboardStats';
import SubscriptionStatus from '../components/SubscriptionStatus';
import DailyMotivator from '../components/DailyMotivator';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user, selectLevel, updateUser } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const initDashboard = async () => {
      if (!user) return;
      
      // Silently sync gamification streak
      if (user.role === 'student') {
        try {
          const streakRes = await authService.updateStreak();
          // Update global user object with new gamification stats
          updateUser(streakRes.data.data);
        } catch (error) {
          console.error("Streak sync failed:", error);
        }
      }

      // Fetch normal stats
      try {
        const response = await progressService.getMyStats(user.selectedLevel);
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    };
    initDashboard();
  }, [user?.selectedLevel]); // Removing user from dependencies to prevent infinite loop on updateUser

  const handleSelectLevel = async (level) => {
    try {
      await selectLevel(level);
      toast.success(`Level set to ${level.charAt(0).toUpperCase() + level.slice(1)}`);
    } catch (error) {
      toast.error('Failed to update level');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Premium Welcome Header */}
      <div className="mb-10 relative overflow-hidden rounded-3xl p-8 lg:p-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-[#0b0f19] dark:via-[#111827] dark:to-[#0f172a] border border-white/60 dark:border-white/5 shadow-xl shadow-indigo-500/10 dark:shadow-cyan-900/20">
        {/* Abstract Blob Decorations */}
        <div className="absolute w-72 h-72 -top-24 -right-12 bg-gradient-to-br from-cyan-400/30 to-indigo-400/10 dark:from-cyan-600/20 dark:to-indigo-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>
        <div className="absolute w-96 h-96 -bottom-32 -left-20 bg-gradient-to-tr from-indigo-300/30 to-fuchsia-300/10 dark:from-indigo-800/20 dark:to-fuchsia-900/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-cyan-600 dark:from-indigo-300 dark:to-cyan-200 tracking-tight mb-3">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-lg text-indigo-900/70 dark:text-slate-400 font-medium max-w-2xl">
            Your personalized command center. Let's conquer your next CA milestone.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <DashboardStats user={user} stats={stats} />
      </div>

      {/* Quick Actions & Motivation */}
      <div className="mb-8 h-48">
        <DailyMotivator />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Level Selector - Takes 2 columns */}
        <div className="lg:col-span-2">
          <LevelSelector
            selectedLevel={user?.selectedLevel}
            onSelectLevel={handleSelectLevel}
          />
        </div>

        {/* Subscription Status - Takes 1 column */}
        <div className="lg:col-span-1 space-y-8">
          <SubscriptionStatus subscriptions={user?.activeSubscriptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;