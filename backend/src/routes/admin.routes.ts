import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware';
import {
  getPendingAds,
  getApprovedAds,
  getRejectedAds,
  approveAd,
  rejectAd,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAdminStats,
  getAdDetails,
  getAllAdminAds,
  getAllAdminPayments
} from '../controllers/admin.controller';

const router = Router();

// Apply auth and admin middleware to all routes
router.use(authenticateToken, isAdmin);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin statistics returned
 */
// Dashboard stats
router.get('/stats', getAdminStats);

// Ad management
/**
 * @swagger
 * /api/admin/ads:
 *   get:
 *     summary: Get all ads for admin review
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admin ads returned
 */
router.get('/ads', getAllAdminAds);
/**
 * @swagger
 * /api/admin/ads/pending:
 *   get:
 *     summary: Get pending ads
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending ads returned
 */
router.get('/ads/pending', getPendingAds);
/**
 * @swagger
 * /api/admin/ads/approved:
 *   get:
 *     summary: Get approved ads
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved ads returned
 */
router.get('/ads/approved', getApprovedAds);
/**
 * @swagger
 * /api/admin/ads/rejected:
 *   get:
 *     summary: Get rejected ads
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rejected ads returned
 */
router.get('/ads/rejected', getRejectedAds);
/**
 * @swagger
 * /api/admin/ads/{id}:
 *   get:
 *     summary: Get ad details by ID
 *     tags: [Admin]
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
 *         description: Ad details returned
 */
router.get('/ads/:id', getAdDetails);
/**
 * @swagger
 * /api/admin/ads/{id}/approve:
 *   put:
 *     summary: Approve an ad
 *     tags: [Admin]
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
 *         description: Ad approved successfully
 */
router.put('/ads/:id/approve', approveAd);
/**
 * @swagger
 * /api/admin/ads/{id}/reject:
 *   put:
 *     summary: Reject an ad
 *     tags: [Admin]
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
 *         description: Ad rejected successfully
 */
router.put('/ads/:id/reject', rejectAd);

// Payment management
/**
 * @swagger
 * /api/admin/payments:
 *   get:
 *     summary: Get all payments for admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin payments returned
 */
router.get('/payments', getAllAdminPayments);

// User management
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users returned
 */
router.get('/users', getAllUsers);
/**
 * @swagger
 * /api/admin/users/{id}/status:
 *   put:
 *     summary: Update a user's status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User status updated
 */
router.put('/users/:id/status', updateUserStatus);
/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
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
 *         description: User deleted successfully
 */
router.delete('/users/:id', deleteUser);

export default router;