import axiosClient from './axiosClient';

export const customerApi = {
  getAll: () => axiosClient.get('/customers'),
  getById: (id) => axiosClient.get(`/customers/${id}`),
  search: (keyword) => axiosClient.get('/customers/search', { params: { keyword } }),
  create: (payload) => axiosClient.post('/customers', payload),
  update: (id, payload) => axiosClient.put(`/customers/${id}`, payload),
};
