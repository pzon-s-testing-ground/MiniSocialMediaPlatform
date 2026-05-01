import express from 'express'
import { getConversations, getMessagesWithUser, sendMessage } from '../controllers/message.controller.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.get('/conversations', verifyToken, getConversations)
router.get('/:userId', verifyToken, getMessagesWithUser)
router.post('/', verifyToken, sendMessage)

export default router
