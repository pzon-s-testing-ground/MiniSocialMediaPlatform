import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reportedItem: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ['Post', 'Comment', 'User'], required: true },
    reason: { type: String, required: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Resolved', 'Dismissed'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
