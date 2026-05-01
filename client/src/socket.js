import { io } from 'socket.io-client';

let socket;

export const initSocket = (userId) => {
    if (!socket) {
        socket = io('http://localhost:5000', {
            withCredentials: true
        });
        
        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('register_user', userId);
        });
    }
    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
