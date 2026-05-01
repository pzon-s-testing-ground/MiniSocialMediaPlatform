import Post from '../models/Post.js'
import Notification from '../models/Notification.js'
import { getIo, getSocketId } from '../config/socket.js'

export const getPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.category && req.query.category !== 'All') {
            query.category = req.query.category;
        }

        const posts = await Post.find(query)
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Post.countDocuments(query);

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch (err) {
        next(err)
    }
}

export const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username avatar createdAt')
        if (!post) return res.status(404).json({ message: 'Post not found' })
        res.json(post)
    } catch (err) {
        next(err)
    }
}

export const getPostsByUser = async (req, res, next) => {
    try {
        const posts = await Post.find({ author: req.params.userId }).populate('author', 'username avatar').sort({ createdAt: -1 })
        res.json(posts)
    } catch (err) {
        next(err)
    }
}

export const createPost = async (req, res, next) => {
    try {
        const post = await Post.create({
            title: req.body.title || 'Untitled',
            category: req.body.category || 'General',
            content: req.body.content,
            image: req.file ? `/uploads/${req.file.filename}` : '',
            author: req.user.id,
        })
        res.status(201).json(post)
    } catch (err) {
        next(err)
    }
}

export const deletePost = async (req, res, next) => {
    try {
        await Post.findByIdAndDelete(req.params.id)
        res.json({ message: 'Deleted' })
    } catch (err) {
        next(err)
    }
}

export const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' })
        
        if (post.likes.includes(req.user.id)) {
            post.likes.pull(req.user.id)
        } else {
            post.likes.push(req.user.id)
            
            // Create notification if liking someone else's post
            if (post.author.toString() !== req.user.id) {
                const notification = await Notification.create({
                    user: post.author,
                    sender: req.user.id,
                    type: 'like',
                    post: post._id
                });
                const populatedNotif = await notification.populate('sender', 'username avatar');
                
                const receiverSocketId = getSocketId(post.author.toString());
                if (receiverSocketId) {
                    getIo().to(receiverSocketId).emit('new_notification', populatedNotif);
                }
            }
        }
        await post.save()
        res.json(post)
    } catch (err) {
        next(err)
    }
}