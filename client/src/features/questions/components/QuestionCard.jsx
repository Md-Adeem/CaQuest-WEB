import React, { useState } from 'react';
import Badge from '../../../shared/components/Badge';

const QuestionCard = ({ question, index }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  /* =====================================================
     ✅ SUBJECTIVE QUESTION SUPPORT (NEWLY ADDED)
  ====================================================== */
  if (question.type === 'SUBJECTIVE') {
    return (
      <div className="card animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-400">
              Q{index + 1}
            </span>
            <Badge variant="secondary" size="sm">
              Subjective
            </Badge>
          </div>
          <span className="text-xs text-gray-400">
            {question.marks} mark(s)
          </span>
        </div>

        {/* Question Text */}
        <p className="text-gray-900 font-medium mb-5 leading-relaxed">
          {question.questionText}
        </p>

        {/* Student Answer Box */}
        <textarea
          className="w-full border border-gray-300 p-3 rounded-lg mb-4"
          placeholder="Write your answer..."
        />

        {/* Model Answer */}
        {question.modelAnswer && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm font-semibold text-blue-700 mb-1">
              Model Answer:
            </p>
            <p className="text-sm text-blue-600">
              {question.modelAnswer}
            </p>
          </div>
        )}
      </div>
    );
  }

  /* =====================================================
     ✅ EXISTING MCQ LOGIC (UNCHANGED)
  ====================================================== */

  const handleOptionSelect = (optionIndex) => {
    if (showAnswer) return;
    setSelectedOption(optionIndex);
    setShowAnswer(true);
  };

  const getOptionClass = (optionIndex) => {
    if (!showAnswer) {
      return selectedOption === optionIndex
        ? 'border-primary-500 bg-primary-50'
        : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/50';
    }

    if (optionIndex === question.correctAnswer) {
      return 'border-green-500 bg-green-50';
    }
    if (
      optionIndex === selectedOption &&
      optionIndex !== question.correctAnswer
    ) {
      return 'border-red-500 bg-red-50';
    }
    return 'border-gray-200 opacity-60';
  };

  const difficultyVariant = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
  };

  return (
    <div className="card animate-fade-in">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400">
            Q{index + 1}
          </span>
          <Badge
            variant={difficultyVariant[question.difficulty]}
            size="sm"
          >
            {question.difficulty}
          </Badge>
        </div>
        <span className="text-xs text-gray-400">
          {question.marks} mark(s)
        </span>
      </div>

      {/* Question Text */}
      <p className="text-gray-900 font-medium mb-5 leading-relaxed">
        {question.questionText}
      </p>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, optionIndex) => (
          <button
            key={optionIndex}
            onClick={() => handleOptionSelect(optionIndex)}
            disabled={showAnswer}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${getOptionClass(
              optionIndex
            )}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  showAnswer &&
                  optionIndex === question.correctAnswer
                    ? 'bg-green-500 text-white'
                    : showAnswer &&
                      optionIndex === selectedOption &&
                      optionIndex !== question.correctAnswer
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {String.fromCharCode(65 + optionIndex)}
              </div>
              <span className="text-gray-700">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showAnswer && question.explanation && (
        <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm font-semibold text-blue-700 mb-1">
            Explanation:
          </p>
          <p className="text-sm text-blue-600">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Reset */}
      {showAnswer && (
        <button
          onClick={() => {
            setSelectedOption(null);
            setShowAnswer(false);
          }}
          className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default QuestionCard;
