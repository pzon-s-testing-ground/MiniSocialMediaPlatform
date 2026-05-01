import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title:   { type: String, required: true },
    category:{ type: String, default: 'General' },
    content: { type: String, required: true },
    image:   { type: String, default: '' },
    author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isLocked:{ type: Boolean, default: false },
    isPinned:{ type: Boolean, default: false },
    isDeleted:{ type: Boolean, default: false },
    deletedBy:{ type: String, enum: ['author', 'admin', null], default: null }
}, { timestamps: true })

export default mongoose.model('Post', postSchema)
