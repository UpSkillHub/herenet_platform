// backend/src/controllers/cart.controller.ts
import { Request, Response } from 'express';
import cartService from '../services/cart.service';

/**
 * Cart controller for managing shopping cart operations
 * Requirements: 4.1, 5.1, 5.3, 5.5, 30.1
 */
const cartController = {
  /**
   * GET /api/cart
   * Get current user's cart with inventory validation
   * Requirement 5.1: Retrieve Persistent_Cart
   */
  async getCart(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const cart = await cartService.getCart(userId);
      const totals = await cartService.getCartTotals(userId);

      res.json({
        cart,
        totals,
      });
    } catch (error: any) {
      console.error('💥 Get Cart Error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch cart' });
    }
  },

  /**
   * POST /api/cart/items
   * Add item to cart with inventory validation
   * Requirements: 4.1, 5.1, 5.3
   */
  async addItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const { productId, quantity, variant } = req.body;

      if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
      }

      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
      }

      const cart = await cartService.addItem(userId, {
        productId,
        quantity,
        variant,
      });

      res.status(201).json({
        message: 'Item added to cart',
        cart,
      });
    } catch (error: any) {
      console.error('💥 Add to Cart Error:', error);

      if (
        error.message.includes('not found') ||
        error.message.includes('not available')
      ) {
        return res.status(404).json({ message: error.message });
      }

      if (error.message.includes('Insufficient inventory')) {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({ message: error.message || 'Failed to add item to cart' });
    }
  },

  /**
   * PUT /api/cart/items/:itemId
   * Update cart item quantity
   * Requirement 5.3: Update quantities in cart
   */
  async updateItemQuantity(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const itemId = Array.isArray(req.params.itemId) 
        ? req.params.itemId[0] 
        : req.params.itemId;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
      }

      const cart = await cartService.updateItemQuantity(userId, itemId, quantity);

      res.json({
        message: 'Cart item updated',
        cart,
      });
    } catch (error: any) {
      console.error('💥 Update Cart Item Error:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }

      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({ message: error.message });
      }

      if (error.message.includes('Insufficient inventory')) {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({ message: error.message || 'Failed to update cart item' });
    }
  },

  /**
   * DELETE /api/cart/items/:itemId
   * Remove item from cart
   * Requirement 5.3: Remove products from cart
   */
  async removeItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const itemId = Array.isArray(req.params.itemId) 
        ? req.params.itemId[0] 
        : req.params.itemId;

      const cart = await cartService.removeItem(userId, itemId);

      res.json({
        message: 'Item removed from cart',
        cart,
      });
    } catch (error: any) {
      console.error('💥 Remove Cart Item Error:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }

      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({ message: error.message });
      }

      res.status(500).json({ message: error.message || 'Failed to remove item from cart' });
    }
  },

  /**
   * DELETE /api/cart/clear
   * Clear all items from cart
   */
  async clearCart(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      await cartService.clearCart(userId);

      res.json({
        message: 'Cart cleared',
        success: true,
      });
    } catch (error: any) {
      console.error('💥 Clear Cart Error:', error);
      res.status(500).json({ message: error.message || 'Failed to clear cart' });
    }
  },

  /**
   * POST /api/cart/migrate
   * Migrate session cart to persistent cart on login
   * Requirement 30.1: Migrate Session_Cart to Persistent_Cart
   */
  async migrateSessionCart(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const { sessionCart } = req.body;

      if (!Array.isArray(sessionCart)) {
        return res.status(400).json({ message: 'Invalid session cart format' });
      }

      const cart = await cartService.migrateSessionCart(userId, sessionCart);

      res.json({
        message: 'Session cart migrated successfully',
        cart,
      });
    } catch (error: any) {
      console.error('💥 Migrate Cart Error:', error);
      res.status(500).json({ message: error.message || 'Failed to migrate cart' });
    }
  },

  /**
   * GET /api/cart/count
   * Get cart item count for header badge
   */
  async getCartItemCount(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.json({ count: 0 });
      }

      const count = await cartService.getCartItemCount(userId);

      res.json({ count });
    } catch (error: any) {
      console.error('💥 Get Cart Count Error:', error);
      res.status(500).json({ message: error.message || 'Failed to get cart count' });
    }
  },
};

export default cartController;
