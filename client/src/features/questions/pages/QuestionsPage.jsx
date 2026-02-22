import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuestions } from "../hooks/useQuestions";
import QuestionList from "../components/QuestionList";
import QuestionFilter from "../components/QuestionFilter";
import SubscriptionGate from "../components/SubscriptionGate";
import Loader from "../../../shared/components/Loader";
import { HiArrowLeft } from "react-icons/hi";

const QuestionsPage = () => {
  const { chapterId } = useParams();
  const {
    questions,
    loading,
    hasAccess,
    accessInfo,
    pagination,
    fetchQuestions,
  } = useQuestions(chapterId);
  const [difficulty, setDifficulty] = useState(null);

  const handleFilterChange = (diff) => {
    setDifficulty(diff);
    fetchQuestions({ difficulty: diff });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Loader size="lg" text="Loading questions..." />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to={-1}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <SubscriptionGate level={accessInfo?.level} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to Chapters
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Practice Questions
          </h1>
          <p className="text-gray-500 mt-1">
            Test your knowledge with these chapter-wise questions
          </p>
        </div>

        {/* QUIZ BUTTON */}
        {accessInfo?.subjectType === "MCQ" && (
          <Link to={`/quiz/${chapterId}`} className="btn-primary">
            Start Quiz
          </Link>
        )}
      </div>

      {/* Filter */}
      <QuestionFilter
        selectedDifficulty={difficulty}
        onFilterChange={handleFilterChange}
        total={pagination.total}
      />

      {/* Questions */}
      <QuestionList questions={questions} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => fetchQuestions({ page: i + 1, difficulty })}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                pagination.currentPage === i + 1
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
