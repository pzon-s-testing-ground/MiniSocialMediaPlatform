import Notification from '../models/Notification.js'

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('sender', 'username avatar')
            .sort({ createdAt: -1 })
        res.json(notifications)
    } catch (err) {
        next(err)
    }
}

export const markAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true })
        res.json({ message: 'All marked as read' })
    } catch (err) {
        next(err)
    }
}
