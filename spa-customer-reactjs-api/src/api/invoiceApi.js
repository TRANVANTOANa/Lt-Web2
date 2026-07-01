import axiosClient from './axiosClient';

export const invoiceApi = {
  getAll: () => axiosClient.get('/invoices'),
  getById: (id) => axiosClient.get(`/invoices/${id}`),
  getByCustomer: (customerId) => axiosClient.get(`/invoices/customer/${customerId}`),
  pay: (id, paymentMethod) => axiosClient.put(`/invoices/${id}/payment`, { paymentMethod }),
};
