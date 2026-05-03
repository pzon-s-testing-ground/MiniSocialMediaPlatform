import Post from '../models/Post.js'
import User from '../models/User.js'

export const searchAll = async (req, res, next) => {
    try {
        const q = req.query.q || ''
        const type = req.query.type || 'all'   // 'posts', 'users', 'all'
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        if (!q.trim()) {
            return res.json({ posts: [], users: [], totalPostPages: 0, totalUserPages: 0 })
        }

        // Escape special regex characters to prevent injection
        const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(escapedQuery, 'i')

        let posts = []
        let users = []
        let totalPostPages = 0
        let totalUserPages = 0

        // Search posts
        if (type === 'all' || type === 'posts') {
            const postQuery = {
                isDeleted: { $ne: true },
                $or: [
                    { title: { $regex: regex } },
                    { content: { $regex: regex } }
                ]
            }

            const totalPosts = await Post.countDocuments(postQuery)
            totalPostPages = Math.ceil(totalPosts / limit)

            posts = await Post.find(postQuery)
                .populate('author', 'username avatar isVerified')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        }

        // Search users
        if (type === 'all' || type === 'users') {
            const userQuery = {
                isBanned: { $ne: true },
                username: { $regex: regex }
            }

            const totalUsers = await User.countDocuments(userQuery)
            totalUserPages = Math.ceil(totalUsers / limit)

            users = await User.find(userQuery)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        }

        res.json({ posts, users, totalPostPages, totalUserPages })
    } catch (err) {
        next(err)
    }
}
