import { Router } from 'express';
import { getAllCategories, getAdsByCategory } from '../controllers/category.controller';

const router = Router();

// Get all categories
router.get('/', getAllCategories);

// Get ads by category
router.get('/:categoryId/ads', getAdsByCategory);

export default router;
