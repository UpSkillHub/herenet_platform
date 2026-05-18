// backend/src/routes/upload.routes.ts
import { Router } from 'express';
import uploadController from '../controllers/upload.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Protected route - only logged in users can upload
router.post('/', authenticateToken, uploadController.uploadImages);

export default router;