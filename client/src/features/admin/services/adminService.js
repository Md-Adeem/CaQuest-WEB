import api from '../../../shared/utils/api';

const adminService = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),
  
  // Payments
  getPayments: (params = {}) => api.get('/admin/payments', { params }),
  approvePayment: (id) => api.put(`/admin/payments/${id}/approve`),
  rejectPayment: (id, reason) =>
    api.put(`/admin/payments/${id}/reject`, { reason }),
  
  // Users
  getUsers: (params = {}) => api.get('/admin/users', { params }),

  // Subjects
  createSubject: (data) => api.post('/subjects', data),
  updateSubject: (id, data) => api.put(`/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/subjects/${id}`),
  getAllSubjects: (level) => {
    const params = level ? `?level=${level}` : '';
    return api.get(`/subjects/all${params}`);
  },

  // Chapters
  createChapter: (data) => api.post('/chapters', data),
  updateChapter: (id, data) => api.put(`/chapters/${id}`, data),
  deleteChapter: (id) => api.delete(`/chapters/${id}`),

  // Questions
  getQuestions: (params = {}) => api.get('/questions', { params }),
  createQuestion: (data) => api.post('/questions', data),
  bulkCreateQuestions: (data) => api.post('/questions/bulk', data),
  updateQuestion: (id, data) => api.put(`/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),

  // Subscription Plans
  getPlans: () => api.get('/subscriptions'),
  createPlan: (data) => api.post('/subscriptions', data),
  updatePlan: (id, data) => api.put(`/subscriptions/${id}`, data),
};

export default adminService;