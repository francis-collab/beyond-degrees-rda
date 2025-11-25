// src/lib/api.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// AUTOMATICALLY ADD TOKEN + SMART CONTENT-TYPE HANDLING
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // CRITICAL: Let browser set Content-Type + boundary for FormData
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']; // Let axios auto-set multipart with boundary
  }

  return config;
});

// Global error handling (optional but clean)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const fetcher = (url: string) =>
  api.get(url).then((res) => res.data).catch((err) => {
    console.error('API Error:', url, err.response?.status);
    throw err;
  });

export default api;