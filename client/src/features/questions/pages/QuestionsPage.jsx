import React, { useState, useEffect } from "react";
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
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 mb-6"
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
      {/* Premium Hero Header Group */}
      <div className="mb-8">
        {/* Breadcrumb & Header Box */}
        <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-[#0b0f19] border border-slate-700/60 shadow-2xl shadow-indigo-900/20 mb-6">
          <div className="absolute w-72 h-72 -top-20 -right-12 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white mb-6 uppercase tracking-widest transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5"
            >
              <HiArrowLeft className="w-4 h-4" />
              Return to Chapters
            </button>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                  {accessInfo?.chapterName || "Practice Questions"}
                </h1>
                <p className="text-sm font-medium text-slate-400 max-w-2xl leading-relaxed">
                  Test your mastery. Work through these structured chapter-wise challenges.
                </p>
              </div>

              {/* QUIZ BUTTON */}
              {accessInfo?.subjectType === "MCQ" && (
                <Link 
                  to={`/quiz/${chapterId}`} 
                  className="inline-flex shrink-0 items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                >
                  Start Native Quiz
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Paper Type Filter - Glassmorphic Pill Bar */}
        <div className="flex flex-wrap items-center gap-3 p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700/60 shadow-sm">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-3">
            Filter:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePaperTypeChange("")}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                !paperType
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => handlePaperTypeChange("RTP")}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                paperType === "RTP"
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              RTP
            </button>
            <button
              onClick={() => handlePaperTypeChange("MTP")}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                paperType === "MTP"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              MTP
            </button>
            <button
              onClick={() => handlePaperTypeChange("PYQS")}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                paperType === "PYQS"
                  ? "bg-purple-500 text-white shadow-md shadow-purple-500/30"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              PYQS
            </button>
            <button
              onClick={() => handlePaperTypeChange("Practice")}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                paperType === "Practice"
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              PRACTICE
            </button>
          </div>
        </div>
      </div>

      {/* Questions */}
      <QuestionList questions={questions} currentPage={pagination.currentPage} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                fetchQuestions({
                  page: i + 1,
                  paperType: paperType || undefined,
                });
              }}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                pagination.currentPage === i + 1
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200"
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
