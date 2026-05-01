import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
    replies: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: { type: String },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);
