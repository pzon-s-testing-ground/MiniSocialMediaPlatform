import axios from './axios';

export const getNotificationsApi = () => axios.get('/notifications');
export const markNotificationsReadApi = () => axios.put('/notifications/read');
