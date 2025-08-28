import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', 
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
    console.log('Request config:', config); // Debug log
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response success:', response); 
    return response;
  },
  (error) => {
    console.error('Response error:', error); 
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'http://localhost:5173/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
