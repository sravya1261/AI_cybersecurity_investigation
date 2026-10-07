import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const dashboardService = {
    getStats: () => api.get('/dashboard/stats'),
};

export const logsService = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/logs/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

export const incidentsService = {
    getAll: () => api.get('/incidents'),
    getById: (id) => api.get(`/incidents/${id}`),
};

export const investigationService = {
    investigate: (id) => api.post(`/investigation/${id}/investigate`),
    chat: (id, query) => api.post(`/investigation/${id}/chat`, { query }),
};

export const reportsService = {
    getAll: () => api.get('/reports'),
    getById: (id) => api.get(`/reports/${id}`),
    generate: (id) => api.post(`/reports/${id}`),
};

export const sampleDataService = {
    getAll: () => api.get('/sample-data'),
    load: (id) => api.post(`/sample-data/${id}/load`),
};

export default api;
