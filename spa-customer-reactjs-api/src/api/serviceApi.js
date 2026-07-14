import axiosClient from './axiosClient';

export const serviceApi = {
  getAll: () => axiosClient.get('/spa-services'),
  getById: (id) => axiosClient.get(`/spa-services/${id}`),
  search: (keyword) => axiosClient.get('/spa-services/search', { params: { keyword } }),
  getByCategory: (categoryId) => axiosClient.get(`/spa-services/category/${categoryId}`),
  getActive: () => axiosClient.get('/spa-services/status/ACTIVE'),
  getLatest: (limit) => axiosClient.get('/spa-services/latest', { params: { limit } }),
  getHot: (limit) => axiosClient.get('/spa-services/hot', { params: { limit } }),
};

export const categoryApi = {
  getAll: () => axiosClient.get('/service-categories'),
  getActive: () => axiosClient.get('/service-categories/status/ACTIVE'),
};
