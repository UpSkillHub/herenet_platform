// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    const [totalAds, activeAds, expiredAds] = await Promise.all([
      prisma.ad.count({ where: { userId } }),
      prisma.ad.count({ where: { userId, status: 'approved' } }),
      prisma.ad.count({ where: { userId, status: 'expired' } }),
    ]);

    res.json({ totalAds, activeAds, expiredAds });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};