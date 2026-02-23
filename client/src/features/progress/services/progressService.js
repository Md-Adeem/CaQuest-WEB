import api from "../../../shared/utils/api";

const progressService = {
  saveAttempt: (data) => api.post("/progress/attempt", data),
  saveQuizResults: (data) => api.post("/progress/quiz", data),
  getMyStats: (level) => {
    const params = level ? `?level=${level}` : "";
    return api.get(`/progress/stats${params}`);
  },
  getChapterProgress: (chapterId) => api.get(`/progress/chapter/${chapterId}`),
  toggleBookmark: (questionId, note) =>
    api.post("/progress/bookmark", { questionId, note }),
  getBookmarks: (params = {}) => api.get("/progress/bookmarks", { params }),
  checkBookmarks: (chapterId) =>
    api.get(`/progress/bookmarks/check/${chapterId}`),
  checkSingleBookmark: (questionId) =>
    api.get(`/progress/bookmarks/check-question/${questionId}`),
};

export default progressService;
