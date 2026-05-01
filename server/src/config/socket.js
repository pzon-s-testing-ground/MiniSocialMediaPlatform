import { Server } from 'socket.io'

let io;
const userSockets = new Map(); // Map userId -> socketId

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }
    })

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('register_user', (userId) => {
            if (userId) {
                userSockets.set(userId, socket.id);
                console.log(`User ${userId} registered to socket ${socket.id}`);
            }
        });

        socket.on('disconnect', () => {
            for (let [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    break;
                }
            }
            console.log('Client disconnected:', socket.id);
        });
    })

    return io;
}

export const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

export const getSocketId = (userId) => {
    return userSockets.get(userId);
}
