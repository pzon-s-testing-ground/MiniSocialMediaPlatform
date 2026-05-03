import express from 'express'
import { register, login, getMe, verifyEmail } from '../controllers/auth.controller.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/verify-email/:token', verifyEmail)
router.get('/me', verifyToken, getMe)  // route được bảo vệ

export default router