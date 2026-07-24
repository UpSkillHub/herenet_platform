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
    console.error('💥 Get user stats error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};

export const upgradeToMember = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user is already a member
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { isMember: true, isAdmin: true, name: true, email: true }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (existingUser.isMember || existingUser.isAdmin) {
      return res.status(400).json({ 
        message: 'User is already a member',
        user: existingUser
      });
    }

    // Upgrade user to member
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isMember: true },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
        isMember: true,
        status: true,
        createdAt: true
      }
    });

    res.json({ 
      message: 'Successfully upgraded to member status',
      user: updatedUser
    });
  } catch (error: any) {
    console.error('💥 Upgrade to member error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    res.status(500).json({ message: 'Failed to upgrade to member', error: error.message });
  }
};