import axiosClient from './axiosClient';

export const roomApi = {
  getAll: () => axiosClient.get('/rooms'),
  getAvailable: () => axiosClient.get('/rooms/status/TRONG'),
};
