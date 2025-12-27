/**
 * API Utility - Simple fetch wrapper for backend communication
 * All API calls are made to the Express backend (server-side architecture)
 */

const API_BASE_URL = '/api'; // Proxied through Vite

/**
 * Make API request with authentication
 */
const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

/**
 * Authentication API
 */
export const authAPI = {
    register: (userData) =>
        request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),

    login: (credentials) =>
        request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

    getProfile: () => request('/auth/profile'),

    updateProfile: (updates) =>
        request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(updates),
        }),
};

/**
 * Chat API
 */
export const chatAPI = {
    sendMessage: (message) =>
        request('/chat/message', {
            method: 'POST',
            body: JSON.stringify({ message }),
        }),

    getHistory: () => request('/chat/history'),

    clearHistory: () =>
        request('/chat/history', {
            method: 'DELETE',
        }),
};

/**
 * Progress API
 */
export const progressAPI = {
    logWorkout: (workoutData) =>
        request('/progress/workout', {
            method: 'POST',
            body: JSON.stringify(workoutData),
        }),

    getWorkouts: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/progress/workouts?${query}`);
    },

    getStats: (days = 30) => request(`/progress/stats?days=${days}`),

    deleteWorkout: (id) =>
        request(`/progress/workout/${id}`, {
            method: 'DELETE',
        }),
};

/**
 * Token management
 */
export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeAuthToken = () => {
    localStorage.removeItem('token');
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};
