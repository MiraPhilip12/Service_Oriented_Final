import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const userId = localStorage.getItem('user_id');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

// Auth APIs
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

// Menu APIs
export const menuApi = {
  getAll: () => api.get('/menu'),
  getAvailable: () => api.get('/menu/available'),
  getByCategory: (category: string) => api.get(`/menu/category/${category}`),
};

// Order APIs
export const orderApi = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderItems: (orderId: number) => api.get(`/orders/${orderId}/items`),
};

// Feedback APIs
export const feedbackApi = {
  create: (data: any) => api.post('/feedback', data),
  getMyFeedback: () => api.get('/feedback/my-feedback'),
};

// Delivery APIs
export const deliveryApi = {
  getStatus: (orderId: number) => api.get(`/delivery/status/${orderId}`),
};

export default api;