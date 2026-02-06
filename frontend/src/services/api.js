import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login on 401 if we're not already on the login page
    // and not trying to check auth
    if (error.response?.status === 401) {
      const isAuthCheck = error.config?.url === '/auth/me';
      const isLoginPage = window.location.pathname === '/login';
      
      if (!isAuthCheck && !isLoginPage) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data)
};

// Students API
export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  getStats: () => api.get('/students/stats'),
  getPerformance: (id) => api.get(`/students/${id}/performance`)
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getPerformanceTrends: () => api.get('/analytics/performance/trends'),
  getAttendance: () => api.get('/analytics/attendance'),
  getRiskDistribution: () => api.get('/analytics/risk-distribution'),
  getSubjectPerformance: () => api.get('/analytics/performance/subjects'),
  getClassComparison: () => api.get('/analytics/performance/class-comparison'),
  getStudentAnalytics: (id) => api.get(`/analytics/student/${id}`)
};

// Predictions API
export const predictionsAPI = {
  getStudentPrediction: (id) => api.get(`/predictions/student/${id}`),
  getBatch: () => api.get('/predictions/batch'),
  getRecommendations: (id) => api.get(`/predictions/recommendations/${id}`),
  getExplainableInsights: (id) => api.get(`/predictions/explain/${id}`),
  getFeatureImportance: (id) => api.get(`/predictions/feature-importance/${id}`)
};

// Alerts API
export const alertsAPI = {
  getAll: (params) => api.get('/alerts', { params }),
  getUnreadCount: () => api.get('/alerts/unread-count'),
  markAsRead: (id) => api.put(`/alerts/${id}`),
  markAllAsRead: () => api.put('/alerts/mark-all-read'),
  delete: (id) => api.delete(`/alerts/${id}`)
};

// Gamification API
export const gamificationAPI = {
  getBadges: (userId) => api.get(userId ? `/gamification/badges/${userId}` : '/gamification/badges'),
  getLeaderboard: (params) => api.get('/gamification/leaderboard', { params }),
  getStreak: (userId) => api.get(`/gamification/streak/${userId}`),
  getAchievements: (userId) => api.get(`/gamification/achievements/${userId}`),
  getProgress: (userId) => api.get(`/gamification/progress/${userId}`),
  claimReward: (rewardId) => api.post('/gamification/claim-reward', { rewardId })
};

export default api;
