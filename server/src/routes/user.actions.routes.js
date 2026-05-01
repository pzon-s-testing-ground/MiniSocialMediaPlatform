import express from 'express';
import Report from '../models/Report.js';
import Ticket from '../models/Ticket.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Users can report content
router.post('/reports', verifyToken, async (req, res, next) => {
    try {
        const { reportedItem, itemType, reason } = req.body;
        const report = await Report.create({
            reportedItem,
            itemType,
            reason,
            reporter: req.user._id
        });
        res.status(201).json(report);
    } catch (err) {
        next(err);
    }
});

// Users can submit support tickets
router.post('/tickets', verifyToken, async (req, res, next) => {
    try {
        const { subject, message } = req.body;
        const ticket = await Ticket.create({
            user: req.user._id,
            subject,
            message
        });
        res.status(201).json(ticket);
    } catch (err) {
        next(err);
    }
});

// Users can view their own tickets
router.get('/tickets/mine', verifyToken, async (req, res, next) => {
    try {
        const tickets = await Ticket.find({ user: req.user._id })
            .populate('replies.sender', 'username avatar')
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        next(err);
    }
});

export default router;
