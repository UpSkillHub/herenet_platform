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

// Dashboard stats
router.get('/stats', getAdminStats);

// Ad management
router.get('/ads', getAllAdminAds);
router.get('/ads/pending', getPendingAds);
router.get('/ads/approved', getApprovedAds);
router.get('/ads/rejected', getRejectedAds);
router.get('/ads/:id', getAdDetails);
router.put('/ads/:id/approve', approveAd);
router.put('/ads/:id/reject', rejectAd);

// Payment management
router.get('/payments', getAllAdminPayments);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

export default router;