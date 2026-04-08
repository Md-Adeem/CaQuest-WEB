import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import progressService from "../services/progressService";
import { StatsShimmer, ListShimmer } from "../../../shared/components/Shimmer";
import Badge from "../../../shared/components/Badge";
import { LEVELS } from "../../../shared/utils/constants";
import {
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiTrendingUp,
  HiChartBar,
  HiBookmark,
  HiLightningBolt,
  HiAcademicCap,
} from "react-icons/hi";

const ProgressPage = () => {
  useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [activeTab, setActiveTab] = useState("subjects");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await progressService.getMyStats(selectedLevel);
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to load stats:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedLevel]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-8 animate-pulse" />
        <StatsShimmer />
        <div className="mt-8">
          <ListShimmer count={5} />
        </div>
      </div>
    );
  }

  const overall = stats?.overall || {};
  const accuracy = overall.accuracy || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Premium Header */}
      <div className="relative text-center mb-14">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-48 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full"></div>
        <div className="inline-flex items-center justify-center p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl mb-4 shadow-xl border border-gray-200/50 dark:border-gray-700/50 relative z-10 group">
          <HiChartBar className="text-4xl text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform duration-500" />
        </div>
        <h1 className="relative z-10 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-800 dark:from-indigo-300 dark:to-cyan-200 tracking-tight leading-tight mb-4">
          Analytics & Progress
        </h1>
        <p className="relative z-10 text-lg sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Visualize your journey. Track your performance metrics and pinpoint critical growth areas.
        </p>
      </div>

      {/* Level Filter - Frosted Glass */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 p-2 bg-slate-100/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700/60 w-fit mx-auto shadow-sm relative z-10">
        <button
          onClick={() => setSelectedLevel("")}
          className={`px-6 py-2.5 rounded-xl text-[13px] font-black tracking-widest transition-all duration-300 uppercase ${
            !selectedLevel
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
          }`}
        >
          All Modules
        </button>
        {Object.values(LEVELS).map((level) => (
          <button
            key={level.id}
            onClick={() => setSelectedLevel(level.id)}
            className={`px-6 py-2.5 rounded-xl text-[13px] font-black tracking-widest transition-all duration-300 uppercase flex items-center gap-2 ${
              selectedLevel === level.id
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <span>{level.icon}</span> {level.name}
          </button>
        ))}
      </div>

      {/* Overview Stats - Premium Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-6 text-center shadow-lg shadow-indigo-500/5 group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-blue-200 dark:border-blue-700/50">
            <HiAcademicCap className="w-7 h-7 text-blue-600 dark:text-blue-400 drop-shadow-sm group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
            {overall.totalAttempted || 0}
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-2">Questions Attempted</p>
        </div>

        <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-6 text-center shadow-lg shadow-emerald-500/5 group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full"></div>
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-emerald-200 dark:border-emerald-700/50">
            <HiCheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400 drop-shadow-sm group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight drop-shadow-sm">
            {overall.totalCorrect || 0}
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-2">Correct Answers</p>
        </div>

        <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-6 text-center shadow-lg shadow-rose-500/5 group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/10 blur-2xl rounded-full"></div>
          <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/40 dark:to-rose-800/40 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-rose-200 dark:border-rose-700/50">
            <HiXCircle className="w-7 h-7 text-rose-600 dark:text-rose-400 drop-shadow-sm group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-4xl font-black text-rose-600 dark:text-rose-400 tracking-tight drop-shadow-sm">
            {overall.totalWrong || 0}
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-2">Wrong Answers</p>
        </div>

        <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-6 text-center shadow-lg shadow-purple-500/5 group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 blur-2xl rounded-full"></div>
           <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-purple-200 dark:border-purple-700/50">
            <HiTrendingUp className="w-7 h-7 text-purple-600 dark:text-purple-400 drop-shadow-sm group-hover:scale-110 transition-transform" />
          </div>
          <p
            className={`text-4xl font-black tracking-tight drop-shadow-sm ${
              accuracy >= 70
                ? "text-emerald-500"
                : accuracy >= 50
                ? "text-amber-500"
                : "text-rose-500"
            }`}
          >
            {accuracy}%
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-2">Accuracy</p>
        </div>
      </div>

      {/* Accuracy Gauge & Tabs Row */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        {/* Accuracy Gauge */}
        <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-6 shadow-xl shadow-gray-500/5 lg:w-1/3 flex flex-col items-center justify-center">
          <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6 text-center w-full">
            Hit Rate Accuracy
          </h2>
          <div className="relative w-40 h-40 flex-shrink-0 group">
            <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full group-hover:bg-indigo-500/10 transition-all duration-500"></div>
            <svg
              className="relative z-10 w-40 h-40 transform -rotate-90 drop-shadow-md"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                className="text-gray-100 dark:text-gray-700/50"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke={
                  accuracy >= 70
                    ? "#10b981"
                    : accuracy >= 50
                    ? "#f59e0b"
                    : "#f43f5e"
                }
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(accuracy / 100) * 314} 314`}
                className="transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 6px ${accuracy >= 70 ? 'rgba(16,185,129,0.4)' : accuracy >= 50 ? 'rgba(245,158,11,0.4)' : 'rgba(244,63,94,0.4)'})` }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                {accuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Info Tabs Area */}
        <div className="lg:w-2/3 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-6 p-2 bg-slate-100/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
            {[
              { id: "subjects", label: "Subject-wise", icon: HiBookmark },
              { id: "chapters", label: "Chapter-wise", icon: HiLightningBolt },
              { id: "activity", label: "Daily Activity", icon: HiClock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-black tracking-widest transition-all duration-300 uppercase ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Subject-wise Stats */}
          {activeTab === "subjects" && (
            <div className="space-y-4">
              {stats?.subjectWise?.length > 0 ? (
                stats.subjectWise.map((s) => (
                  <div
                    key={s._id}
                    className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center shadow-inner border border-indigo-100 dark:border-indigo-800/50 text-2xl group-hover:scale-110 transition-transform">
                         {s.subjectIcon || "📚"}
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight">
                          {s.subjectName}
                        </p>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1">
                          {s.attempted} of {s.totalQuestions || "?"} Questions Checked
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 sm:w-1/3">
                      <div className="text-right flex-1">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                          {s.correct}/{s.attempted} Hit
                        </p>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden shadow-inner flex">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              s.accuracy >= 70
                                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                : s.accuracy >= 50
                                ? "bg-gradient-to-r from-amber-400 to-amber-500"
                                : "bg-gradient-to-r from-rose-400 to-rose-500"
                            }`}
                            style={{ width: `${s.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-right">
                         <span
                            className={`text-lg font-black tracking-tighter ${
                              s.accuracy >= 70
                                ? "text-emerald-500"
                                : s.accuracy >= 50
                                ? "text-amber-500"
                                : "text-rose-500"
                            }`}
                          >
                            {s.accuracy}%
                          </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 p-8 bg-white/40 dark:bg-gray-800/40 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">📊</div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No subject data yet. Engage with content to track progress.</p>
                </div>
              )}
            </div>
          )}

          {/* Chapter-wise Stats */}
          {activeTab === "chapters" && (
            <div className="space-y-3">
              {stats?.chapterWise?.length > 0 ? (
                stats.chapterWise.map((c) => (
                  <div
                    key={c._id}
                    className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/40 dark:to-cyan-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-sm font-black border border-indigo-200 dark:border-indigo-700/50 shadow-inner group-hover:scale-110 transition-transform">
                        {c.chapterNumber}
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base tracking-tight leading-tight">
                          {c.chapterName}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1">
                          {c.attempted} Tries • {c.correct} Hits
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 ml-4 shrink-0">
                       <span
                        className={`text-sm font-black tracking-tight ${
                          c.accuracy >= 70
                            ? "text-emerald-500"
                            : c.accuracy >= 50
                            ? "text-amber-500"
                            : "text-rose-500"
                        }`}
                      >
                        {c.accuracy}%
                      </span>
                      <div className="w-20 sm:w-24 h-1.5 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            c.accuracy >= 70
                              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                              : c.accuracy >= 50
                              ? "bg-gradient-to-r from-amber-400 to-amber-500"
                              : "bg-gradient-to-r from-rose-400 to-rose-500"
                          }`}
                          style={{ width: `${c.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 p-8 bg-white/40 dark:bg-gray-800/40 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">📖</div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No chapter data materialized yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Daily Activity */}
          {activeTab === "activity" && (
            <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-500/5">
              <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">
                Last 30 Days Output
              </h3>
              {stats?.dailyActivity?.length > 0 ? (
                <div className="space-y-4">
                  {stats.dailyActivity.map((day) => (
                    <div
                      key={day._id}
                      className="flex items-center gap-4 py-3 border-b last:border-0 border-gray-100 dark:border-gray-700/50 group"
                    >
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-20 shrink-0 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded text-center">
                        {new Date(day._id).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                (day.count /
                                  Math.max(
                                    ...stats.dailyActivity.map((d) => d.count),
                                    1 // fallback
                                  )) *
                                  100,
                                100
                              )}%`,
                              minWidth: "12px",
                            }}
                          ></div>
                          <div className="flex flex-col">
                             <span className="text-sm font-extrabold text-gray-700 dark:text-gray-300 leading-none">
                                {day.count} Qs
                             </span>
                             <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1">
                                {day.correct} Hit
                             </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">📅</div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No recent daily activity. Your log is blank.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
