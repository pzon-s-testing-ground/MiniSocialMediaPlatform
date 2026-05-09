import Post from '../models/Post.js'
import Notification from '../models/Notification.js'
import SystemSetting from '../models/SystemSetting.js'
import User from '../models/User.js'
import { getIo, getSocketId } from '../config/socket.js'
import { parseTagsAndNotify } from '../utils/tagParser.js'

export const getPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.category && req.query.category !== 'All') {
            query.category = req.query.category;
        }

        // Shadowban filtering: hide shadowbanned users' posts unless admin or the author
        const isMod = req.user.role === 'Admin' || req.user.role === 'Moderator';
        if (!isMod) {
            const shadowbannedUsers = await User.find({ isShadowbanned: true }).select('_id');
            const shadowIds = shadowbannedUsers.map(u => u._id);
            // Allow the user to see their own posts even if shadowbanned
            if (shadowIds.length > 0) {
                query.$or = [
                    { author: { $nin: shadowIds } },
                    { author: req.user._id }
                ];
            }
        }

        const posts = await Post.find(query)
            .populate('author', 'username avatar isVerified')
            .sort({ isPinned: -1, createdAt: -1 })
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
        const targetUser = await User.findById(req.params.userId);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        if (targetUser.isPrivate) {
            const isSelf = req.user.id === targetUser._id.toString();
            const isMod = req.user.role === 'Admin' || req.user.role === 'Moderator';
            const isFollower = targetUser.followers.includes(req.user.id);
            if (!isSelf && !isMod && !isFollower) {
                return res.json([]); // Return empty posts if private and unauthorized
            }
        }

        const posts = await Post.find({ author: req.params.userId }).populate('author', 'username avatar').sort({ createdAt: -1 })
        res.json(posts)
    } catch (err) {
        next(err)
    }
}

export const createPost = async (req, res, next) => {
    try {
        // Keyword filtering
        const bannedWordsSetting = await SystemSetting.findOne({ key: 'banned_words' });
        if (bannedWordsSetting && bannedWordsSetting.value) {
            const bannedWords = bannedWordsSetting.value.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
            const contentLower = (req.body.content || '').toLowerCase();
            const titleLower = (req.body.title || '').toLowerCase();
            const found = bannedWords.find(w => contentLower.includes(w) || titleLower.includes(w));
            if (found) {
                return res.status(400).json({ message: `Your post contains a banned word: "${found}"` });
            }
        }

        const parsedContent = await parseTagsAndNotify(req.body.content, req.user._id, null); // Will need post._id for notification though...
        
        let post = await Post.create({
            title: req.body.title || 'Untitled',
            category: req.body.category || 'General',
            content: parsedContent,
            image: req.file ? `/uploads/${req.file.filename}` : '',
            author: req.user._id,
        });

        // If we want the post ID in notifications, we might have to run parseTagsAndNotify AFTER creation, 
        // but it modifies content. Let's re-run it or pass post id.
        // Better: create post, then parse tags and update content.
        
        const finalContent = await parseTagsAndNotify(req.body.content, req.user._id, post._id);
        if (finalContent !== req.body.content) {
            post.content = finalContent;
            await post.save();
        }

        res.status(201).json(post)
    } catch (err) {
        next(err)
    }
}

export const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' })

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized. Only the author can edit this post.' })
        }
        
        // Keyword filtering
        const bannedWordsSetting = await SystemSetting.findOne({ key: 'banned_words' });
        if (bannedWordsSetting && bannedWordsSetting.value) {
            const bannedWords = bannedWordsSetting.value.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
            const contentLower = (req.body.content || '').toLowerCase();
            const titleLower = (req.body.title || '').toLowerCase();
            const found = bannedWords.find(w => contentLower.includes(w) || titleLower.includes(w));
            if (found) {
                return res.status(400).json({ message: `Your post contains a banned word: "${found}"` });
            }
        }

        const finalContent = await parseTagsAndNotify(req.body.content || post.content, req.user._id, post._id);

        post.title = req.body.title || post.title;
        post.content = finalContent;
        post.editedAt = new Date();
        await post.save();

        res.json(post);
    } catch (err) {
        next(err)
    }
}

export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' })

        if (post.author.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Moderator') {
            return res.status(403).json({ message: 'Unauthorized' })
        }

        post.isDeleted = true;
        post.deletedBy = (req.user.role === 'Admin' || req.user.role === 'Moderator') ? 'admin' : 'author';
        await post.save();

        res.json({ message: 'Post deleted' })
    } catch (err) {
        next(err)
    }
}

export const lockPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' })
        
        post.isLocked = !post.isLocked;
        await post.save();
        res.json(post);
    } catch (err) {
        next(err)
    }
}

export const pinPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' })
        
        post.isPinned = !post.isPinned;
        await post.save();
        res.json(post);
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