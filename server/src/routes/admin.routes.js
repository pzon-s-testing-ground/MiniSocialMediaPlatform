import express from 'express';
import {
    getUsers, banUser, warnUser, changeRole, verifyUser, shadowbanUser,
    getReports, resolveReport,
    getAuditLogs, getSettings, updateSettings,
    getAnalytics,
    sendAnnouncement, getTickets, replyToTicket
} from '../controllers/admin.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import { requireModOrAdmin, requireAdmin } from '../middlewares/roleCheck.js';

const router = express.Router();

// User Management (Police)
router.get('/users', verifyToken, requireModOrAdmin, getUsers);
router.put('/users/:id/ban', verifyToken, requireModOrAdmin, banUser);
router.put('/users/:id/warn', verifyToken, requireModOrAdmin, warnUser);
router.put('/users/:id/role', verifyToken, requireAdmin, changeRole);
router.put('/users/:id/verify', verifyToken, requireAdmin, verifyUser);
router.put('/users/:id/shadowban', verifyToken, requireModOrAdmin, shadowbanUser);

// Content Moderation (Janitor)
router.get('/reports', verifyToken, requireModOrAdmin, getReports);
router.put('/reports/:id', verifyToken, requireModOrAdmin, resolveReport);
router.get('/audit-logs', verifyToken, requireModOrAdmin, getAuditLogs);
router.get('/settings', verifyToken, requireAdmin, getSettings);
router.put('/settings', verifyToken, requireAdmin, updateSettings);

// Analytics (Scientist)
router.get('/analytics', verifyToken, requireModOrAdmin, getAnalytics);

// Communication (Concierge)
router.post('/announcements', verifyToken, requireAdmin, sendAnnouncement);
router.get('/tickets', verifyToken, requireModOrAdmin, getTickets);
router.put('/tickets/:id/reply', verifyToken, requireModOrAdmin, replyToTicket);

export default router;
