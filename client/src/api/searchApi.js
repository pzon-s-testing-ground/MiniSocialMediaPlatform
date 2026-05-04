import axios from './axios';

export const searchApi = (query, type = 'all', page = 1, limit = 10) => {
    return axios.get(`/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}&limit=${limit}`);
};
