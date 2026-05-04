import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import http from 'http'
import connectDB from './src/config/db.js'
import { initSocket } from './src/config/socket.js'

import authRoutes from './src/routes/auth.routes.js'
import userRoutes from './src/routes/user.routes.js'
import postRoutes from './src/routes/post.routes.js'
import commentRoutes from './src/routes/comment.routes.js'
import notificationRoutes from './src/routes/notification.routes.js'
import messageRoutes from './src/routes/message.routes.js'
import adminRoutes from './src/routes/admin.routes.js'
import userActionsRoutes from './src/routes/user.actions.routes.js'
import searchRoutes from './src/routes/search.routes.js'
import errorHandler from './src/middlewares/errorHandler.js'

const app = express()
const server = http.createServer(app)

connectDB()
initSocket(server)

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/actions', userActionsRoutes)
app.use('/api/search', searchRoutes)

app.use(errorHandler)

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})