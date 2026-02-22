import api from '../../../shared/utils/api';

const subjectService = {
  getSubjectsByLevel: (level) => api.get(`/subjects?level=${level}`),
  getSubject: (id) => api.get(`/subjects/${id}`),
  getChaptersBySubject: (subjectId) => api.get(`/chapters?subject=${subjectId}`),
  getChapter: (id) => api.get(`/chapters/${id}`),
};

export default subjectService;