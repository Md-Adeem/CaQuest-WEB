import api from '../../../shared/utils/api';

const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  selectLevel: (level) => api.put('/auth/select-level', { level }),
  updateProfile: (data) => api.put('/auth/profile', data),
  updateStreak: () => api.put('/auth/streak'),
};

export default authService;