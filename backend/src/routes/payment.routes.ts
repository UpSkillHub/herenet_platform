import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
	initializePayment,
	verifyPayment,
	getPaymentStatus,
} from '../controllers/payment.controller';

const router = express.Router();

/**
 * @swagger
 * /api/payments/initialize:
 *   post:
 *     summary: Initialize a Flutterwave payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               adId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 */
router.post('/initialize', authenticateToken, initializePayment);

/**
 * @swagger
 * /api/payments/verify/{transactionId}:
 *   get:
 *     summary: Verify a payment transaction
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment verification result
 */
router.get('/verify/:transactionId', verifyPayment);

/**
 * @swagger
 * /api/payments/status/{transactionRef}:
 *   get:
 *     summary: Get payment status by transaction reference
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionRef
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment status returned
 *       404:
 *         description: Payment not found
 */
router.get('/status/:transactionRef', authenticateToken, getPaymentStatus);

export default router;