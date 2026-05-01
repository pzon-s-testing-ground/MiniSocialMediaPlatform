import axios from './axios';

export const getConversationsApi = () => axios.get('/messages/conversations');
export const getMessagesWithUserApi = (userId) => axios.get(`/messages/${userId}`);
export const sendMessageApi = (receiverId, content) => axios.post('/messages', { receiverId, content });
