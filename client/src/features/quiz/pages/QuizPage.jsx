import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../shared/utils/api";
import toast from "react-hot-toast";
import {
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiArrowRight,
  HiArrowLeft,
  HiFlag,
  HiSparkles,
} from "react-icons/hi";
import AiTutorModal from "../../ai/components/AiTutorModal";

const QuizPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [stage, setStage] = useState("setup"); // setup, quiz, results
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  // AI Modal States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [currentAiContext, setCurrentAiContext] = useState(null);

  // Quiz settings
  const [settings, setSettings] = useState({
    numberOfQuestions: 10,
    difficulty: "",
    timePerQuestion: 60, // seconds
  });

  // Timer
  useEffect(() => {
    if (stage !== "quiz" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  const startQuiz = async () => {
    try {
      setLoading(true);
      const params = {
        chapter: chapterId,
      };
      
      // Only append limit if it's a specific number
      if (settings.numberOfQuestions !== "All") {
        params.limit = settings.numberOfQuestions;
      }
      
      if (settings.difficulty) params.difficulty = settings.difficulty;

      const response = await api.get("/questions", { params });

      if (response.data.data.length === 0) {
        toast.error("No questions available for this selection");
        return;
      }

      setQuestions(response.data.data);
      setTimeLeft(settings.timePerQuestion * response.data.data.length);
      setStage("quiz");
    } catch (err) {
      if (err.response?.data?.requiresSubscription) {
        toast.error("Subscription required");
        navigate("/subscriptions");
      } else {
        toast.error("Failed to load questions");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleFinishQuiz = useCallback(() => {
    setStage("results");
  }, []);

  const calculateResults = () => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((q) => {
      if (answers[q._id] === undefined) {
        unanswered++;
      } else if (answers[q._id] === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const percentage = Math.round((correct / questions.length) * 100);

    return { correct, wrong, unanswered, total: questions.length, percentage };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // SETUP STAGE
  if (stage === "setup") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-500/10">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>

          <div className="text-center relative z-10 mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100 dark:border-indigo-800/50">
              <span className="text-4xl drop-shadow-sm">📝</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300 tracking-tight">
              Test Preparation
            </h1>
            <p className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400 mt-2">
              Optimize your practice session parameters
            </p>
          </div>

          <div className="space-y-8 relative z-10">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 ml-1 uppercase tracking-wider">
                Question Volume
              </label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {[5, 10, 15, 20, 30, "All"].map((num) => (
                  <button
                    key={num}
                    onClick={() =>
                      setSettings({ ...settings, numberOfQuestions: num })
                    }
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      settings.numberOfQuestions === num
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 -translate-y-0.5"
                        : "bg-gray-100/80 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border border-transparent dark:border-gray-700/50"
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 ml-1 uppercase tracking-wider">
                Exam Speed (Timer)
              </label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {[30, 45, 60, 90, 120].map((time) => (
                  <button
                    key={time}
                    onClick={() =>
                      setSettings({ ...settings, timePerQuestion: time })
                    }
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      settings.timePerQuestion === time
                        ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 -translate-y-0.5"
                        : "bg-gray-100/80 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border border-transparent dark:border-gray-700/50"
                    }`}
                  >
                    {time}s
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800/30 flex justify-between items-center">
              <div>
                 <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">Total Time</p>
                 <p className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                    {formatTime(
                        settings.timePerQuestion * settings.numberOfQuestions
                    )}
                 </p>
              </div>
              <div className="text-right">
                 <p className="text-xs font-bold text-cyan-500 dark:text-cyan-400 uppercase tracking-widest mb-1">Questions</p>
                 <p className="text-2xl font-black text-cyan-700 dark:text-cyan-300">
                    {settings.numberOfQuestions}
                 </p>
              </div>
            </div>

            <button
              onClick={startQuiz}
              disabled={loading}
              className="flex justify-center items-center gap-2 w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-lg font-black tracking-wide rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Commence Quiz"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ STAGE
  if (stage === "quiz") {
    const currentQuestion = questions[currentIndex];

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Premium Progress & Timer Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-700/60 shadow-lg shadow-indigo-500/5">
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                {Math.round(((currentIndex) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden shadow-inner flex border border-gray-200 dark:border-gray-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-mono text-xl font-black shadow-inner shrink-0 ${
              timeLeft < 60
                ? "bg-rose-50 border border-rose-200 text-rose-600 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400 animate-pulse"
                : "bg-gray-50 border border-gray-200 dark:bg-gray-900/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300"
            }`}
          >
            <HiClock className={`w-6 h-6 ${timeLeft < 60 ? 'animate-bounce' : ''}`} />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Container */}
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-xl">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-cyan-500"></div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-relaxed pl-2">
            {currentQuestion.questionText}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, optIndex) => (
              <button
                key={optIndex}
                onClick={() => handleAnswer(currentQuestion._id, optIndex)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestion._id] === optIndex
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-300"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      answers[currentQuestion._id] === optIndex
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {String.fromCharCode(65 + optIndex)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="btn-secondary flex items-center gap-2"
          >
            <HiArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex flex-wrap gap-2 justify-center my-4 md:my-0">
            {/* Question dots */}
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  i === currentIndex
                    ? "bg-primary-600 text-white"
                    : answers[q._id] !== undefined
                    ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleFinishQuiz}
              className="btn-success flex items-center gap-2"
            >
              <HiFlag className="w-4 h-4" />
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentIndex(
                  Math.min(questions.length - 1, currentIndex + 1)
                )
              }
              className="btn-primary flex items-center gap-2"
            >
              Next
              <HiArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // RESULTS STAGE
  if (stage === "results") {
    const results = calculateResults();

    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="card text-center mb-8">
          <div className="text-6xl mb-4">
            {results.percentage >= 80
              ? "🏆"
              : results.percentage >= 60
              ? "👍"
              : results.percentage >= 40
              ? "📚"
              : "💪"}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Complete!
          </h1>

          <div className="text-5xl font-extrabold my-6">
            <span
              className={
                results.percentage >= 80
                  ? "text-green-600"
                  : results.percentage >= 60
                  ? "text-blue-600"
                  : results.percentage >= 40
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            >
              {results.percentage}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
            <div className="bg-green-50 rounded-xl p-4">
              <HiCheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-600">
                {results.correct}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Correct</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <HiXCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-600">{results.wrong}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Wrong</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <div className="w-6 h-6 rounded-full border-2 border-gray-400 mx-auto mb-1"></div>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                {results.unanswered}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Skipped</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setStage("setup");
                setAnswers({});
                setCurrentIndex(0);
              }}
              className="btn-primary"
            >
              Try Again
            </button>
            <button onClick={() => navigate(-1)} className="btn-secondary">
              Back to Chapter
            </button>
          </div>
        </div>

        {/* Review Answers */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Review Answers</h2>
        <div className="space-y-4">
          {questions.map((q, index) => {
            const userAnswer = answers[q._id];
            const isCorrect = userAnswer === q.correctAnswer;
            const isUnanswered = userAnswer === undefined;

            return (
              <div
                key={q._id}
                className={`card border-l-4 ${
                  isUnanswered
                    ? "border-l-gray-400"
                    : isCorrect
                    ? "border-l-green-500"
                    : "border-l-red-500"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-sm font-bold text-gray-400">
                    Q{index + 1}
                  </span>
                  {isUnanswered ? (
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                      Skipped
                    </span>
                  ) : isCorrect ? (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                      Correct ✓
                    </span>
                  ) : (
                    <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
                      Wrong ✗
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-900 dark:text-white mb-3">
                  {q.questionText}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        i === q.correctAnswer
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium"
                          : i === userAnswer && i !== q.correctAnswer
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}: {opt}
                      {i === q.correctAnswer && " ✓"}
                      {i === userAnswer && i !== q.correctAnswer && " ✗"}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      Explanation:
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">{q.explanation}</p>
                  </div>
                )}
                
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      setCurrentAiContext({
                        questionText: q.questionText,
                        type: q.type,
                        options: q.options,
                        correctAnswerText: q.options && q.correctAnswer != null ? q.options[q.correctAnswer] : null,
                        explanation: q.explanation
                      });
                      setIsAiModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all"
                  >
                    <HiSparkles className="text-yellow-300 w-3.5 h-3.5" />
                    Ask AI Tutor
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <AiTutorModal 
          isOpen={isAiModalOpen} 
          onClose={() => setIsAiModalOpen(false)} 
          questionContext={currentAiContext}
        />
      </div>
    );
  }

  return null;
};

export default QuizPage;
