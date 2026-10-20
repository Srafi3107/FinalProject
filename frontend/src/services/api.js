import axios from 'axios';

/**
 * Base Axios instance configured for HomeMatch REST API
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10s timeout
});

/**
 * Request Interceptor: Attach JWT Bearer token if present
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('homematch_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Handle unauthorized responses or token expiration
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or invalid, clear token
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('homematch_token');
        localStorage.removeItem('homematch_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
