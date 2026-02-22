import { useState, useEffect, useCallback } from 'react';
import subjectService from '../services/subjectService';
import toast from 'react-hot-toast';

export const useSubjects = (level) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubjects = useCallback(async () => {
    if (!level) return;
    try {
      setLoading(true);
      const response = await subjectService.getSubjectsByLevel(level);
      setSubjects(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subjects');
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return { subjects, loading, error, refetch: fetchSubjects };
};

export const useChapters = (subjectId) => {
  const [chapters, setChapters] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChapters = useCallback(async () => {
    if (!subjectId) return;
    try {
      setLoading(true);
      const [subjectRes, chaptersRes] = await Promise.all([
        subjectService.getSubject(subjectId),
        subjectService.getChaptersBySubject(subjectId),
      ]);
      setSubject(subjectRes.data.data);
      setChapters(chaptersRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load chapters');
      toast.error('Failed to load chapters');
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  return { chapters, subject, loading, error, refetch: fetchChapters };
};