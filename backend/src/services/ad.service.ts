// backend/src/services/ad.service.ts
import prisma from '../config/database';

const adService = {
  async createAd(userId: string, data: any, isAdminPost: boolean = false) {
    const { title, description, price, categoryId, location, days = 7, isFeatured = false } = data;

    const category = await prisma.category.findUnique({
      where: { id: String(categoryId) }
    });
    if (!category) throw new Error('Invalid category selected');

    const expiryDate = new Date(Date.now() + Number(days) * 24 * 60 * 60 * 1000);

    // Admin posts are auto-approved, regular posts are pending
    const status = isAdminPost ? 'approved' : 'pending';

    const ad = await prisma.ad.create({
      data: {
        title: title.trim(),
        description: description?.trim() || '',
        price: Number(price) || 0,
        categoryId: String(categoryId),
        location: location.trim(),
        userId,
        status,
        isFeatured: Boolean(isFeatured),
        expiryDate,
      },
      include: { category: true }
    });

    return ad;
  },

  async getAllAds() {
    return prisma.ad.findMany({
      where: { status: 'approved' },
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    });
  },

  async getMyAds(userId: string) {
    return prisma.ad.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    });
  },

  async getAdById(id: string) {
    return prisma.ad.findUnique({
      where: { id },
      include: { category: true }
    });
  },

  async updateAd(adId: string, userId: string, data: any) {
    // Check if ad exists and belongs to user
    const existingAd = await prisma.ad.findUnique({
      where: { id: adId }
    });

    if (!existingAd) {
      throw new Error('Ad not found');
    }

    // Check ownership (unless admin - will be handled by middleware)
    if (existingAd.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const { title, description, price, categoryId, location, isFeatured } = data;

    // Validate category if provided
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: String(categoryId) }
      });
      if (!category) throw new Error('Invalid category selected');
    }

    const ad = await prisma.ad.update({
      where: { id: adId },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(price !== undefined && { price: Number(price) }),
        ...(categoryId && { categoryId: String(categoryId) }),
        ...(location && { location: location.trim() }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
      },
      include: { category: true }
    });

    return ad;
  },

  async deleteAd(adId: string, userId: string) {
    // Check if ad exists and belongs to user
    const existingAd = await prisma.ad.findUnique({
      where: { id: adId }
    });

    if (!existingAd) {
      throw new Error('Ad not found');
    }

    // Check ownership (unless admin - will be handled by middleware)
    if (existingAd.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await prisma.ad.delete({
      where: { id: adId }
    });

    return true;
  }
};

export default adService;