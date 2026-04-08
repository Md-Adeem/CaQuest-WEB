import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSubjects } from '../hooks/useSubjects';
import SubjectList from '../components/SubjectList';
import { CardGridShimmer } from '../../../shared/components/Shimmer';
import { LEVELS } from '../../../shared/utils/constants';
import { HiArrowLeft } from 'react-icons/hi';

const SubjectsPage = () => {
  const { level } = useParams();
  const { subjects, loading } = useSubjects(level);
  const levelInfo = LEVELS[level];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800/50"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Premium Hero Header */}
      <div className="mb-10 relative overflow-hidden rounded-3xl p-8 lg:p-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-[#0b0f19] dark:via-[#111827] dark:to-[#0f172a] border border-white/60 dark:border-white/5 shadow-xl shadow-indigo-500/10 dark:shadow-cyan-900/20">
        <div className="absolute w-72 h-72 -top-24 -right-12 bg-gradient-to-br from-cyan-400/30 to-indigo-400/10 dark:from-cyan-600/20 dark:to-indigo-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>
        <div className="absolute w-96 h-96 -bottom-32 -left-20 bg-gradient-to-tr from-indigo-300/30 to-fuchsia-300/10 dark:from-indigo-800/20 dark:to-fuchsia-900/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 dark:border-gray-700/50">
            <span className="text-5xl drop-shadow-md">{levelInfo?.icon || '📚'}</span>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-cyan-600 dark:from-indigo-300 dark:to-cyan-200 tracking-tight mb-2">
              {levelInfo?.name || 'Curriculum'}
            </h1>
            <p className="text-lg text-indigo-900/70 dark:text-slate-400 font-medium max-w-2xl">
              Master your syllabus. Select a subject below to dive into topics, practice questions, and unlimited mock tests.
            </p>
          </div>
        </div>
      </div>

      {/* Subject Grid */}
      {loading ? (
        <CardGridShimmer count={6} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      ) : (
        <SubjectList subjects={subjects} />
      )}
    </div>
  );
};

export default SubjectsPage;