import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

/**
 * Configured Axios Instance for Atelier E-Commerce Platform
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Automatically inject JWT Bearer token
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('atelier_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Error reading token from localStorage:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract data and handle errors / 401 unauthorized
api.interceptors.response.use(
  (response) => {
    // Return response.data directly for clean caller syntax
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 401 Unauthorized: token expired or invalid
      if (error.response.status === 401) {
        window.dispatchEvent(new CustomEvent('atelier:unauthorized'));
      }

      // Format custom message from backend response if available
      const message = error.response.data?.message || `Request failed with status ${error.response.status}`;
      error.message = message;
    } else if (error.request) {
      error.message = 'Unable to connect to backend server. Please ensure the API is running on port 8081.';
    }

    return Promise.reject(error);
  }
);

export default api;
