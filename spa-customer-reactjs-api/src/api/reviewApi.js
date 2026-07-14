import axiosClient from './axiosClient';

export const reviewApi = {
  getByService: (serviceId) => axiosClient.get(`/reviews/service/${serviceId}`),
  getByCustomer: (customerId) => axiosClient.get(`/reviews/customer/${customerId}`),
  getByAppointment: (appointmentId) => axiosClient.get(`/reviews/appointment/${appointmentId}`),
  create: (payload) => axiosClient.post('/reviews', payload),
};
