import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // Important for HttpOnly cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
