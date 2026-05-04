import express from 'express'
import { getUser, updateUser, uploadAvatar, followUser, deleteUser } from '../controllers/user.controller.js'
import verifyToken from '../middlewares/verifyToken.js'
import { upload } from '../middlewares/upload.js'

const router = express.Router()

router.get('/:id', verifyToken, getUser)
router.put('/me', verifyToken, updateUser)
router.delete('/me', verifyToken, deleteUser)
router.put('/me/avatar', verifyToken, upload.single('avatar'), uploadAvatar)
router.put('/:id/follow', verifyToken, followUser)

export default router
