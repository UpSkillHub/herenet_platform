import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

// Get all pending ads for admin approval
export const getPendingAds = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const pendingAds = await prisma.ad.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        category: true
      }
    });

    res.json(pendingAds);
  } catch (error) {
    console.error('💥 Error fetching pending ads:');
    console.error('Message:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
    
    res.status(500).json({ message: 'Failed to fetch pending ads' });
  }
};

// Get all approved ads for admin
export const getApprovedAds = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const approvedAds = await prisma.ad.findMany({
      where: { status: 'approved' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true
      }
    });

    res.json(approvedAds);
  } catch (error) {
    console.error('💥 Error fetching approved ads:');
    console.error('Message:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
    
    res.status(500).json({ message: 'Failed to fetch approved ads' });
  }
};

// Get all rejected ads for admin
export const getRejectedAds = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const rejectedAds = await prisma.ad.findMany({
      where: { status: 'rejected' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true
      }
    });

    res.json(rejectedAds);
  } catch (error) {
    console.error('Error fetching rejected ads:', error);
    res.status(500).json({ message: 'Failed to fetch rejected ads' });
  }
};

// Approve an ad
export const approveAd = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const ad = await prisma.ad.update({
      where: { id },
      data: {
        status: 'approved',
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.json({ message: 'Ad approved successfully', ad });
  } catch (error) {
    console.error('💥 Error approving ad:');
    console.error('Message:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
    
    res.status(500).json({ message: 'Failed to approve ad' });
  }
};

// Reject an ad
export const rejectAd = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { reason } = req.body;

    const ad = await prisma.ad.update({
      where: { id },
      data: {
        status: 'rejected',
        updatedAt: new Date()
      }
    });

    res.json({ message: 'Ad rejected successfully', ad });
  } catch (error) {
    console.error('💥 Error rejecting ad:');
    console.error('Message:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
    
    res.status(500).json({ message: 'Failed to reject ad' });
  }
};

// Get all users for admin
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
        status: true,
        createdAt: true,
        _count: {
          select: { ads: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error('💥 Error fetching users:');
    console.error('Message:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
    
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Update user status
export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { status } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        status: true
      }
    });

    res.json({ message: 'User status updated successfully', user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
};

// Delete a user
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    // First delete all user's ads
    await prisma.ad.deleteMany({
      where: { userId: id }
    });

    // Then delete the user
    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('💥 Error deleting user:');
    console.error('Message:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
    
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Get admin dashboard statistics
export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const [
      totalUsers,
      totalAds,
      pendingAds,
      approvedAds,
      rejectedAds
    ] = await Promise.all([
      prisma.user.count(),
      prisma.ad.count(),
      prisma.ad.count({ where: { status: 'pending' } }),
      prisma.ad.count({ where: { status: 'approved' } }),
      prisma.ad.count({ where: { status: 'rejected' } })
    ]);

    res.json({
      totalUsers,
      totalAds,
      pendingAds,
      approvedAds,
      rejectedAds,
      totalRevenue: 0
    });
  } catch (error) {
    console.error('💥 Error fetching admin stats:');
    console.error('Message:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
    
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
};

// Get a single ad details
export const getAdDetails = async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const ad = await prisma.ad.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        category: true
      }
    });

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json(ad);
  } catch (error) {
    console.error('Error fetching ad details:', error);
    res.status(500).json({ message: 'Failed to fetch ad details' });
  }
};

// Get all ads for admin dashboard
export const getAllAdminAds = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const ads = await prisma.ad.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        category: true
      }
    });

    res.json(ads);
  } catch (error) {
    console.error('Error fetching all admin ads:', error);
    res.status(500).json({ message: 'Failed to fetch ads' });
  }
};

// Get all payments for admin dashboard
export const getAllAdminPayments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ad: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.json(payments);
  } catch (error) {
    console.error('💥 Error fetching payments:');
    console.error('Message:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
    
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};