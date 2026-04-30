import axios from './axios';

export const getPostsApi = () => axios.get('/posts');
export const getPostByIdApi = (id) => axios.get(`/posts/${id}`);
export const getPostsByUserApi = (userId) => axios.get(`/posts/user/${userId}`);
export const createPostApi = (postData) => axios.post('/posts', postData);
export const deletePostApi = (id) => axios.delete(`/posts/${id}`);
export const likePostApi = (id) => axios.put(`/posts/${id}/like`);
