import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChevronRight, HiQuestionMarkCircle } from 'react-icons/hi';

const ChapterCard = ({ chapter, index }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/questions/${chapter._id}`)}
      className="card cursor-pointer group hover:scale-[1.01] transition-all duration-200 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
          {chapter.chapterNumber || index + 1}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
            {chapter.name}
          </h3>
          {chapter.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              {chapter.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <HiQuestionMarkCircle className="w-4 h-4" />
          <span>{chapter.totalQuestions}</span>
        </div>
        <HiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
      </div>
    </div>
  );
};

export default ChapterCard;