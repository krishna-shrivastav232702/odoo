import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string; fullName?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () =>
    api.get('/auth/me'),
  
  updateProfile: (data: { fullName?: string; phone?: string; address?: string }) =>
    api.put('/auth/me', data),
};

// Products API
export const productsAPI = {
  getProducts: (params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    page?: number;
    limit?: number;
  }) => api.get('/products', { params }),
  
  getProduct: (id: string) =>
    api.get(`/products/${id}`),
  
  createProduct: (data: {
    title: string;
    description: string;
    price: number;
    categoryId: number;
    condition: string;
    imageUrls: string[];
  }) => api.post('/products', data),
  
  updateProduct: (id: string, data: Partial<{
    title: string;
    description: string;
    price: number;
    categoryId: number;
    condition: string;
    imageUrls: string[];
  }>) => api.put(`/products/${id}`, data),
  
  deleteProduct: (id: string) =>
    api.delete(`/products/${id}`),
  
  getUserProducts: () =>
    api.get('/products/my-products'),
  
  uploadImages: (formData: FormData) =>
    api.post('/products/upload-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteImage: (imageUrl: string) =>
    api.delete('/products/delete-image', { data: { imageUrl } }),
};

// Categories API
export const categoriesAPI = {
  getCategories: () =>
    api.get('/categories'),
};

// Cart API
export const cartAPI = {
  getCart: () =>
    api.get('/cart'),
  
  addToCart: (productId: number, quantity: number = 1) =>
    api.post('/cart/add', { productId, quantity }),
  
  updateCartItem: (cartItemId: number, quantity: number) =>
    api.put(`/cart/${cartItemId}`, { quantity }),
  
  removeFromCart: (cartItemId: number) =>
    api.delete(`/cart/${cartItemId}`),
  
  clearCart: () =>
    api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  checkout: (data: { shippingAddress?: string }) =>
    api.post('/orders/checkout', data),
  
  getOrders: () =>
    api.get('/orders'),
  
  getOrder: (id: string) =>
    api.get(`/orders/${id}`),
  
  getSales: () =>
    api.get('/orders/sales'),
};

// Chat API
export const chatAPI = {
  getConversations: () =>
    api.get('/chat/conversations'),
  
  getConversation: (id: string) =>
    api.get(`/chat/conversations/${id}`),
  
  startConversation: (sellerId: number, productId?: number) =>
    api.post('/chat/conversations', { sellerId, productId }),
  
  sendMessage: (data: { conversationId: number; content: string; messageType?: string }) =>
    api.post('/chat/messages', {
      conversationId: data.conversationId,
      content: data.content,
      messageType: data.messageType || 'text'
    }),
  
  markAsRead: (conversationId: number) =>
    api.put(`/chat/conversations/${conversationId}/read`),
  
  getUnreadCount: () =>
    api.get('/chat/unread-count'),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () =>
    api.get('/notifications'),
  
  markAsRead: (id: number) =>
    api.put(`/notifications/${id}/read`),
  
  markAllAsRead: () =>
    api.put('/notifications/read-all'),
};

export default api;