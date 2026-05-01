import axios from './axios';

// User Management (Police)
export const getUsersApi = (search = '') => axios.get(`/admin/users?search=${search}`);
export const banUserApi = (id, isBanned, reason) => axios.put(`/admin/users/${id}/ban`, { isBanned, reason });
export const warnUserApi = (id, reason) => axios.put(`/admin/users/${id}/warn`, { reason });
export const changeRoleApi = (id, role) => axios.put(`/admin/users/${id}/role`, { role });
export const verifyUserApi = (id) => axios.put(`/admin/users/${id}/verify`);
export const shadowbanUserApi = (id) => axios.put(`/admin/users/${id}/shadowban`);

// Content Moderation (Janitor)
export const getReportsApi = () => axios.get('/admin/reports');
export const resolveReportApi = (id, action) => axios.put(`/admin/reports/${id}`, { action });
export const getAuditLogsApi = () => axios.get('/admin/audit-logs');
export const getSettingsApi = () => axios.get('/admin/settings');
export const updateSettingApi = (key, value) => axios.put('/admin/settings', { key, value });

// Analytics (Scientist)
export const getAnalyticsApi = () => axios.get('/admin/analytics');

// Communication (Concierge)
export const sendAnnouncementApi = (message) => axios.post('/admin/announcements', { message });
export const getTicketsApi = () => axios.get('/admin/tickets');
export const replyToTicketApi = (id, message, close = false) => axios.put(`/admin/tickets/${id}/reply`, { message, close });

// User-facing
export const reportContentApi = (reportedItem, itemType, reason) => axios.post('/reports', { reportedItem, itemType, reason });
export const submitTicketApi = (subject, message) => axios.post('/tickets', { subject, message });
