import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: inject Supabase auth token if available
apiClient.interceptors.request.use(
  (config) => {
    try {
      const sessionStr = localStorage.getItem('sb-token') || localStorage.getItem('supabase.auth.token');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const token = session?.access_token || session?.currentSession?.access_token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // Fallback silently
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: structured error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let customError = {
      message: 'Network error or backend service unreachable.',
      status: error.response?.status || 500,
      details: error.response?.data?.detail || error.message,
    };

    if (error.response) {
      if (error.response.status === 401) {
        customError.message = 'Session expired or unauthorized. Please log in again.';
      } else if (error.response.status === 403) {
        customError.message = 'You do not have permission to perform this laboratory action.';
      } else if (error.response.status === 404) {
        customError.message = 'Requested laboratory equipment or slot was not found.';
      } else if (error.response.status === 422) {
        customError.message = 'Validation error: Please verify your submission details.';
      }
    } else if (error.code === 'ECONNABORTED') {
      customError.message = 'The request timed out. Please try again.';
    }

    return Promise.reject(customError);
  }
);

// High-level API Services
export const healthApi = {
  check: () => apiClient.get('/health'),
};

export const equipmentApi = {
  getAll: (params = {}) => apiClient.get('/equipment', { params }),
  getById: (id) => apiClient.get(`/equipment/${id}`),
  getAlternatives: (id) => apiClient.get(`/equipment/${id}/alternatives`),
  getDepartments: () => apiClient.get('/equipment/meta/departments'),
  getCategories: () => apiClient.get('/equipment/meta/categories'),
  create: (data) => apiClient.post('/equipment', data),
};

export const aiApi = {
  analyzeProject: (data) => apiClient.post('/ai/analyze-project', data),
};

export const schedulerApi = {
  solve: (data) => apiClient.post('/scheduler/solve', data),
  getDemoConflicts: () => apiClient.get('/scheduler/demo-conflicts'),
};

export const bookingApi = {
  getAll: (params = {}) => apiClient.get('/bookings', { params }),
  getById: (id) => apiClient.get(`/bookings/${id}`),
  getRecommendedSlots: (equipmentId, date) =>
    apiClient.get(`/bookings/equipment/${equipmentId}/recommended-slots`, { params: { date } }),
  create: (data) => apiClient.post('/bookings', data),
  approve: (id, data) => apiClient.post(`/bookings/${id}/approve`, data),
  reject: (id, data) => apiClient.post(`/bookings/${id}/reject`, data),
  cancel: (id, data) => apiClient.post(`/bookings/${id}/cancel`, data),
  getHistory: (id) => apiClient.get(`/bookings/${id}/history`),
};

export const analyticsApi = {
  getOverview: (params = {}) => apiClient.get('/analytics/overview', { params }),
};

export default apiClient;
