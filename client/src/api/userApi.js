import axios from './axios';

export const getUserApi = (id) => axios.get(`/users/${id}`);
export const updateUserApi = (data) => axios.put('/users/me', data);
export const uploadAvatarApi = (formData) => axios.put('/users/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
export const followUserApi = (id) => axios.put(`/users/${id}/follow`);
