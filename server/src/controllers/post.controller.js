import Post from '../models/Post.js'

export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('author', 'username avatar').sort({ createdAt: -1 })
        res.json(posts)
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
        }
        await post.save()
        res.json(post)
    } catch (err) {
        next(err)
    }
}