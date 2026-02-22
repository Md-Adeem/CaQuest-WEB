import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi';

const LEVELS = {
  foundation: {
    id: 'foundation',
    name: 'CA Foundation',
    description: 'Entry-level course for CA aspirants',
    icon: '🎯',
    bgColor: 'bg-blue-50',
  },
  intermediate: {
    id: 'intermediate',
    name: 'CA Intermediate',
    description: 'Intermediate level for advanced preparation',
    icon: '📈',
    bgColor: 'bg-purple-50',
  },
  final: {
    id: 'final',
    name: 'CA Final',
    description: 'Final level for comprehensive mastery',
    icon: '🏆',
    bgColor: 'bg-amber-50',
  },
};

const LevelSelector = ({ selectedLevel, onSelectLevel }) => {
  const navigate = useNavigate();

  const handleSelect = async (levelId) => {
    if (onSelectLevel) {
      await onSelectLevel(levelId);
    }
    navigate(`/subjects/${levelId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Choose Your Level
      </h2>
      <p className="text-gray-500 mb-6">
        Select your CA exam level to access relevant subjects and chapters
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(LEVELS).map((level) => (
          <button
            key={level.id}
            onClick={() => handleSelect(level.id)}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-left group hover:shadow-md hover:scale-[1.02] transition-all duration-200 ${
              selectedLevel === level.id
                ? `ring-2 ring-blue-500 ${level.bgColor}`
                : ''
            }`}
          >
            <div className="text-4xl mb-4">{level.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {level.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{level.description}</p>
            <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
              View Subjects
              <HiChevronRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;