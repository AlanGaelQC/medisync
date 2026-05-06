import axios from 'axios';

// Base URL apuntada a la API en AWS
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// Inyecta el token JWT en cada request automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config
});

// Si el token expira manda de regreso al login
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;