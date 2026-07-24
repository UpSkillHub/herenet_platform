// backend/src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../lib/prisma';

const FLW_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const FLW_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY;

export const initializePayment = async (req: Request, res: Response) => {
  try {
    const userId = String((req as any).user?.userId || (req as any).user?.id);
    const { days = 1 } = req.body;
    const { amount, email, name, adId } = req.body;

    if (!amount || !email) {
      return res.status(400).json({ message: 'Amount and email are required' });
    }

    const transactionRef = `herenet-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: transactionRef,
        amount: Number(amount),
        currency: 'RWF', // or USD, NGN based on your location
        redirect_url: `${process.env.FRONTEND_URL}/payment/callback`,
        customer: {
          email,
          name: name || 'Customer',
        },
        customizations: {
          title: 'HereNet Platform',
          description: adId ? `Payment for Ad #${adId}` : 'Account Payment',
          logo: `${process.env.FRONTEND_URL}/logo.png`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Save payment record
    await prisma.payment.create({
      data: {
        transactionRef,
        amount: Number(amount),
        days: Number(days),
        paymentStatus: 'pending',
        user: {
          connect: { id: userId },
        },
        ad: adId ? { connect: { id: String(adId) } } : undefined,
      },
    });

    return res.json({ 
      success: true,
      paymentLink: response.data.data.link,
      transactionRef,
    });
    
  } catch (error: any) {
    console.error('💥 Payment initialization error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Response data:', error.response?.data);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    return res.status(500).json({ 
      message: 'Payment initialization failed', 
      error: error.response?.data?.message || error.message 
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;

    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status === 'success') {
      // Update payment status
      await prisma.payment.update({
        where: { transactionRef: response.data.data.tx_ref },
        data: {
          paymentStatus: 'completed',
          flutterwaveReference: response.data.data.id,
        },
      });

      // If payment is for an ad, mark it as paid
      const payment = await prisma.payment.findUnique({
        where: { transactionRef: response.data.data.tx_ref }
      });

      if (payment?.adId) {
        await prisma.ad.update({
          where: { id: payment.adId },
          data: { isPaid: true }
        });
      }
    }

    return res.json({
      success: response.data.status === 'success',
      data: response.data.data
    });
    
  } catch (error: any) {
    console.error('💥 Payment verification error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Response data:', error.response?.data);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    return res.status(500).json({ message: 'Verification failed' });
  }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const transactionRef = Array.isArray(req.params.transactionRef)
      ? req.params.transactionRef[0]
      : req.params.transactionRef;
    
    const payment = await prisma.payment.findUnique({
      where: { transactionRef },
      include: { ad: true, user: true }
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error: any) {
    console.error('💥 Get payment status error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Failed to fetch payment status' });
  }
};