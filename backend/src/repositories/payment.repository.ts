import { Router } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.middleware';

const paymentsRouter = Router();
const prisma = new PrismaClient();

const FLW_SECRET = process.env.FLW_SECRET_KEY!; 
paymentsRouter.post('/verify', authenticateToken, async (req: any, res: any) => {
  const { transaction_id, tx_ref, amount } = req.body;

  if (!transaction_id) {
    return res.status(400).json({ message: 'transaction_id is required' });
  }

  try {
    // 1. Call Flutterwave to verify the transaction
    const flwRes = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      { headers: { Authorization: `Bearer ${FLW_SECRET}` } }
    );

    const data = flwRes.data?.data;

    // 2. Validate status, amount and currency
    if (
      data?.status   !== 'successful' ||
      data?.tx_ref   !== tx_ref       ||
      data?.currency !== 'RWF'        ||
      data?.amount   < amount          // amount paid must be >= expected
    ) {
      return res.status(400).json({
        verified: false,
        message:  'Payment verification failed — amount or status mismatch.',
      });
    }

    // 3. Prevent duplicate: check if transaction already recorded
    const existing = await prisma.payment.findUnique({
      where: { transactionId: String(transaction_id) },
    });

    if (existing) {
      return res.json({ verified: true, paymentId: existing.id, duplicate: true });
    }

    // 4. Record payment in DB
    const payment = await prisma.payment.create({
      data: {
        transactionId:  String(transaction_id),
        transactionRef: tx_ref,
        amount:         data.amount,
        currency:       data.currency,
        paymentStatus:  'paid',
        method:         data.payment_type || 'flutterwave',
        userId:         req.user.id,
        days:           7, // Default days
      },
    });

    return res.json({ verified: true, paymentId: payment.id });

  } catch (err: any) {
    console.error('Flutterwave verify error:', err?.response?.data || err.message);
    return res.status(500).json({
      verified: false,
      message:  'Could not verify payment with Flutterwave. Please contact support.',
    });
  }
});

export { paymentsRouter };


// ────────────────────────────────────────────────────────────
//  2. AD CONTROLLER — createAd function
//     Add to: backend/controllers/ad.controller.ts
//     Then in ads.router.ts add:
//       import { createAd } from '../controllers/ad.controller';
//       router.post('/', authenticateToken, createAd);
// ────────────────────────────────────────────────────────────
import { Request, Response } from 'express';

export const createAd = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  const {
    title,
    description,
    price,
    categoryId,
    location,
    days,
    isFeatured,
    paymentId,
  } = req.body;

  // Basic validation
  if (!title?.trim())    return res.status(400).json({ message: 'Title is required.' });
  if (!location?.trim()) return res.status(400).json({ message: 'Location is required.' });
  if (!categoryId)       return res.status(400).json({ message: 'Category is required.' });

  // Calculate expiry
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + Number(days || 7));

  try {
    const ad = await prisma.ad.create({
      data: {
        title:       String(title).trim(),
        description: String(description || '').trim(),
        price:       Number(price) || 0,
        categoryId:  String(categoryId),
        location:    String(location).trim(),
        isFeatured:  Boolean(isFeatured),
        status:      'pending',
        expiryDate:  expiresAt,
        userId,
      },
      include: { category: true },
    });

    return res.status(201).json(ad);

  } catch (err: any) {
    console.error('createAd error:', err);

    if (err.code === 'P2003') {
      return res.status(400).json({ message: `Invalid categoryId: ${categoryId}` });
    }

    return res.status(500).json({ message: 'Failed to create ad. Please try again.' });
  }
};


// ────────────────────────────────────────────────────────────
//  3. UPDATED ADS ROUTER  (backend/routes/ads.ts)
//     Replace your existing router file with this
// ────────────────────────────────────────────────────────────
/*
import { Router } from 'express';
import {
  getAllAds,
  getMyAds,
  getAdsStats,
  createAd,          // ← NEW
} from '../controllers/ad.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/',       getAllAds);
router.get('/my',     authenticateToken, getMyAds);
router.get('/stats',  getAdsStats);
router.post('/',      authenticateToken, createAd);   // ← NEW — was missing!

export default router;
*/