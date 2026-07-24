// backend/src/routes/ad.routes.ts
import { Router } from 'express';
import adController from '../controllers/ad.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireMember } from '../middleware/membership.middleware';

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

// Protected routes - MUST come before /:id to avoid "my" being treated as an ID
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

/**
 * @swagger
 * /api/ads:
 *   post:
 *     summary: Create a new ad (Members only)
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
 *       403:
 *         description: Member access required
 */
router.post('/', authenticateToken, requireMember, adController.createAd);

/**
 * @swagger
 * /api/ads/{id}:
 *   put:
 *     summary: Update an ad (Members only)
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ad updated successfully
 *       403:
 *         description: Member access required
 */
router.put('/:id', authenticateToken, requireMember, adController.updateAd);

/**
 * @swagger
 * /api/ads/{id}:
 *   delete:
 *     summary: Delete an ad (Members only)
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ad deleted successfully
 *       403:
 *         description: Member access required
 */
router.delete('/:id', authenticateToken, requireMember, adController.deleteAd);

export default router;