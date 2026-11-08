import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cosmetics_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract data and handle 401
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const errors = error.response?.data?.errors || null;

    if (error.response?.status === 401) {
      // Clear token if expired
      localStorage.removeItem('cosmetics_token');
      localStorage.removeItem('cosmetics_user');
      if (!window.location.pathname.includes('/login')) {
        // Option to redirect to login if required
      }
    }

    return Promise.reject({
      message,
      errors,
      status: error.response?.status
    });
  }
);

export default api;
