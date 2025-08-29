import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔄 Request config:', {
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response || error);
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
      window.location.href = `${FRONTEND_URL}/login`;
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
