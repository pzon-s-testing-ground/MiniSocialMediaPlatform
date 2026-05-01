import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { getIo, getSocketId } from '../config/socket.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        next(err);
    }
};

export const banUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason, isBanned } = req.body;
        
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.role === 'Admin' && req.user.id !== user._id.toString()) {
            return res.status(403).json({ message: 'Cannot ban other admins' });
        }

        user.isBanned = isBanned;
        user.banReason = isBanned ? reason : '';
        await user.save();
        
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const warnUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        user.warnings.push({ reason, date: new Date() });
        await user.save();
        
        // Create and emit notification
        const notification = await Notification.create({
            user: user._id,
            sender: req.user.id,
            type: 'warning',
            message: reason
        });
        
        const populatedNotif = await notification.populate('sender', 'username avatar');
        
        const receiverSocketId = getSocketId(user._id.toString());
        if (receiverSocketId) {
            getIo().to(receiverSocketId).emit('new_notification', populatedNotif);
        }
        
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const changeRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Only admins can change roles' });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        user.role = role;
        await user.save();
        
        res.json(user);
    } catch (err) {
        next(err);
    }
};
