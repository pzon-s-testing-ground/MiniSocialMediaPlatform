import Comment from '../models/Comment.js'

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 })
        res.json(comments)
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
        res.status(201).json(comment)
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
