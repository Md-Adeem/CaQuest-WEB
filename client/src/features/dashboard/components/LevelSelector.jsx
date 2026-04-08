import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi';

const LEVELS = {
  foundation: {
    id: 'foundation',
    name: 'CA Foundation',
    description: 'Entry-level course for CA aspirants',
    icon: '🎯',
    activeGradient: 'bg-gradient-to-br from-sky-400/10 to-blue-600/10 dark:from-sky-500/20 dark:to-blue-600/10',
    borderGlow: 'ring-2 ring-sky-500 shadow-xl shadow-sky-500/20 border-transparent',
  },
  intermediate: {
    id: 'intermediate',
    name: 'CA Intermediate',
    description: 'Intermediate level for advanced preparation',
    icon: '📈',
    activeGradient: 'bg-gradient-to-br from-purple-400/10 to-fuchsia-600/10 dark:from-purple-500/20 dark:to-fuchsia-600/10',
    borderGlow: 'ring-2 ring-purple-500 shadow-xl shadow-purple-500/20 border-transparent',
  },
  final: {
    id: 'final',
    name: 'CA Final',
    description: 'Final level for comprehensive mastery',
    icon: '🏆',
    activeGradient: 'bg-gradient-to-br from-amber-400/10 to-orange-600/10 dark:from-amber-500/20 dark:to-orange-600/10',
    borderGlow: 'ring-2 ring-amber-500 shadow-xl shadow-amber-500/20 border-transparent',
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Choose Your Level
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Select your CA exam level to access relevant subjects and chapters
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(LEVELS).map((level) => (
          <button
            key={level.id}
            onClick={() => handleSelect(level.id)}
            className={`relative rounded-3xl p-8 text-left group overflow-hidden transition-all duration-300 transform hover:-translate-y-1 ${
              selectedLevel === level.id
                ? `${level.activeGradient} ${level.borderGlow}`
                : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-none hover:bg-white dark:hover:bg-gray-800'
            }`}
          >
            {/* Subtle light effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <div className="text-5xl mb-5 transform group-hover:scale-110 transition-transform duration-300 origin-bottom-left">{level.icon}</div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              {level.name}
            </h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">{level.description}</p>
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