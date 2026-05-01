import axios from './axios';

export const getUsersApi = () => axios.get('/admin/users');
export const banUserApi = (id, isBanned, reason) => axios.put(`/admin/users/${id}/ban`, { isBanned, reason });
export const warnUserApi = (id, reason) => axios.put(`/admin/users/${id}/warn`, { reason });
export const changeRoleApi = (id, role) => axios.put(`/admin/users/${id}/role`, { role });
