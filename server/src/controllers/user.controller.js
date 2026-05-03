import User from '../models/User.js'
import Post from '../models/Post.js'
import Comment from '../models/Comment.js'

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json(user)
    } catch (err) {
        next(err)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const { bio, location, website } = req.body
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { bio, location, website }, 
            { new: true }
        ).select('-password')
        res.json(user)
    } catch (err) {
        next(err)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user.id
        
        // Delete user's posts
        await Post.deleteMany({ author: userId })
        
        // Delete user's comments
        await Comment.deleteMany({ author: userId })
        
        // Remove user from followers/following of others
        await User.updateMany({}, { $pull: { followers: userId, following: userId } })
        
        // Delete the user
        await User.findByIdAndDelete(userId)
        
        res.json({ message: 'Account and associated data deleted successfully' })
    } catch (err) {
        next(err)
    }
}

export const uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image uploaded' })
        const avatarUrl = `/uploads/${req.file.filename}`
        const user = await User.findByIdAndUpdate(req.user.id, { avatar: avatarUrl }, { new: true }).select('-password')
        res.json(user)
    } catch (err) {
        next(err)
    }
}

export const followUser = async (req, res, next) => {
    try {
        const target = await User.findById(req.params.id)
        if (!target) return res.status(404).json({ message: 'User not found' })
        if (target.followers.includes(req.user.id)) {
            target.followers.pull(req.user.id)
            await User.findByIdAndUpdate(req.user.id, { $pull: { following: req.params.id } })
        } else {
            target.followers.push(req.user.id)
            await User.findByIdAndUpdate(req.user.id, { $addToSet: { following: req.params.id } })
        }
        await target.save()
        res.json({ message: 'Toggled follow' })
    } catch (err) {
        next(err)
    }
}
