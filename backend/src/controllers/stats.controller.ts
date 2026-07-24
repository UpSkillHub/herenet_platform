import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Get platform statistics
export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    const [
      totalProducts,
      totalUsers,
      approvedAds,
      categoriesWithCounts,
    ] = await Promise.all([
      // Total approved products/ads
      prisma.ad.count({
        where: { status: 'approved' },
      }),
      
      // Total registered users (non-admin)
      prisma.user.count({
        where: { isAdmin: false },
      }),
      
      // Get all approved ads for further calculations
      prisma.ad.findMany({
        where: { status: 'approved' },
        select: {
          id: true,
          categoryId: true,
        },
      }),
      
      // Get categories with their product counts
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              ads: true,
            },
          },
        },
      }),
    ]);

    // Calculate satisfaction rate (placeholder - can be based on reviews later)
    const satisfactionRate = totalProducts > 0 ? 98 : 0;

    // Format category stats
    const categoryStats = categoriesWithCounts.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: cat._count.ads,
    }));

    // Calculate category-specific counts
    const getCategoryCount = (categoryName: string) => {
      const category = categoryStats.find(cat => 
        cat.name.toLowerCase().includes(categoryName.toLowerCase())
      );
      return category ? category.count : 0;
    };

    const stats = {
      totalProducts,
      totalUsers,
      satisfactionRate,
      categories: categoryStats,
      // Specific category counts for homepage
      electronics: getCategoryCount('electronics'),
      fashion: getCategoryCount('fashion'),
      homeAndLiving: getCategoryCount('home'),
      beautyAndHealth: getCategoryCount('beauty'),
      sportsAndOutdoors: getCategoryCount('sports'),
      booksAndMedia: getCategoryCount('books'),
    };

    res.json(stats);
  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

// Get homepage hero statistics
export const getHeroStats = async (req: Request, res: Response) => {
  try {
    const [totalProducts, totalCustomers] = await Promise.all([
      prisma.ad.count({
        where: { status: 'approved' },
      }),
      prisma.user.count({
        where: { isAdmin: false },
      }),
    ]);

    // Format numbers with K suffix if over 1000
    const formatNumber = (num: number): string => {
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K+`;
      }
      return `${num}+`;
    };

    res.json({
      productsAvailable: formatNumber(totalProducts),
      happyCustomers: formatNumber(totalCustomers),
      satisfactionRate: '98%', // Can be calculated from reviews in the future
      totalProducts,
      totalCustomers,
    });
  } catch (error) {
    console.error('Get hero stats error:', error);
    res.status(500).json({ message: 'Failed to fetch hero statistics' });
  }
};

// Get admin dashboard analytics (e-commerce + ads)
export const getAdminDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    // Get products in stock (sum of all inventory)
    const productsInStock = await prisma.ad.aggregate({
      where: {
        status: 'approved',
        inventory: { gt: 0 },
      },
      _sum: {
        inventory: true,
      },
    });

    // Get total sales count from completed orders
    const totalSalesCount = await prisma.order.count({
      where: {
        status: 'delivered',
      },
    });

    // Get total revenue from completed orders
    const revenueData = await prisma.order.aggregate({
      where: {
        status: 'delivered',
      },
      _sum: {
        total: true,
      },
    });

    // Get ads statistics
    const [pendingAds, expiredAds, activeAds] = await Promise.all([
      prisma.ad.count({
        where: { status: 'pending' },
      }),
      prisma.ad.count({
        where: {
          status: 'approved',
          expiryDate: { lt: new Date() },
        },
      }),
      prisma.ad.count({
        where: {
          status: 'approved',
          expiryDate: { gte: new Date() },
        },
      }),
    ]);

    // Get products by category for chart
    const productsByCategory = await prisma.ad.groupBy({
      by: ['categoryId'],
      where: {
        status: 'approved',
        inventory: { gt: 0 },
      },
      _count: {
        id: true,
      },
      _sum: {
        inventory: true,
      },
    });

    // Get category names
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    });

    const categoryMap = Object.fromEntries(
      categories.map(c => [c.id, c.name])
    );

    const productsByCategoryFormatted = productsByCategory.map(item => ({
      category: categoryMap[item.categoryId] || 'Unknown',
      count: item._sum.inventory || 0,
    }));

    const analytics = {
      ecommerce: {
        productsInStock: productsInStock._sum.inventory || 0,
        totalSales: totalSalesCount,
        totalRevenue: revenueData._sum.total || 0,
        productsByCategory: productsByCategoryFormatted,
      },
      ads: {
        pending: pendingAds,
        expired: expiredAds,
        active: activeAds,
        total: pendingAds + expiredAds + activeAds,
      },
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get admin dashboard analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch admin dashboard analytics' });
  }
};
