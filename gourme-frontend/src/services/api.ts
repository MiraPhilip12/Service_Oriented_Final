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

// Admin APIs
export const adminApi = {
  // Menu Management
  getAllMenuItems: () => api.get('/menu'),
  createMenuItem: (data: any) => api.post('/menu', data),
  updateMenuItem: (id: number, data: any) => api.put(`/menu/${id}`, data),
  deleteMenuItem: (id: number) => api.delete(`/menu/${id}`),
  
  // Order Management
  getAllOrders: () => api.get('/orders'),
  updateOrderStatus: (id: number, status: string) => api.put(`/orders/${id}/status`, { status }),
  
  // Delivery Management
  getAllDeliveryPersonnel: () => api.get('/delivery/personnel'),
  createDeliveryPersonnel: (data: any) => api.post('/delivery/personnel', data),
  updateDeliveryLocation: (id: number, lat: number, lng: number) => 
    api.put(`/delivery/personnel/${id}/location`, { lat, lng }),
  toggleDeliveryActive: (id: number, isActive: boolean) => 
    api.put(`/delivery/personnel/${id}/active`, { isActive }),
  
  // Feedback Management
  getAllFeedback: () => api.get('/feedback'),
  
  // Statistics
  getSalesTotal: () => api.get('/orders/stats/sales'),
  getOrderCount: () => api.get('/orders/stats/count'),
  getDeliveryStats: () => api.get('/delivery/stats'),
  getAverageRating: () => api.get('/feedback/stats/average'),
};

export default api;