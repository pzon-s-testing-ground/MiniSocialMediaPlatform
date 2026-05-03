import express from 'express'
import { searchAll } from '../controllers/search.controller.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.get('/', verifyToken, searchAll)

export default router
