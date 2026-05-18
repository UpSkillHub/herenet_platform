// frontend/lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased slightly for payment processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Add token if available (Client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Setup Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    console.error(`❌ [API Error] ${status} ${url}`);

    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('🌐 Network Error: Backend server is not running or unreachable on', API_URL);
      console.error('Make sure backend is running with: npm run dev');
    }

    if (status === 401) {
      console.warn('🔑 Unauthorized - Token expired or invalid');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    if (status === 403) {
      console.warn('🚫 Forbidden - Insufficient permissions');
    }

    return Promise.reject(error);
  }
);

export default api;