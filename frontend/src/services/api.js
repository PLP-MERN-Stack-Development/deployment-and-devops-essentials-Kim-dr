import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔵 API_URL configured as:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔵 Making request to:', config.method?.toUpperCase(), config.url);
    console.log('🔵 Token present:', !!token);
    console.log('🔵 Request data:', config.data);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔵 Unauthorized - clearing auth and redirecting');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Todo API calls
export const todoAPI = {
  getAll: (params) => {
    console.log('🔵 todoAPI.getAll called with params:', params);
    return api.get('/todos', { params });
  },
  
  getOne: (id) => {
    console.log('🔵 todoAPI.getOne called with id:', id);
    return api.get(`/todos/${id}`);
  },
  
  create: (data) => {
    console.log('🔵 todoAPI.create called with data:', data);
    return api.post('/todos', data);
  },
  
  update: (id, data) => {
    console.log('🔵 todoAPI.update called with id:', id, 'data:', data);
    return api.put(`/todos/${id}`, data);
  },
  
  delete: (id) => {
    console.log('🔵 todoAPI.delete called with id:', id);
    return api.delete(`/todos/${id}`);
  },
  
  toggle: (id) => {
    console.log('🔵 todoAPI.toggle called with id:', id);
    return api.patch(`/todos/${id}/toggle`);
  },
};

// Auth API calls
export const authAPI = {
  register: (data) => {
    console.log('🔵 authAPI.register called');
    return api.post('/auth/register', data);
  },
  
  login: (data) => {
    console.log('🔵 authAPI.login called');
    return api.post('/auth/login', data);
  },
  
  getProfile: () => {
    console.log('🔵 authAPI.getProfile called');
    return api.get('/auth/me');
  },
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
  detailed: () => api.get('/health/detailed'),
};

export default api;