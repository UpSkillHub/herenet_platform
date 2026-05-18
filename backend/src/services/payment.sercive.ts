// backend/src/services/payment.service.ts
import prisma from '../config/database';

export interface PaymentInput {
  userId: string;
  adId: string;
  amount: number;
  days: number;
  isFeatured: boolean;
  paymentMethod?: string;
}

export const paymentService = {
  /**
   * Create a new payment record
   */
  async createPayment(data: PaymentInput) {
    const payment = await prisma.payment.create({
      data: {
        userId: data.userId,
        adId: data.adId,
        amount: data.amount,
        days: data.days,
        isFeatured: data.isFeatured,
        paymentStatus: 'paid', // Since we're simulating successful payment
        paymentMethod: data.paymentMethod || 'flutterwave',
      },
      include: {
        ad: true,
        user: { select: { name: true, email: true } },
      },
    });

    // Auto-approve the ad after successful payment
    await prisma.ad.update({
      where: { id: data.adId },
      data: {
        status: 'approved',
        isFeatured: data.isFeatured,
        expiryDate: new Date(Date.now() + data.days * 24 * 60 * 60 * 1000),
      },
    });

    return payment;
  },

  /**
   * Get all payments (for admin)
   */
  async getAllPayments() {
    return prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        ad: { select: { title: true, price: true } },
      },
    });
  },

  /**
   * Get payments by user
   */
  async getUserPayments(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { ad: true },
    });
  },

  /**
   * Get single payment by ID
   */
  async getPaymentById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        user: true,
        ad: true,
      },
    });
  },

  /**
   * Simulate payment (for testing)
   */
  async simulatePayment(userId: string, adId: string, amount: number, days: number, isFeatured: boolean) {
    return this.createPayment({
      userId,
      adId,
      amount,
      days,
      isFeatured,
      paymentMethod: 'simulated',
    });
  },
};

export default paymentService;