import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { HiSearch, HiX, HiBookOpen, HiCollection, HiQuestionMarkCircle } from 'react-icons/hi';
import { LEVELS } from '../utils/constants';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await api.get(`/search?q=${encodeURIComponent(query)}&limit=5`);
        setResults(response.data.data);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleNavigate = (path) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  const hasResults =
    results &&
    (results.subjects?.length > 0 ||
      results.chapters?.length > 0 ||
      results.questions?.length > 0);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results) setIsOpen(true);
          }}
          placeholder="Search subjects, chapters, questions..."
          className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-xl 
                     focus:bg-white dark:bg-gray-800 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 
                     transition-all text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults(null);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300"
          >
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-slide-up max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          ) : !hasResults ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </p>
            </div>
          ) : (
            <div>
              {/* Subjects */}
              {results.subjects?.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <HiBookOpen className="w-3 h-3" />
                    Subjects
                  </div>
                  {results.subjects.map((subject) => (
                    <button
                      key={subject._id}
                      onClick={() =>
                        handleNavigate(`/chapters/${subject._id}`)
                      }
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:bg-gray-900 flex items-center gap-3 transition-colors"
                    >
                      <span className="text-lg">{subject.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {subject.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {LEVELS[subject.level]?.name} • {subject.totalChapters} chapters
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Chapters */}
              {results.chapters?.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <HiCollection className="w-3 h-3" />
                    Chapters
                  </div>
                  {results.chapters.map((chapter) => (
                    <button
                      key={chapter._id}
                      onClick={() =>
                        handleNavigate(`/questions/${chapter._id}`)
                      }
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:bg-gray-900 flex items-center gap-3 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                        {chapter.chapterNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {chapter.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {chapter.subject?.name} • {chapter.totalQuestions} questions
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Questions */}
              {results.questions?.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <HiQuestionMarkCircle className="w-3 h-3" />
                    Questions
                  </div>
                  {results.questions.map((q) => (
                    <button
                      key={q._id}
                      onClick={() =>
                        handleNavigate(`/questions/${q.chapter?._id}`)
                      }
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:bg-gray-900 transition-colors"
                    >
                      <p className="text-sm text-gray-900 dark:text-white truncate">
                        {q.questionText}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {q.subject?.name} • Ch {q.chapter?.chapterNumber}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;