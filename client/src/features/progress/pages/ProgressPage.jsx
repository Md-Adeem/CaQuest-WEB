import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import progressService from '../services/progressService';
import Loader from '../../../shared/components/Loader';
import Badge from '../../../shared/components/Badge';
import { LEVELS } from '../../../shared/utils/constants';
import {
  HiCheckCircle, HiXCircle, HiClock,
  HiTrendingUp, HiChartBar, HiBookmark,
  HiLightningBolt, HiAcademicCap,
} from 'react-icons/hi';

const ProgressPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await progressService.getMyStats(selectedLevel);
        setStats(response.data.data);
      } catch (err) {
        console.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedLevel]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Loader size="lg" text="Loading your progress..." />
      </div>
    );
  }

  const overall = stats?.overall || {};
  const accuracy = overall.accuracy || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <HiChartBar className="w-8 h-8 text-primary-600" />
          My Progress
        </h1>
        <p className="text-gray-500 mt-1">
          Track your preparation journey and identify areas for improvement
        </p>
      </div>

      {/* Level Filter */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setSelectedLevel('')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            !selectedLevel
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Levels
        </button>
        {Object.values(LEVELS).map((level) => (
          <button
            key={level.id}
            onClick={() => setSelectedLevel(level.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedLevel === level.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {level.icon} {level.name}
          </button>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <HiAcademicCap className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {overall.totalAttempted || 0}
          </p>
          <p className="text-sm text-gray-500">Questions Attempted</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <HiCheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {overall.totalCorrect || 0}
          </p>
          <p className="text-sm text-gray-500">Correct Answers</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <HiXCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">
            {overall.totalWrong || 0}
          </p>
          <p className="text-sm text-gray-500">Wrong Answers</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <HiTrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <p
            className={`text-3xl font-bold ${
              accuracy >= 70
                ? 'text-green-600'
                : accuracy >= 50
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {accuracy}%
          </p>
          <p className="text-sm text-gray-500">Accuracy</p>
        </div>
      </div>

      {/* Accuracy Gauge */}
      <div className="card mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Overall Accuracy
        </h2>
        <div className="flex items-center gap-8">
          {/* Circular Progress */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke={
                  accuracy >= 70
                    ? '#22c55e'
                    : accuracy >= 50
                    ? '#eab308'
                    : '#ef4444'
                }
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(accuracy / 100) * 314} 314`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">
                {accuracy}%
              </span>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              By Difficulty
            </h3>
            <div className="space-y-3">
              {stats?.difficultyStats?.map((d) => (
                <div key={d._id} className="flex items-center gap-3">
                  <Badge
                    variant={
                      d._id === 'easy'
                        ? 'success'
                        : d._id === 'medium'
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {d._id}
                  </Badge>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {d.correct}/{d.attempted}
                      </span>
                      <span className="font-semibold">{d.accuracy}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          d.accuracy >= 70
                            ? 'bg-green-500'
                            : d.accuracy >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${d.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              {(!stats?.difficultyStats || stats.difficultyStats.length === 0) && (
                <p className="text-sm text-gray-500">
                  Start practicing to see difficulty breakdown
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'subjects', label: 'Subject-wise', icon: HiBookmark },
          { id: 'chapters', label: 'Chapter-wise', icon: HiLightningBolt },
          { id: 'activity', label: 'Daily Activity', icon: HiClock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Subject-wise Stats */}
      {activeTab === 'subjects' && (
        <div className="space-y-3">
          {stats?.subjectWise?.length > 0 ? (
            stats.subjectWise.map((s) => (
              <div
                key={s._id}
                className="card flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{s.subjectIcon || '📚'}</span>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {s.subjectName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {s.attempted} of {s.totalQuestions || '?'} questions
                      attempted
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {s.correct}/{s.attempted} correct
                    </p>
                  </div>
                  <div className="w-24">
                    <div className="flex justify-between text-sm mb-1">
                      <span
                        className={`font-bold ${
                          s.accuracy >= 70
                            ? 'text-green-600'
                            : s.accuracy >= 50
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {s.accuracy}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          s.accuracy >= 70
                            ? 'bg-green-500'
                            : s.accuracy >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${s.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">📊</div>
              No subject data yet. Start practicing to see your progress!
            </div>
          )}
        </div>
      )}

      {/* Chapter-wise Stats */}
      {activeTab === 'chapters' && (
        <div className="space-y-2">
          {stats?.chapterWise?.length > 0 ? (
            stats.chapterWise.map((c) => (
              <div
                key={c._id}
                className="card !py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                    {c.chapterNumber}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {c.chapterName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {c.attempted} attempted • {c.correct} correct
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        c.accuracy >= 70
                          ? 'bg-green-500'
                          : c.accuracy >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${c.accuracy}%` }}
                    ></div>
                  </div>
                  <span
                    className={`text-sm font-bold w-12 text-right ${
                      c.accuracy >= 70
                        ? 'text-green-600'
                        : c.accuracy >= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {c.accuracy}%
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">📖</div>
              No chapter data yet.
            </div>
          )}
        </div>
      )}

      {/* Daily Activity */}
      {activeTab === 'activity' && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Last 30 Days Activity
          </h3>
          {stats?.dailyActivity?.length > 0 ? (
            <div className="space-y-2">
              {stats.dailyActivity.map((day) => (
                <div
                  key={day._id}
                  className="flex items-center gap-4 py-2 border-b border-gray-50"
                >
                  <span className="text-sm text-gray-500 w-24 font-mono">
                    {new Date(day._id).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-6 bg-primary-200 rounded"
                        style={{
                          width: `${Math.min(
                            (day.count /
                              Math.max(
                                ...stats.dailyActivity.map((d) => d.count)
                              )) *
                              100,
                            100
                          )}%`,
                          minWidth: '20px',
                        }}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {day.count} questions
                      </span>
                      <span className="text-xs text-green-600">
                        ({day.correct} correct)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-3">📅</div>
              No recent activity. Start practicing today!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressPage;