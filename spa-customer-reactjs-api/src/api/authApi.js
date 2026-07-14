import axiosClient from './axiosClient';

export const authApi = {
  login: (payload) => axiosClient.post('/auth/login', payload),
  register: (payload) => axiosClient.post('/auth/register', payload),
  forgotPassword: (email) => axiosClient.post('/auth/forgot-password', { email }),
};
