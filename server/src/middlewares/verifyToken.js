import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'No token' })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }
        if (user.isBanned) {
            return res.status(403).json({ message: `Your account has been banned. Reason: ${user.banReason}` })
        }
        
        // Attach full user object for easy access to role
        req.user = user
        next()
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' })
    }
}

export default verifyToken