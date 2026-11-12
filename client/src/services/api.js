import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hackmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized occurs on protected routes (excluding login/register)
    if (error.response && error.response.status === 401) {
      const isAuthUrl = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthUrl) {
        localStorage.removeItem('hackmate_token');
        localStorage.removeItem('hackmate_user');
      }
    }
    return Promise.reject(error);
  }
);

// Modular API helper objects
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const teamApi = {
  getTeams: (params) => api.get('/teams', { params }),
  getTeamById: (id) => api.get(`/teams/${id}`),
  createTeam: (data) => api.post('/teams', data),
  updateTeam: (id, data) => api.put(`/teams/${id}`, data),
  deleteTeam: (id) => api.delete(`/teams/${id}`),
  leaveTeam: (id) => api.post(`/teams/${id}/leave`),
  getMyTeams: () => api.get('/teams/my-teams'),
  getRecommendations: () => api.get('/recommendations'),
};

export const userApi = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  searchUsers: (q) => api.get('/users/search', { params: { q } }),
};

export const requestApi = {
  createRequest: (teamId, message) => api.post('/requests', { teamId, message }),
  getIncoming: () => api.get('/requests/incoming'),
  getOutgoing: () => api.get('/requests/outgoing'),
  acceptRequest: (id) => api.patch(`/requests/${id}/accept`),
  rejectRequest: (id) => api.patch(`/requests/${id}/reject`),
  cancelRequest: (id) => api.patch(`/requests/${id}/cancel`),
};

export const notificationApi = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export default api;
