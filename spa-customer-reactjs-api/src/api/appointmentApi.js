import axiosClient from './axiosClient';

export const appointmentApi = {
  getAll: () => axiosClient.get('/appointments'),
  getById: (id) => axiosClient.get(`/appointments/${id}`),
  getByCustomer: (customerId) => axiosClient.get(`/appointments/customer/${customerId}`),
  create: (payload) => axiosClient.post('/appointments', payload),
  update: (id, payload) => axiosClient.put(`/appointments/${id}`, payload),
  updateStatus: (id, status) => axiosClient.put(`/appointments/${id}/status`, { status }),
  checkEmployeeConflict: ({ employeeId, date, time, duration }) =>
    axiosClient.get('/appointments/check-employee-conflict', {
      params: { employeeId, date, time, duration },
    }),
  checkRoomConflict: ({ roomId, date, time, duration }) =>
    axiosClient.get('/appointments/check-room-conflict', {
      params: { roomId, date, time, duration },
    }),
};
