// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication endpoints
export const authAPI = {
    login: (email, password, role) => 
        api.post('/auth/login', { email, password, role }),
    
    signup: (userData) => 
        api.post('/auth/signup', userData),
    
    getCurrentUser: () => 
        api.get('/auth/me'),
};

// Reports endpoints
export const reportsAPI = {
    createReport: (reportData) => 
        api.post('/reports', reportData),
    
    getMyReports: () => 
        api.get('/reports/my-reports'),
    
    getReportStats: () => 
        api.get('/reports/stats'),
    
    getRecentActivity: (limit = 5) => 
        api.get('/reports/recent-activity', { params: { limit } }),
};

// Pickups endpoints
export const pickupsAPI = {
    schedulePickup: (pickupData) => 
        api.post('/pickups/schedule', pickupData),
    
    getMyPickups: () => 
        api.get('/pickups/my-pickups'),
    
    getAvailablePickups: () => 
        api.get('/pickups/available'),
    
    getPendingPickups: () => 
        api.get('/pickups/pending'),
};

// User endpoints
export const userAPI = {
    getUserProfile: () => 
        api.get('/auth/me'),
    
    updateProfile: (userData) => 
        api.put('/users/profile', userData),
};

export default api;