// src/routes/user.routes.ts
import express from 'express';
import { getUserStats } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Get authenticated user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics returned
 */
router.get('/stats', authenticateToken, getUserStats);

export default router;