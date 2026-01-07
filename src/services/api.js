import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Debug interceptor
api.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  validateToken: (token) => {
    return axios.get(`${API_URL}/auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export const programAPI = {
  getAll: () => api.get('/programs'),
  getById: (id) => api.get(`/programs/${id}`),
  create: (data) => api.post('/programs', data),
  update: (id, data) => api.put(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`)
};

export const reportAPI = {
  getAll: () => api.get('/reports'),
  getById: (id) => api.get(`/reports/${id}`),
  create: (data) => api.post('/reports', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`)
};

export const userAPI = {
  getProfile: () => {
    console.log('Getting profile...'); // Debug log
    return api.get('/users/profile');
  },
  updateProfile: (data) => api.put('/users/profile', data),
  getLeaderboard: () => api.get('/users/leaderboard'),
  getStats: () => api.get('/users/stats')
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getPrograms: () => api.get('/admin/programs'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getReports: () => api.get('/admin/reports'),
  getReportDetail: (id) => api.get(`/admin/reports/${id}`),
  verifyReport: (id, data) => api.put(`/admin/reports/${id}/verify`, data),
  getReportPDF: (id) => {
    return `${API_URL}/admin/reports/${id}/pdf`;
  }
  ,
  sendBounty: (id) => api.post(`/admin/reports/${id}/send-bounty`)
};

export const paymentAPI = {
  getMyPayments: () => api.get('/payments'),
  createPayment: (data) => api.post('/payments', data)
};

export default api; 