import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

/**
 * Axios instance with base configuration
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    timeout: 10000,
    withCredentials: true, // For httpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor - Add access token
 */
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor - Handle 401 with token refresh
 * IMPORTANT: Don't retry for auth endpoints to avoid infinite loops
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip refresh logic for auth endpoints (login, register, refresh, logout)
        const isAuthEndpoint = originalRequest.url?.includes('/auth/');

        // If 401, not already retrying, and not an auth endpoint
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint
        ) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                await useAuthStore.getState().refreshToken();
                // Retry original request with new token
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

// ============================================
// Auth API
// ============================================
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    refresh: () => api.post('/auth/refresh'),
    me: () => api.get('/auth/me'),
};

// ============================================
// Transactions API
// ============================================
export const transactionsAPI = {
    getAll: (params) => api.get('/transactions', { params }),
    getById: (id) => api.get(`/transactions/${id}`),
    create: (data) => api.post('/transactions', data),
    update: (id, data) => api.put(`/transactions/${id}`, data),
    delete: (id) => api.delete(`/transactions/${id}`),
    restore: (id) => api.patch(`/transactions/${id}/restore`),
    getSummary: (params) => api.get('/transactions/summary', { params }),
    getTrends: (params) => api.get('/transactions/trend', { params }),
    export: (params) => api.get('/transactions/export', {
        params,
        responseType: 'blob'
    }),
};

// ============================================
// Categories API
// ============================================
export const categoriesAPI = {
    getAll: (params) => api.get('/categories', { params }),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// ============================================
// Budgets API
// ============================================
export const budgetsAPI = {
    getAll: (params) => api.get('/budgets', { params }),
    getById: (id) => api.get(`/budgets/${id}`),
    create: (data) => api.post('/budgets', data),
    update: (id, data) => api.put(`/budgets/${id}`, data),
    delete: (id) => api.delete(`/budgets/${id}`),
};

// ============================================
// Accounts API
// ============================================
export const accountsAPI = {
    getAll: (params) => api.get('/accounts', { params }),
    getById: (id) => api.get(`/accounts/${id}`),
    create: (data) => api.post('/accounts', data),
    update: (id, data) => api.put(`/accounts/${id}`, data),
    delete: (id) => api.delete(`/accounts/${id}`),
    transfer: (data) => api.post('/accounts/transfer', data),
};

// ============================================
// Goals API
// ============================================
export const goalsAPI = {
    getAll: (params) => api.get('/goals', { params }),
    getById: (id) => api.get(`/goals/${id}`),
    create: (data) => api.post('/goals', data),
    update: (id, data) => api.put(`/goals/${id}`, data),
    delete: (id) => api.delete(`/goals/${id}`),
    contribute: (id, data) => api.post(`/goals/${id}/add`, data),
};

// ============================================
// Insights API
// ============================================
export const insightsAPI = {
    get: (params) => api.get('/insights', { params }),
};

// ============================================
// Profile API
// ============================================
export const profileAPI = {
    get: () => api.get('/profile'),
    update: (data) => api.put('/profile', data),
    uploadPhoto: (file) => {
        const formData = new FormData();
        formData.append('photo', file);
        return api.post('/profile/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deletePhoto: () => api.delete('/profile/photo'),
    changePassword: (data) => api.put('/profile/password', data),
    requestEmailChange: (data) => api.post('/profile/email', data),
    verifyEmail: (token) => api.get(`/profile/verify-email/${token}`),
    getCurrencies: () => api.get('/profile/currencies'),
};
