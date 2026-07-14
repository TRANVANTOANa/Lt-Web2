import axiosClient from './axiosClient';

export const bannerApi = {
  getActive: () => axiosClient.get('/banners/active'),
};
