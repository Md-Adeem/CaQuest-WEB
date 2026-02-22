import api from '../../../shared/utils/api';

const dashboardService = {
  getStats: () => api.get('/auth/me'),
};

export default dashboardService;