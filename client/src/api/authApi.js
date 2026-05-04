import axios from './axios';

export const loginApi = (credentials) => axios.post('/auth/login', credentials);
export const registerApi = (userData) => axios.post('/auth/register', userData);
export const getMeApi = () => axios.get('/auth/me');
export const verifyEmailApi = (token) => axios.get(`/auth/verify-email/${token}`);
