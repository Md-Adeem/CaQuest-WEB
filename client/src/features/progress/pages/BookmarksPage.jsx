import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import progressService from '../services/progressService';
import Loader from '../../../shared/components/Loader';
import Badge from '../../../shared/components/Badge';
import EmptyState from '../../../shared/components/EmptyState';
import { LEVELS } from '../../../shared/utils/constants';
import { formatDate } from '../../../shared/utils/helpers';
import { HiBookmark, HiTrash, HiArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showAnswers, setShowAnswers] = useState({});

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedLevel) params.level = selectedLevel;
      params.limit = 50;

      const response = await progressService.getBookmarks(params);
      setBookmarks(response.data.data);
    } catch (err) {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [selectedLevel]);

  const handleRemoveBookmark = async (questionId) => {
    try {
      await progressService.toggleBookmark(questionId);
      setBookmarks((prev) =>
        prev.filter((b) => b.question._id !== questionId)
      );
      toast.success('Bookmark removed');
    } catch (err) {
      toast.error('Failed to remove bookmark');
    }
  };

  const toggleAnswer = (id) => {
    setShowAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const difficultyVariant = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <HiBookmark className="w-8 h-8 text-primary-600" />
            My Bookmarks
          </h1>
          <p className="text-gray-500 mt-1">
            Questions you've saved for later review
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {bookmarks.length} bookmarked
        </span>
      </div>

      {/* Level Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedLevel('')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            !selectedLevel
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {Object.values(LEVELS).map((level) => (
          <button
            key={level.id}
            onClick={() => setSelectedLevel(level.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedLevel === level.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {level.icon} {level.name}
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      {loading ? (
        <Loader size="lg" text="Loading bookmarks..." />
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
              <div key={bookmark._id} className="card">
                {/* Meta */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{bookmark.subject?.icon}</span>
                    <span>{bookmark.subject?.name}</span>
                    <span>•</span>
                    <span>Ch {bookmark.chapter?.chapterNumber}: {bookmark.chapter?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={difficultyVariant[q.difficulty]}
                      size="sm"
                    >
                      {q.difficulty}
                    </Badge>
                    <button
                      onClick={() => handleRemoveBookmark(q._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Bookmark"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <p className="font-medium text-gray-900 mb-3">
                  {q.questionText}
                </p>

                {/* Options */}
                <div className="space-y-2 mb-3">
                  {q.options?.map((opt, i) => (
                    <div
                      key={i}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        showAnswers[bookmark._id] && i === q.correctAnswer
                          ? 'bg-green-100 text-green-700 font-medium'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}: {opt}
                      {showAnswers[bookmark._id] && i === q.correctAnswer && ' ✓'}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => toggleAnswer(bookmark._id)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {showAnswers[bookmark._id] ? 'Hide Answer' : 'Show Answer'}
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      Saved {formatDate(bookmark.createdAt)}
                    </span>
                    <Link
                      to={`/questions/${bookmark.chapter?._id}`}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      Go to Chapter <HiArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Explanation */}
                {showAnswers[bookmark._id] && q.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-semibold text-blue-700 mb-1">
                      Explanation:
                    </p>
                    <p className="text-xs text-blue-600">{q.explanation}</p>
                  </div>
                )}

                {/* User Note */}
                {bookmark.note && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs font-semibold text-yellow-700 mb-1">
                      Your Note:
                    </p>
                    <p className="text-xs text-yellow-600">{bookmark.note}</p>
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