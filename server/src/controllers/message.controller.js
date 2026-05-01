import Message from '../models/Message.js'
import User from '../models/User.js'
import { getIo, getSocketId } from '../config/socket.js'

export const getConversations = async (req, res, next) => {
    try {
        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        }).sort({ createdAt: -1 }).populate('sender receiver', 'username avatar');

        // Extract unique conversations
        const conversations = new Map();
        messages.forEach(msg => {
            const partnerId = msg.sender._id.toString() === req.user.id ? msg.receiver._id.toString() : msg.sender._id.toString();
            if (!conversations.has(partnerId)) {
                conversations.set(partnerId, {
                    partner: msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender,
                    lastMessage: msg
                });
            }
        });

        res.json(Array.from(conversations.values()));
    } catch (err) {
        next(err);
    }
}

export const getMessagesWithUser = async (req, res, next) => {
    try {
        const partnerId = req.params.userId;
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: partnerId },
                { sender: partnerId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 }).populate('sender receiver', 'username avatar');

        // Mark as read
        await Message.updateMany(
            { sender: partnerId, receiver: req.user.id, read: false },
            { $set: { read: true } }
        );

        res.json(messages);
    } catch (err) {
        next(err);
    }
}

export const sendMessage = async (req, res, next) => {
    try {
        const { receiverId, content } = req.body;
        
        const message = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content
        });

        const populatedMessage = await message.populate('sender receiver', 'username avatar');

        // Socket.io real-time push
        const receiverSocketId = getSocketId(receiverId);
        if (receiverSocketId) {
            const io = getIo();
            io.to(receiverSocketId).emit('new_message', populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (err) {
        next(err);
    }
}
