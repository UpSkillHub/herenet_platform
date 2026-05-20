// backend/src/routes/upload.routes.ts
import { Router } from 'express';
import multer from 'multer';
import uploadController from '../controllers/upload.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload images for an ad
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Upload successful
 */
// Protected route - only logged in users can upload
router.post('/', authenticateToken, upload.array('images'), uploadController.uploadImages);

export default router;