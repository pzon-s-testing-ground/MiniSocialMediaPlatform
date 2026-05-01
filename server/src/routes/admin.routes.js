import express from 'express';
import { getUsers, banUser, warnUser, changeRole } from '../controllers/admin.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import { requireModOrAdmin, requireAdmin } from '../middlewares/roleCheck.js';

const router = express.Router();

router.get('/users', verifyToken, requireModOrAdmin, getUsers);
router.put('/users/:id/ban', verifyToken, requireModOrAdmin, banUser);
router.put('/users/:id/warn', verifyToken, requireModOrAdmin, warnUser);
router.put('/users/:id/role', verifyToken, requireAdmin, changeRole);

export default router;
