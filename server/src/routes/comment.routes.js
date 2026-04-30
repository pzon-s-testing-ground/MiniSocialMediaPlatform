import express from 'express'
import { getComments, createComment, deleteComment } from '../controllers/comment.controller.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.get('/:postId', verifyToken, getComments)
router.post('/:postId', verifyToken, createComment)
router.delete('/:id', verifyToken, deleteComment)

export default router
