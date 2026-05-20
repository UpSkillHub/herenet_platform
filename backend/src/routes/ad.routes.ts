// backend/src/routes/ad.routes.ts
import { Router } from 'express';
import adController from '../controllers/ad.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/ads:
 *   get:
 *     summary: Get all ads
 *     tags: [Ads]
 *     responses:
 *       200:
 *         description: List of ads returned
 */
// Public routes
router.get('/', adController.getAllAds);
/**
 * @swagger
 * /api/ads/{id}:
 *   get:
 *     summary: Get ad by ID
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ad details returned
 *       404:
 *         description: Ad not found
 */
router.get('/:id', adController.getAdById);

// Protected routes
/**
 * @swagger
 * /api/ads:
 *   post:
 *     summary: Create a new ad
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Ad created successfully
 */
router.post('/', authenticateToken, adController.createAd);
/**
 * @swagger
 * /api/ads/my:
 *   get:
 *     summary: Get ads for the current user
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User ads returned
 */
router.get('/my', authenticateToken, adController.getMyAds);

export default router;