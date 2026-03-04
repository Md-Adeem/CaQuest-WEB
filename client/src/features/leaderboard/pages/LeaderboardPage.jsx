import React, { useState, useEffect } from 'react';
import { HiFire, HiStar } from 'react-icons/hi';
import authService from '../../auth/services/authService';
import toast from 'react-hot-toast';
import SEO from '../../../shared/components/SEO';

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await authService.getLeaderboard();
        setLeaders(response.data.data);
      } catch (error) {
        toast.error('Failed to load leaderboard');
        console.error('Leaderboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);



  // Podium colors
  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 2:
        return 'text-gray-400 bg-gray-100 dark:bg-gray-800';
      case 3:
        return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Global Leaderboard - CaQuest"
        description="Check out the top performing CA students on the CaQuest platform based on their study streaks."
      />
      
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight flex items-center justify-center gap-3">
              <HiStar className="text-yellow-500" /> Global Leaderboard
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Rankings are based on daily study streaks. Keep practicing every day to climb to the top!
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="col-span-2 md:col-span-1 text-center">Rank</div>
              <div className="col-span-6 md:col-span-5">Student</div>
              <div className="hidden md:block col-span-3 text-center">Level</div>
              <div className="col-span-4 md:col-span-3 text-center">Current Streak</div>
            </div>

            {/* Leaderboard Rows */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {leaders.length === 0 ? (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  No active students found. Start practicing to be the first!
                </div>
              ) : (
                leaders.map((student, index) => {
                  const rank = index + 1;
                  return (
                    <div 
                      key={index} 
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* Rank Badge */}
                      <div className="col-span-2 md:col-span-1 flex justify-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${getRankColor(rank)}`}>
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                        </div>
                      </div>

                      {/* Name & Title */}
                      <div className="col-span-6 md:col-span-5 flex flex-col justify-center">
                        <span className="font-bold text-gray-900 dark:text-white truncate">
                          {student.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden block mt-0.5">
                          {student.level}
                        </span>
                      </div>

                      {/* Level (Desktop Only) */}
                      <div className="hidden md:flex col-span-3 items-center justify-center">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                          {student.level}
                        </span>
                      </div>

                      {/* Streak Score */}
                      <div className="col-span-4 md:col-span-3 flex justify-center">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-bold rounded-lg whitespace-nowrap">
                          <HiFire className="w-5 h-5 animate-pulse" />
                          <span className="text-base">{student.currentStreak} Days</span>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default LeaderboardPage;
