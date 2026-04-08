import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChevronRight, HiQuestionMarkCircle } from 'react-icons/hi';

const ChapterCard = ({ chapter, index }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/questions/${chapter._id}`)}
      className="relative overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700/60 rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer group hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-x-1 transition-all duration-300"
    >
      {/* Decorative vertical color bar appears on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex items-center gap-4 sm:gap-5 pl-1 sm:pl-2">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/40 dark:to-cyan-900/20 text-indigo-700 dark:text-cyan-400 flex items-center justify-center font-black text-lg border border-indigo-100 dark:border-indigo-800/50 shadow-inner group-hover:scale-110 transition-transform duration-300">
          {chapter.chapterNumber || index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate mb-1">
            {chapter.name}
          </h3>
          {chapter.description && (
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate max-w-md">
              {chapter.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-4">
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/40 px-2.5 py-1.5 rounded-lg border border-cyan-100 dark:border-cyan-800/50 uppercase tracking-widest">
          <HiQuestionMarkCircle className="w-4 h-4 text-cyan-500" />
          <span>{chapter.totalQuestions} Qs</span>
        </div>
        
        {/* Mobile only fallback */}
        <div className="sm:hidden flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
           {chapter.totalQuestions}
        </div>

        <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 transition-colors">
          <HiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;