import { useState, useEffect, useCallback } from 'react';
import questionService from '../services/questionService';

export const useQuestions = (chapterId) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessInfo, setAccessInfo] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const checkAccess = useCallback(async () => {
    if (!chapterId) return;
    try {
      const response = await questionService.checkAccess(chapterId);
      setHasAccess(response.data.data.hasAccess);
      setAccessInfo(response.data.data);
      return response.data.data.hasAccess;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check access');
      return false;
    }
  }, [chapterId]);

  const fetchQuestions = useCallback(
    async (params = {}) => {
      if (!chapterId) return;
      try {
        setLoading(true);
        const response = await questionService.getQuestions(chapterId, params);
        setQuestions(response.data.data);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total,
        });
      } catch (err) {
        if (err.response?.data?.requiresSubscription) {
          setHasAccess(false);
          setAccessInfo({
            hasAccess: false,
            level: err.response.data.level,
          });
        } else {
          setError(err.response?.data?.message || 'Failed to load questions');
        }
      } finally {
        setLoading(false);
      }
    },
    [chapterId]
  );

  useEffect(() => {
    const init = async () => {
      const access = await checkAccess();
      if (access) {
        await fetchQuestions();
      } else {
        setLoading(false);
      }
    };
    init();
  }, [checkAccess, fetchQuestions]);

  return {
    questions,
    loading,
    error,
    hasAccess,
    accessInfo,
    pagination,
    fetchQuestions,
  };
};