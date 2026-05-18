// backend/src/routes/ad.routes.ts
import { Router } from 'express';
import adController from '../controllers/ad.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', adController.getAllAds);
router.get('/:id', adController.getAdById);

// Protected routes
router.post('/', authenticateToken, adController.createAd);
router.get('/my', authenticateToken, adController.getMyAds);

export default router;