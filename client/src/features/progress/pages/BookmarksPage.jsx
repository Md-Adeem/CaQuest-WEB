import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import progressService from "../services/progressService";
import { QuestionListShimmer } from "../../../shared/components/Shimmer";
import Badge from "../../../shared/components/Badge";
import EmptyState from "../../../shared/components/EmptyState";
import { LEVELS } from "../../../shared/utils/constants";
import { formatDate } from "../../../shared/utils/helpers";
import { HiBookmark, HiTrash, HiArrowRight } from "react-icons/hi";
import toast from "react-hot-toast";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [showAnswers, setShowAnswers] = useState({});

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedLevel) params.level = selectedLevel;
      params.limit = 50;

      const response = await progressService.getBookmarks(params);
      setBookmarks(response.data.data);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  }, [selectedLevel]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleRemoveBookmark = async (questionId) => {
    try {
      await progressService.toggleBookmark(questionId);
      setBookmarks((prev) => prev.filter((b) => b.question._id !== questionId));
      toast.success("Bookmark removed");
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  const toggleAnswer = (id) => {
    setShowAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Premium Header */}
      <div className="relative text-center mb-14">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-48 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full"></div>
        <div className="inline-flex items-center justify-center p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl mb-4 shadow-xl border border-gray-200/50 dark:border-gray-700/50 relative z-10 group">
          <HiBookmark className="text-4xl text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform duration-500" />
        </div>
        <h1 className="relative z-10 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-800 dark:from-indigo-300 dark:to-cyan-200 tracking-tight leading-tight mb-4">
          Saved Intel Library
        </h1>
        <p className="relative z-10 text-lg sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium mb-4">
          Curated collection of challenging queries. Review, master, and progress.
        </p>
        <div className="relative z-10 inline-block">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
            {bookmarks.length} Datapoints Indexed
          </span>
        </div>
      </div>

      {/* Level Filter - Frosted Glass */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 p-2 bg-slate-100/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700/60 w-fit mx-auto shadow-sm relative z-10">
        <button
          onClick={() => setSelectedLevel("")}
          className={`px-6 py-2.5 rounded-xl text-[13px] font-black tracking-widest transition-all duration-300 uppercase ${
            !selectedLevel
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
          }`}
        >
          Global Archive
        </button>
        {Object.values(LEVELS).map((level) => (
          <button
            key={level.id}
            onClick={() => setSelectedLevel(level.id)}
            className={`px-6 py-2.5 rounded-xl text-[13px] font-black tracking-widest transition-all duration-300 uppercase flex items-center gap-2 ${
              selectedLevel === level.id
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <span>{level.icon}</span> {level.name}
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      {loading ? (
        <QuestionListShimmer count={4} />
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon="🔖"
          title="No Bookmarks Yet"
          description="Bookmark questions while practicing to review them later."
          action={
            <Link to="/dashboard" className="btn-primary text-sm">
              Start Practicing
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => {
            const q = bookmark.question;
            if (!q) return null;

            return (
              <div key={bookmark._id} className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-6 shadow-xl shadow-indigo-500/5 transition-all hover:shadow-2xl">
                {/* Meta */}
                <div className="flex items-center justify-between mb-5 border-b border-gray-100 dark:border-gray-700/60 pb-3">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                    <span className="text-sm">{bookmark.subject?.icon}</span>
                    <span>{bookmark.subject?.name}</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800/50">
                      Ch {bookmark.chapter?.chapterNumber}:{" "}
                      {bookmark.chapter?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveBookmark(q._id)}
                      className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-800/50"
                      title="Purge from Archive"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <div className="font-medium text-gray-900 dark:text-white mb-3">
                  <MDEditor.Markdown
                    source={q.questionText}
                    rehypePlugins={[[rehypeSanitize]]}
                    style={{ background: 'transparent' }}
                  />
                </div>

                {/* Question Type Badge and Content */}
                <div className="mb-3">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <Badge
                      variant={
                        q.type === "SUBJECTIVE" ? "secondary" : "primary"
                      }
                      size="sm"
                    >
                      {q.type === "SUBJECTIVE" ? "Subjective" : "MCQ"}
                    </Badge>
                    {q.paperType && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          q.paperType === "RTP"
                            ? "bg-blue-100 text-blue-800"
                            : q.paperType === "MTP"
                            ? "bg-green-100 text-green-800"
                            : q.paperType === "PYQS"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {q.paperType}
                      </span>
                    )}
                  </div>

                  {/* Options for MCQ */}
                  {q.type === "MCQ" && q.options?.length > 0 && (
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`px-3 py-2 rounded-lg text-sm ${
                            showAnswers[bookmark._id] && i === q.correctAnswer
                              ? "bg-green-100 text-green-700 font-medium"
                              : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {String.fromCharCode(65 + i)}: {opt}
                          {showAnswers[bookmark._id] &&
                            i === q.correctAnswer &&
                            " ✓"}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Model Answer for Subjective */}
                  {q.type === "SUBJECTIVE" && q.modelAnswer && (
                    <div className="mt-2">
                      {showAnswers[bookmark._id] ? (
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Model Answer:
                          </p>
                          <div className="prose prose-sm max-w-none">
                            <MDEditor.Markdown
                              source={q.modelAnswer}
                              rehypePlugins={[[rehypeSanitize]]}
                              style={{ background: 'transparent' }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Model answer available - click "Show Answer" to view
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-700/60 mt-4 gap-4">
                  <button
                    onClick={() => toggleAnswer(bookmark._id)}
                    className="px-5 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 rounded-xl shadow-sm"
                  >
                    {showAnswers[bookmark._id] ? "Conceal Data" : "Extract Data"}
                  </button>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Logged {formatDate(bookmark.createdAt)}
                    </span>
                    <Link
                      to={`/questions/${bookmark.chapter?._id}`}
                      className="inline-flex flex-row items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      Vector to Chapter <HiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Explanation */}
                {showAnswers[bookmark._id] && q.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      {q.type === "SUBJECTIVE"
                        ? "Additional Notes:"
                        : "Explanation:"}
                    </p>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      <MDEditor.Markdown
                        source={q.explanation}
                        rehypePlugins={[[rehypeSanitize]]}
                        style={{ background: 'transparent', fontSize: '0.75rem' }}
                      />
                    </div>
                  </div>
                )}

                {/* User Note */}
                {bookmark.note && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                    <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">
                      Your Note:
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">{bookmark.note}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
