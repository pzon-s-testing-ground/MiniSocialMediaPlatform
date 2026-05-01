import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import Report from '../models/Report.js';
import AuditLog from '../models/AuditLog.js';
import Ticket from '../models/Ticket.js';
import SystemSetting from '../models/SystemSetting.js';
import { getIo, getSocketId } from '../config/socket.js';

// ========================
// HELPER: Log admin action
// ========================
const logAction = async (adminId, action, targetId, details) => {
    await AuditLog.create({ admin: adminId, action, targetId, details });
};

// ========================
// 1. USER MANAGEMENT (Police)
// ========================

export const getUsers = async (req, res, next) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
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
        
        if (user.role === 'Admin' && req.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Cannot ban other admins' });
        }

        user.isBanned = isBanned;
        user.banReason = isBanned ? reason : '';
        await user.save();
        
        await logAction(req.user._id, isBanned ? 'Banned User' : 'Unbanned User', user._id, reason || '');
        
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
            sender: req.user._id,
            type: 'warning',
            message: reason
        });
        
        const populatedNotif = await notification.populate('sender', 'username avatar');
        
        const receiverSocketId = getSocketId(user._id.toString());
        if (receiverSocketId) {
            getIo().to(receiverSocketId).emit('new_notification', populatedNotif);
        }
        
        await logAction(req.user._id, 'Warned User', user._id, reason);
        
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
        
        const oldRole = user.role;
        user.role = role;
        await user.save();
        
        await logAction(req.user._id, 'Changed Role', user._id, `${oldRole} → ${role}`);
        
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const verifyUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        user.isVerified = !user.isVerified;
        await user.save();
        
        await logAction(req.user._id, user.isVerified ? 'Verified User' : 'Unverified User', user._id, '');
        
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const shadowbanUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        user.isShadowbanned = !user.isShadowbanned;
        await user.save();
        
        await logAction(req.user._id, user.isShadowbanned ? 'Shadowbanned User' : 'Un-shadowbanned User', user._id, '');
        
        res.json(user);
    } catch (err) {
        next(err);
    }
};

// ========================
// 2. CONTENT MODERATION (Janitor)
// ========================

export const getReports = async (req, res, next) => {
    try {
        const reports = await Report.find()
            .populate('reporter', 'username avatar')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        next(err);
    }
};

export const resolveReport = async (req, res, next) => {
    try {
        const { action } = req.body; // 'Resolved' or 'Dismissed'
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });
        
        report.status = action || 'Resolved';
        await report.save();
        
        // If resolved and it's a Post/Comment, soft-delete it
        if (action === 'Resolved') {
            if (report.itemType === 'Post') {
                await Post.findByIdAndUpdate(report.reportedItem, { isDeleted: true, deletedBy: 'admin' });
            } else if (report.itemType === 'Comment') {
                await Comment.findByIdAndUpdate(report.reportedItem, { isDeleted: true, deletedBy: 'admin' });
            }
        }
        
        await logAction(req.user._id, `Report ${action}`, report._id, `${report.itemType} ${report.reportedItem}`);
        
        res.json(report);
    } catch (err) {
        next(err);
    }
};

export const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog.find()
            .populate('admin', 'username avatar')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(logs);
    } catch (err) {
        next(err);
    }
};

export const getSettings = async (req, res, next) => {
    try {
        const settings = await SystemSetting.find();
        // Convert to key-value object
        const obj = {};
        settings.forEach(s => { obj[s.key] = s.value; });
        res.json(obj);
    } catch (err) {
        next(err);
    }
};

export const updateSettings = async (req, res, next) => {
    try {
        const { key, value } = req.body;
        await SystemSetting.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );
        
        await logAction(req.user._id, 'Updated Setting', null, `${key}`);
        
        res.json({ message: 'Setting updated' });
    } catch (err) {
        next(err);
    }
};

// ========================
// 3. ANALYTICS (Scientist)
// ========================

export const getAnalytics = async (req, res, next) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const [totalUsers, totalPosts, totalComments, 
               postsToday, newUsersToday,
               activeToday, activeThisMonth] = await Promise.all([
            User.countDocuments(),
            Post.countDocuments(),
            Comment.countDocuments(),
            Post.countDocuments({ createdAt: { $gte: todayStart } }),
            User.countDocuments({ createdAt: { $gte: todayStart } }),
            User.countDocuments({ lastLogin: { $gte: todayStart } }),
            User.countDocuments({ lastLogin: { $gte: monthStart } })
        ]);
        
        // Top 5 most liked posts
        const topPosts = await Post.find({ isDeleted: { $ne: true } })
            .populate('author', 'username')
            .sort({ likes: -1 })
            .limit(5)
            .select('title content likes createdAt');

        res.json({
            totalUsers,
            totalPosts,
            totalComments,
            postsToday,
            newUsersToday,
            dau: activeToday,
            mau: activeThisMonth,
            topPosts: topPosts.map(p => ({
                _id: p._id,
                title: p.title || p.content?.substring(0, 30),
                author: p.author?.username,
                likes: p.likes?.length || 0
            }))
        });
    } catch (err) {
        next(err);
    }
};

// ========================
// 4. COMMUNICATION (Concierge)
// ========================

export const sendAnnouncement = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: 'Message required' });
        
        // Broadcast to all connected users via Socket.io
        getIo().emit('system_announcement', {
            message,
            sender: req.user.username,
            timestamp: new Date()
        });
        
        await logAction(req.user._id, 'Sent Announcement', null, message);
        
        res.json({ message: 'Announcement sent' });
    } catch (err) {
        next(err);
    }
};

export const getTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find()
            .populate('user', 'username avatar')
            .populate('replies.sender', 'username avatar')
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        next(err);
    }
};

export const replyToTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        
        ticket.replies.push({
            sender: req.user._id,
            message: req.body.message
        });
        
        if (req.body.close) ticket.status = 'Closed';
        await ticket.save();
        
        const populated = await ticket.populate(['user', 'replies.sender']);
        res.json(populated);
    } catch (err) {
        next(err);
    }
};
