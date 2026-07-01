import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('spa_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      localStorage.removeItem('spa_token');
      localStorage.removeItem('spa_user');
      window.location.href = '/login';
    }
    return Promise.reject(new Error(err?.response?.data?.message || err?.response?.data?.error || err.message || 'API error'));
  }
);

export default axiosClient;

export const crudApi = (endpoint) => ({
  getAll: () => axiosClient.get(endpoint),
  create: (data) => axiosClient.post(endpoint, data),
  update: (id, data) => axiosClient.put(`${endpoint}/${id}`, data),
  remove: (id) => axiosClient.delete(`${endpoint}/${id}`),
});
