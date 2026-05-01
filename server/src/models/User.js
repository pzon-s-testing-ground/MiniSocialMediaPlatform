import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar:   { type: String, default: '' },
    bio:      { type: String, default: '' },
    followers:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    role:       { type: String, enum: ['Admin', 'Moderator', 'Member'], default: 'Member' },
    isBanned:   { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isShadowbanned: { type: Boolean, default: false },
    lastLogin:  { type: Date },
    banReason:  { type: String, default: '' },
    warnings:   [{ reason: String, date: { type: Date, default: Date.now } }]
}, { timestamps: true })

export default mongoose.model('User', userSchema)
