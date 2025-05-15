import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  signup: (userData) => api.post('/users/signup', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
};

// Workouts API
export const workouts = {
  getAll: () => api.get('/workouts'),
  getById: (id) => api.get(`/workouts/${id}`),
  create: (workout) => api.post('/workouts', workout),
  update: (id, workout) => api.patch(`/workouts/${id}`, workout),
  delete: (id) => api.delete(`/workouts/${id}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/workouts/range?startDate=${startDate}&endDate=${endDate}`),
  getStats: () => api.get('/workouts/stats/summary'),
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export default api;
