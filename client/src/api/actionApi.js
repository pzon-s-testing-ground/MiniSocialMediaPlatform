import axios from './axios';

// Reports
export const createReportApi = (data) => axios.post('/actions/reports', data);

// Tickets
export const createTicketApi = (data) => axios.post('/actions/tickets', data);
export const getMyTicketsApi = () => axios.get('/actions/tickets/mine');
