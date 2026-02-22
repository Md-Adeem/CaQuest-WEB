import api from '../../../shared/utils/api';

const questionService = {
  getQuestions: (chapterId, params = {}) =>
    api.get('/questions', { params: { chapter: chapterId, ...params } }),
  checkAccess: (chapterId) => api.get(`/questions/check-access/${chapterId}`),
};

export default questionService;