import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import progressService from '../../progress/services/progressService';
import LevelSelector from '../components/LevelSelector';
import DashboardStats from '../components/DashboardStats';
import SubscriptionStatus from '../components/SubscriptionStatus';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user, selectLevel } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const response = await progressService.getMyStats(user.selectedLevel);
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    };
    fetchStats();
  }, [user?.selectedLevel, user]);

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
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's your study dashboard. Keep up the great work!
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <DashboardStats user={user} stats={stats} />
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
        <div className="lg:col-span-1">
          <SubscriptionStatus subscriptions={user?.activeSubscriptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;