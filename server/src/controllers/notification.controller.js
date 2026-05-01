import Notification from '../models/Notification.js'

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .populate('sender', 'username avatar')
            .populate('post', 'title content')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (err) {
        next(err);
    }
}

export const markAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, read: false },
            { $set: { read: true } }
        );
        res.json({ message: 'Marked all as read' });
    } catch (err) {
        next(err);
    }
}
