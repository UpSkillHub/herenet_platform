import { Router } from 'express';
import { getPlatformStats, getHeroStats } from '../controllers/stats.controller';

const router = Router();

// Get platform statistics
router.get('/', getPlatformStats);

// Get hero section statistics
router.get('/hero', getHeroStats);

export default router;
