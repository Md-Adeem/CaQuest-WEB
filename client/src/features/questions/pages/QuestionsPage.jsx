import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuestions } from "../hooks/useQuestions";
import QuestionList from "../components/QuestionList";
import SubscriptionGate from "../components/SubscriptionGate";
import { QuestionListShimmer } from '../../../shared/components/Shimmer';
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
  const [paperType, setPaperType] = useState("");

  const handlePaperTypeChange = (type) => {
    setPaperType(type);
    fetchQuestions({ paperType: type || undefined });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <QuestionListShimmer count={5} />
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
            {accessInfo?.chapterName || "Practice Questions"}
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

      {/* Paper Type Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700 mr-2">
          Filter by:
        </span>
        <button
          onClick={() => handlePaperTypeChange("")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            !paperType
              ? "bg-primary-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handlePaperTypeChange("RTP")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            paperType === "RTP"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          RTP
        </button>
        <button
          onClick={() => handlePaperTypeChange("MTP")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            paperType === "MTP"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          MTP
        </button>
        <button
          onClick={() => handlePaperTypeChange("PYQS")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            paperType === "PYQS"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          PYQS
        </button>
        <button
          onClick={() => handlePaperTypeChange("Practice")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            paperType === "Practice"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Practice
        </button>
      </div>

      {/* Questions */}
      <QuestionList questions={questions} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() =>
                fetchQuestions({
                  page: i + 1,
                  paperType: paperType || undefined,
                })
              }
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
