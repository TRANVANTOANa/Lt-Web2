import axiosClient from './axiosClient';

export const employeeApi = {
  getAll: () => axiosClient.get('/employees'),
  getById: (id) => axiosClient.get(`/employees/${id}`),
  getActive: () => axiosClient.get('/employees/status/DANG_LAM'),
};
