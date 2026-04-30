import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './src/config/db.js'

import authRoutes from './src/routes/auth.routes.js'
import userRoutes from './src/routes/user.routes.js'
import postRoutes from './src/routes/post.routes.js'
import commentRoutes from './src/routes/comment.routes.js'
import notificationRoutes from './src/routes/notification.routes.js'
import errorHandler from './src/middlewares/errorHandler.js'

const app = express()
connectDB()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/notifications', notificationRoutes)

app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})