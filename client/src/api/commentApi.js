import axios from './axios';

export const getCommentsApi = (postId) => axios.get(`/comments/${postId}`);
export const createCommentApi = (postId, text) => axios.post(`/comments/${postId}`, { text });
export const deleteCommentApi = (id) => axios.delete(`/comments/${id}`);
