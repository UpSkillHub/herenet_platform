// src/routes/user.routes.ts
import express from 'express';
import { getUserStats } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/stats', authenticateToken, getUserStats);

export default router;