import React, { useState, useEffect } from "react";
import Badge from "../../../shared/components/Badge";
import { HiBookmark } from "react-icons/hi";
import progressService from "../../progress/services/progressService";
import toast from "react-hot-toast";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";

const QuestionCard = ({ question, index }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Check if question is bookmarked
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const response = await progressService.checkSingleBookmark(
          question._id
        );
        setIsBookmarked(response.data.data.isBookmarked);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    if (question._id) {
      checkBookmarkStatus();
    }
  }, [question._id]);

  const handleBookmarkToggle = async () => {
    setBookmarkLoading(true);
    try {
      const response = await progressService.toggleBookmark(question._id);
      setIsBookmarked(response.data.bookmarked);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
      // Revert the UI state on error
      setIsBookmarked(!isBookmarked);
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Render markdown/HTML content using the MDEditor preview
  const renderMarkdown = (text) => {
    if (!text) return null;
    return (
      <div>
        <MDEditor.Markdown
          source={text}
          rehypePlugins={[[rehypeSanitize]]}
          style={{ background: 'transparent', fontSize: '0.95rem' }}
        />
      </div>
    );
  };

  /* =====================================================
     SUBJECTIVE QUESTION SUPPORT
  ====================================================== */
  // Function to get paper type badge color
  const getPaperTypeColor = (paperType) => {
    switch (paperType) {
      case "RTP":
        return "bg-blue-100 text-blue-800";
      case "MTP":
        return "bg-green-100 text-green-800";
      case "PYQS":
        return "bg-purple-100 text-purple-800";
      case "Practice":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100";
    }
  };

  if (question.type === "SUBJECTIVE") {
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
            {question.paperType && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${getPaperTypeColor(
                  question.paperType
                )}`}
              >
                {question.paperType}
              </span>
            )}
          </div>
          <button
            onClick={handleBookmarkToggle}
            disabled={bookmarkLoading}
            className={`p-2 rounded-lg transition-colors ${
              bookmarkLoading
                ? "text-gray-300 cursor-not-allowed"
                : isBookmarked
                ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
          >
            <HiBookmark
              className={`w-5 h-5 ${bookmarkLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Question Text */}
        <div className="text-gray-900 dark:text-white font-medium mb-5 leading-relaxed">
          {renderMarkdown(question.questionText)}
        </div>

        {/* Model Answer with Toggle */}
        {question.modelAnswer && (
          <div className="mt-4">
            <button
              onClick={async () => {
                const newShowAnswer = !showAnswer;
                setShowAnswer(newShowAnswer);

                // Save progress when user views the answer
                if (newShowAnswer) {
                  try {
                    await progressService.saveAttempt({
                      questionId: question._id,
                      isCorrect: true, // Consider viewing answer as "completed"
                      chapter: question.chapter,
                      subject: question.subject,
                      level: question.level,
                      mode: "practice",
                    });
                  } catch (error) {
                    console.error("Error saving progress:", error);
                  }
                }
              }}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-2"
            >
              {showAnswer ? "Hide" : "Show"} Answer
              <svg
                className={`w-4 h-4 transition-transform ${
                  showAnswer ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showAnswer && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  Answer:
                </p>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  {renderMarkdown(question.modelAnswer)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  /* =====================================================
     MCQ QUESTION LOGIC
  ====================================================== */

  const handleOptionSelect = async (optionIndex) => {
    if (showAnswer) return;
    setSelectedOption(optionIndex);
    setShowAnswer(true);

    // Save progress
    const isCorrect = optionIndex === question.correctAnswer;
    try {
      await progressService.saveAttempt({
        questionId: question._id,
        selectedAnswer: optionIndex,
        isCorrect,
        chapter: question.chapter,
        subject: question.subject,
        level: question.level,
        mode: "practice",
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const getOptionClass = (optionIndex) => {
    if (!showAnswer) {
      return selectedOption === optionIndex
        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-300"
        : "border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/20";
    }

    if (optionIndex === question.correctAnswer) {
      return "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-300";
    }
    if (
      optionIndex === selectedOption &&
      optionIndex !== question.correctAnswer
    ) {
      return "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-300";
    }
    return "border-gray-200 dark:border-gray-700 opacity-60";
  };

  return (
    <div className="card animate-fade-in">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400">Q{index + 1}</span>
          <Badge variant="primary" size="sm">
            MCQ
          </Badge>
          {question.paperType && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${getPaperTypeColor(
                question.paperType
              )}`}
            >
              {question.paperType}
            </span>
          )}
        </div>
        <button
          onClick={handleBookmarkToggle}
          disabled={bookmarkLoading}
          className={`p-2 rounded-lg transition-colors ${
            bookmarkLoading
              ? "text-gray-300 cursor-not-allowed"
              : isBookmarked
              ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
              : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
          }`}
          title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
        >
          <HiBookmark
            className={`w-5 h-5 ${bookmarkLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Question Text */}
      <div className="text-gray-900 dark:text-white font-medium mb-5 leading-relaxed">
        {renderMarkdown(question.questionText)}
      </div>

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
                  showAnswer && optionIndex === question.correctAnswer
                    ? "bg-green-500 text-white dark:bg-green-600 dark:text-gray-100"
                    : showAnswer &&
                      optionIndex === selectedOption &&
                      optionIndex !== question.correctAnswer
                    ? "bg-red-500 text-white dark:bg-red-600 dark:text-gray-100"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                {String.fromCharCode(65 + optionIndex)}
              </div>
              <span className="text-gray-700 dark:text-gray-200">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showAnswer && question.explanation && (
        <div className="mt-5 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
            Explanation:
          </p>
          <div className="text-sm text-blue-600 dark:text-blue-400">{renderMarkdown(question.explanation)}</div>
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
