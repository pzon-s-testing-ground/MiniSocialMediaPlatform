import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    text:   { type: String, required: true },
    post:   { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted:{ type: Boolean, default: false },
    deletedBy:{ type: String, enum: ['author', 'admin', null], default: null }
}, { timestamps: true })

export default mongoose.model('Comment', commentSchema)
