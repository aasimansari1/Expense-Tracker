import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL, timeout: 15000 });

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export const TransactionsAPI = {
  list: (params) => api.get('/transactions', { params }).then((r) => r.data.data),
  stats: () => api.get('/transactions/stats').then((r) => r.data.data),
  create: (payload) => api.post('/transactions', payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/transactions/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/transactions/${id}`).then((r) => r.data.data),
};

export const BudgetAPI = {
  get: (month) => api.get('/budget', { params: { month } }).then((r) => r.data.data),
  set: (payload) => api.post('/budget', payload).then((r) => r.data.data),
};

export default api;
