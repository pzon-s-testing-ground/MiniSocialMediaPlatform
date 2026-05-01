import express from 'express'
import { getPosts, getPostById, getPostsByUser, createPost, deletePost, likePost, lockPost, pinPost } from '../controllers/post.controller.js'
import verifyToken from '../middlewares/verifyToken.js'
import { requireModOrAdmin } from '../middlewares/roleCheck.js'
import { upload } from '../middlewares/upload.js'

const router = express.Router()

router.get('/', verifyToken, getPosts)
router.get('/:id', verifyToken, getPostById)
router.get('/user/:userId', verifyToken, getPostsByUser)
router.post('/', verifyToken, upload.single('image'), createPost)
router.delete('/:id', verifyToken, deletePost)
router.put('/:id/like', verifyToken, likePost)
router.put('/:id/lock', verifyToken, requireModOrAdmin, lockPost)
router.put('/:id/pin', verifyToken, requireModOrAdmin, pinPost)

export default router