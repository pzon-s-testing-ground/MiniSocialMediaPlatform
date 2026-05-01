import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user receiving the notification
    sender:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user who triggered it
    type:    { type: String, enum: ['like', 'reply', 'follow'], required: true },
    post:    { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Optional, depending on type
    read:    { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('Notification', notificationSchema)
