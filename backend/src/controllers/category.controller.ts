import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            ads: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      count: cat._count.ads,
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

// Get ads by category
export const getAdsByCategory = async (req: Request, res: Response) => {
  try {
    // Extract categoryId as string to avoid TypeScript error
    const categoryId: string = Array.isArray(req.params.categoryId) 
      ? req.params.categoryId[0] 
      : req.params.categoryId;
      
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 24;
    const skip = (page - 1) * limit;

    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where: {
          categoryId: categoryId,
          status: 'approved',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.ad.count({
        where: {
          categoryId: categoryId,
          status: 'approved',
        },
      }),
    ]);

    res.json({
      ads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get ads by category error:', error);
    res.status(500).json({ message: 'Failed to fetch ads' });
  }
};
