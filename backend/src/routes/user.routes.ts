// src/routes/user.routes.ts
import express from 'express';
import { getUserStats, upgradeToMember } from '../controllers/user.controller';
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

/**
 * @swagger
 * /api/users/upgrade-to-member:
 *   put:
 *     summary: Upgrade current user to member status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User upgraded to member successfully
 *       400:
 *         description: User is already a member
 */
router.put('/upgrade-to-member', authenticateToken, upgradeToMember);

export default router;