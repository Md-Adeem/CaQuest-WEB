import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChevronRight, HiBookOpen, HiQuestionMarkCircle } from 'react-icons/hi';

const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/chapters/${subject._id}`)}
      className="card cursor-pointer group hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{subject.icon || '📚'}</div>
          <div>
            <span className="text-xs font-mono text-gray-400 uppercase">
              {subject.code}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{subject.name}</h3>
          </div>
        </div>
        <HiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
      </div>

      {subject.description && (
        <p className="text-sm text-gray-500 mt-3 line-clamp-2">
          {subject.description}
        </p>
      )}

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <HiBookOpen className="w-4 h-4" />
          <span>{subject.totalChapters} Chapters</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <HiQuestionMarkCircle className="w-4 h-4" />
          <span>{subject.totalQuestions} Questions</span>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;