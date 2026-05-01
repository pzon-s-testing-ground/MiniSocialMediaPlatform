import Comment from '../models/Comment.js'
import Post from '../models/Post.js'
import Notification from '../models/Notification.js'
import { getIo, getSocketId } from '../config/socket.js'

export const getComments = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20; // Default to 20 replies per page
        const skip = (page - 1) * limit;

        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username avatar createdAt')
            .sort({ createdAt: 1 }) // Older comments first is standard for threads
            .skip(skip)
            .limit(limit);

        const total = await Comment.countDocuments({ post: req.params.postId });

        res.json({
            comments,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalComments: total
        });
    } catch (err) {
        next(err)
    }
}

export const createComment = async (req, res, next) => {
    try {
        const comment = await Comment.create({
            text: req.body.text,
            post: req.params.postId,
            author: req.user.id,
        })

        // Find post to get the author
        const post = await Post.findById(req.params.postId);
        if (post && post.author.toString() !== req.user.id) {
            const notification = await Notification.create({
                user: post.author,
                sender: req.user.id,
                type: 'reply',
                post: post._id
            });
            const populatedNotif = await notification.populate('sender', 'username avatar');
            
            const receiverSocketId = getSocketId(post.author.toString());
            if (receiverSocketId) {
                getIo().to(receiverSocketId).emit('new_notification', populatedNotif);
            }
        }

        const populatedComment = await comment.populate('author', 'username avatar createdAt');
        res.status(201).json(populatedComment)
    } catch (err) {
        next(err)
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        await Comment.findByIdAndDelete(req.params.id)
        res.json({ message: 'Deleted' })
    } catch (err) {
        next(err)
    }
}
