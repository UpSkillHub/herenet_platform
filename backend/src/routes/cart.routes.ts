// backend/src/routes/cart.routes.ts
import { Router } from 'express';
import cartController from '../controllers/cart.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  validateCartItem,
  validateQuantityUpdate,
  validateSessionCart,
} from '../middleware/cart.middleware';

const router = Router();

/**
 * All cart routes require authentication
 * Requirements: 4.1, 5.1, 5.3, 5.5, 30.1
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get('/', authenticateToken, cartController.getCart);

/**
 * @swagger
 * /api/cart/count:
 *   get:
 *     summary: Get cart item count
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart count retrieved
 */
router.get('/count', authenticateToken, cartController.getCartItemCount);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               variant:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Invalid request or insufficient inventory
 *       401:
 *         description: Authentication required
 */
router.post('/items', authenticateToken, validateCartItem, cartController.addItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item updated
 *       400:
 *         description: Invalid quantity or insufficient inventory
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Cart item not found
 */
router.put('/items/:itemId', authenticateToken, validateQuantityUpdate, cartController.updateItemQuantity);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Cart item not found
 */
router.delete('/items/:itemId', authenticateToken, cartController.removeItem);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear all items from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *       401:
 *         description: Authentication required
 */
router.delete('/clear', authenticateToken, cartController.clearCart);

/**
 * @swagger
 * /api/cart/migrate:
 *   post:
 *     summary: Migrate session cart to persistent cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionCart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     variant:
 *                       type: string
 *     responses:
 *       200:
 *         description: Session cart migrated successfully
 *       400:
 *         description: Invalid session cart format
 *       401:
 *         description: Authentication required
 */
router.post('/migrate', authenticateToken, validateSessionCart, cartController.migrateSessionCart);

export default router;
