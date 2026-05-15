import axios, { isAxiosError } from 'axios';

const AUTH_TOKEN_KEY = 'autenticationToken';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        }

        return Promise.reject(error);
    }
);
