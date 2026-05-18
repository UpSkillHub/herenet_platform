// backend/src/services/ad.service.ts
import prisma from '../config/database';

const adService = {
  async createAd(userId: string, data: any) {
    const { title, description, price, categoryId, location, days = 7, isFeatured = false } = data;

    const category = await prisma.category.findUnique({
      where: { id: String(categoryId) }
    });
    if (!category) throw new Error('Invalid category selected');

    const expiryDate = new Date(Date.now() + Number(days) * 24 * 60 * 60 * 1000);

    const ad = await prisma.ad.create({
      data: {
        title: title.trim(),
        description: description?.trim() || '',
        price: Number(price) || 0,
        categoryId: String(categoryId),
        location: location.trim(),
        userId,
        status: 'pending',
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
  }
};

export default adService;