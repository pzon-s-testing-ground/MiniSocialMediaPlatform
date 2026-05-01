import axios from './axios';

export const getCommentsApi = (postId, page = 1, limit = 20) => {
    return axios.get(`/comments/${postId}?page=${page}&limit=${limit}`);
};
export const createCommentApi = (postId, text) => axios.post(`/comments/${postId}`, { text });
export const deleteCommentApi = (id) => axios.delete(`/comments/${id}`);
