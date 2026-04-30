import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE_IN || '7d' }
    )
}

// POST /api/auth/register
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body

        // Kiểm tra email đã tồn tại chưa
        const existed = await User.findOne({ email })
        if (existed) return res.status(400).json({ message: 'Email đã được sử dụng' })

        // Hash password
        const hashed = await bcrypt.hash(password, 10)

        // Default avatar
        const defaultAvatar = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}`

        const user = await User.create({ username, email, password: hashed, avatar: defaultAvatar })
        const token = generateToken(user)

        res.status(201).json({
            token,
            user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }
        })
    } catch (err) {
        next(err)
    }
}

// POST /api/auth/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: 'Email không tồn tại' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' })

        const token = generateToken(user)

        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }
        })
    } catch (err) {
        next(err)
    }
}

// GET /api/auth/me  — lấy thông tin user đang đăng nhập
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        next(err)
    }
}