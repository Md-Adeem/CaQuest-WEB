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
} from "react-icons/hi";

const QuizPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [stage, setStage] = useState("setup"); // setup, quiz, results
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

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
        limit: settings.numberOfQuestions,
      };
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
        <div className="card">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📝</div>
            <h1 className="text-3xl font-bold text-gray-900">Quiz Mode</h1>
            <p className="text-gray-500 mt-2">
              Test yourself with a timed quiz
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <div className="flex gap-3">
                {[5, 10, 15, 20, 30].map((num) => (
                  <button
                    key={num}
                    onClick={() =>
                      setSettings({ ...settings, numberOfQuestions: num })
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      settings.numberOfQuestions === num
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time per Question (seconds)
              </label>
              <div className="flex gap-3">
                {[30, 45, 60, 90, 120].map((time) => (
                  <button
                    key={time}
                    onClick={() =>
                      setSettings({ ...settings, timePerQuestion: time })
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      settings.timePerQuestion === time
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {time}s
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
              <p>
                <strong>Total Time:</strong>{" "}
                {formatTime(
                  settings.timePerQuestion * settings.numberOfQuestions
                )}
              </p>
              <p>
                <strong>Questions:</strong> {settings.numberOfQuestions}
              </p>
            </div>

            <button
              onClick={startQuiz}
              disabled={loading}
              className="btn-primary w-full py-4 text-lg"
            >
              {loading ? "Loading..." : "Start Quiz 🚀"}
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-500">
              Question {currentIndex + 1} / {questions.length}
            </span>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${
              timeLeft < 60
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <HiClock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question */}
        <div className="card mb-6">
          <p className="text-lg font-medium text-gray-900 mb-6">
            {currentQuestion.questionText}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, optIndex) => (
              <button
                key={optIndex}
                onClick={() => handleAnswer(currentQuestion._id, optIndex)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestion._id] === optIndex
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-primary-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      answers[currentQuestion._id] === optIndex
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-500"
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

          <div className="flex gap-2">
            {/* Question dots */}
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  i === currentIndex
                    ? "bg-primary-600 text-white"
                    : answers[q._id] !== undefined
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
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
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <HiXCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-600">{results.wrong}</p>
              <p className="text-xs text-gray-500">Wrong</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="w-6 h-6 rounded-full border-2 border-gray-400 mx-auto mb-1"></div>
              <p className="text-2xl font-bold text-gray-600">
                {results.unanswered}
              </p>
              <p className="text-xs text-gray-500">Skipped</p>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Review Answers</h2>
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
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      Skipped
                    </span>
                  ) : isCorrect ? (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      Correct ✓
                    </span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      Wrong ✗
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-900 mb-3">
                  {q.questionText}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        i === q.correctAnswer
                          ? "bg-green-100 text-green-700 font-medium"
                          : i === userAnswer && i !== q.correctAnswer
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}: {opt}
                      {i === q.correctAnswer && " ✓"}
                      {i === userAnswer && i !== q.correctAnswer && " ✗"}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-semibold text-blue-700 mb-1">
                      Explanation:
                    </p>
                    <p className="text-xs text-blue-600">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default QuizPage;
