
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 25000,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
  
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export default api;
