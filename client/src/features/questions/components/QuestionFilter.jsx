import React from 'react';
import { DIFFICULTY_LEVELS } from '../../../shared/utils/constants';

const QuestionFilter = ({ selectedDifficulty, onFilterChange, total }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-700">{total}</span> questions
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Filter:</span>
        <button
          onClick={() => onFilterChange(null)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            !selectedDifficulty
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {DIFFICULTY_LEVELS.map((diff) => (
          <button
            key={diff.id}
            onClick={() => onFilterChange(diff.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedDifficulty === diff.id
                ? diff.color
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {diff.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionFilter;