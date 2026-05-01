import axios from './axios';

export const getPostsApi = (page = 1, limit = 10, category = 'All') => {
    return axios.get(`/posts?page=${page}&limit=${limit}&category=${category}`);
};
export const getPostByIdApi = (id) => axios.get(`/posts/${id}`);
export const getPostsByUserApi = (userId) => axios.get(`/posts/user/${userId}`);
export const createPostApi = (content, title, category) => axios.post('/posts', { content, title, category });
export const deletePostApi = (id) => axios.delete(`/posts/${id}`);
export const likePostApi = (id) => axios.put(`/posts/${id}/like`);
export const lockPostApi = (id) => axios.put(`/posts/${id}/lock`);
export const pinPostApi = (id) => axios.put(`/posts/${id}/pin`);
