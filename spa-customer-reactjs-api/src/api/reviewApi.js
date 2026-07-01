import axiosClient from './axiosClient';

export const reviewApi = {
  getByService: (serviceId) => axiosClient.get(`/reviews/service/${serviceId}`),
  getByCustomer: (customerId) => axiosClient.get(`/reviews/customer/${customerId}`),
  create: (payload) => axiosClient.post('/reviews', payload),
};
