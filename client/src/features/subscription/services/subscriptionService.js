import api from '../../../shared/utils/api';

const subscriptionService = {
  getPlans: (level) => {
    const params = level ? `?level=${level}` : '';
    return api.get(`/subscriptions${params}`);
  },
  getPlan: (id) => api.get(`/subscriptions/${id}`),
  submitPayment: (formData) =>
    api.post('/payments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyPayments: () => api.get('/payments/my-payments'),
};

export default subscriptionService;