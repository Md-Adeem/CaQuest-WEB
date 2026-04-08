import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChevronRight, HiBookOpen, HiQuestionMarkCircle } from 'react-icons/hi';

const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/chapters/${subject._id}`)}
      className="relative overflow-hidden cursor-pointer group bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700/60 rounded-3xl p-6 hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* Subtle hover gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 dark:from-indigo-400/5 dark:to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm border border-indigo-100 dark:border-indigo-800/50">
            <span className="text-3xl drop-shadow-sm">{subject.icon || '📚'}</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 inline-block">
              {subject.code}
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {subject.name}
            </h3>
          </div>
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
          <HiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
        </div>
      </div>

      <div className="relative z-10 flex-grow">
        {subject.description && (
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {subject.description}
          </p>
        )}
      </div>

      <div className="relative z-10 flex items-center gap-4 mt-6 pt-5 border-t border-gray-100 dark:border-gray-700/80">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
          <HiBookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span>{subject.totalChapters} Chaps</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
          <HiQuestionMarkCircle className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          <span>{subject.totalQuestions} Qs</span>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;