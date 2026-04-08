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
        return 'text-yellow-500 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
      case 2:
        return 'text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-500/20 border border-slate-200 dark:border-slate-400/50 shadow-[0_0_15px_rgba(148,163,184,0.2)]';
      case 3:
        return 'text-orange-600 dark:text-amber-500 bg-orange-100 dark:bg-amber-600/20 border border-orange-200 dark:border-amber-600/50 shadow-[0_0_15px_rgba(217,119,6,0.2)]';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-transparent';
    }
  };

  const getRowHighlight = (rank) => {
    if (rank === 1) return 'dark:bg-gradient-to-r dark:from-yellow-500/10 dark:via-transparent dark:to-transparent border-l-4 border-yellow-400 dark:border-yellow-500';
    if (rank === 2) return 'dark:bg-gradient-to-r dark:from-slate-400/10 dark:via-transparent dark:to-transparent border-l-4 border-slate-400 dark:border-slate-400';
    if (rank === 3) return 'dark:bg-gradient-to-r dark:from-amber-600/10 dark:via-transparent dark:to-transparent border-l-4 border-orange-400 dark:border-amber-600';
    return 'border-l-4 border-transparent';
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
      
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-[#0b0f19] dark:to-slate-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Decorative Backglow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-indigo-500/10 dark:bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full"></div>

          {/* Header */}
          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center justify-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl mb-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 group">
              <HiStar className="text-5xl text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-300 dark:to-cyan-300 mb-4 tracking-tight">
              Global Leaderboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Rankings driven by elite dedication. Keep your study streak alive to claim the podium.
            </p>
          </div>

          <div className="relative z-10 bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700/60 overflow-hidden">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-5 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/50 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-6">
              <div className="col-span-2 md:col-span-1 text-center">Rank</div>
              <div className="col-span-6 md:col-span-5 pl-2">Student Name</div>
              <div className="hidden md:block col-span-3 text-center">Module Status</div>
              <div className="col-span-4 md:col-span-3 text-center">Active Streak</div>
            </div>

            {/* Leaderboard Rows */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {leaders.length === 0 ? (
                <div className="p-16 text-center text-gray-500 dark:text-gray-400 font-medium italic">
                  No active students found. Begin studying to forge the first streak!
                </div>
              ) : (
                leaders.map((student, index) => {
                  const rank = index + 1;
                  return (
                    <div 
                      key={index} 
                      className={`grid grid-cols-12 gap-4 p-5 items-center hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 ${getRowHighlight(rank)}`}
                    >
                      {/* Rank Badge */}
                      <div className="col-span-2 md:col-span-1 flex justify-center">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg ${getRankColor(rank)}`}>
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                        </div>
                      </div>

                      {/* Name & Title */}
                      <div className="col-span-6 md:col-span-5 flex flex-col justify-center pl-2">
                        <span className="font-extrabold text-gray-900 dark:text-white truncate text-base md:text-lg tracking-tight">
                          {student.name}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest md:hidden block mt-1">
                          {student.level}
                        </span>
                      </div>

                      {/* Level (Desktop Only) */}
                      <div className="hidden md:flex col-span-3 items-center justify-center">
                        <span className="px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                          {student.level}
                        </span>
                      </div>

                      {/* Streak Score */}
                      <div className="col-span-4 md:col-span-3 flex justify-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 text-orange-600 dark:text-orange-400 font-bold rounded-xl whitespace-nowrap shadow-sm border border-orange-100 dark:border-orange-800/30">
                          <HiFire className="w-5 h-5 text-orange-500 animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                          <span className="text-sm tracking-wide">{student.currentStreak} Days</span>
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
