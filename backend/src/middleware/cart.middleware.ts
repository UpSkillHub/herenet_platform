// backend/src/middleware/cart.middleware.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

/**
 * Middleware to validate cart item addition requests
 * Requirements: 5.7, 12.7, 22.2
 */
export const validateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity, variant } = req.body;

    // Validate productId
    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({
        error: 'Invalid product ID',
        message: 'Product ID must be a valid string',
      });
    }

    // Validate quantity
    if (!quantity || typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({
        error: 'Invalid quantity',
        message: 'Quantity must be a positive integer',
      });
    }

    if (!Number.isInteger(quantity)) {
      return res.status(400).json({
        error: 'Invalid quantity',
        message: 'Quantity must be an integer',
      });
    }

    // Validate variant format if provided
    if (variant !== undefined && variant !== null) {
      if (typeof variant !== 'string') {
        return res.status(400).json({
          error: 'Invalid variant',
          message: 'Variant must be a string',
        });
      }

      // Check if variant is valid JSON array or empty
      if (variant !== '[]') {
        try {
          const parsed = JSON.parse(variant);
          if (!Array.isArray(parsed)) {
            return res.status(400).json({
              error: 'Invalid variant format',
              message: 'Variant must be a JSON array string',
            });
          }
        } catch (e) {
          // If not JSON, accept as a plain string variant key
          // This allows for simple variant keys like "size:M" or "red-large"
        }
      }
    }

    // Validate product exists and is approved
    const product = await prisma.ad.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist',
      });
    }

    if (product.status !== 'approved') {
      return res.status(400).json({
        error: 'Product unavailable',
        message: 'This product is not available for purchase',
      });
    }

    // Validate inventory availability
    let availableStock = product.inventory;

    if (variant && variant !== '[]') {
      const variantStock = product.variantStock as Record<string, number> | null;
      if (variantStock && variantStock[variant] !== undefined) {
        availableStock = variantStock[variant];
      }
    }

    if (availableStock < quantity) {
      return res.status(400).json({
        error: 'Insufficient inventory',
        message:
          availableStock === 0
            ? 'This product is out of stock'
            : `Only ${availableStock} unit(s) available`,
        availableStock,
      });
    }

    // Attach validated product to request for controller use
    (req as any).validatedProduct = product;

    next();
  } catch (error: any) {
    console.error('💥 Cart Validation Error:', error);
    res.status(500).json({
      error: 'Validation failed',
      message: 'An error occurred while validating the cart item',
    });
  }
};

/**
 * Middleware to validate quantity update requests
 * Requirements: 5.7, 22.2
 */
export const validateQuantityUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { quantity } = req.body;

  if (!quantity || typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({
      error: 'Invalid quantity',
      message: 'Quantity must be a positive integer',
    });
  }

  if (!Number.isInteger(quantity)) {
    return res.status(400).json({
      error: 'Invalid quantity',
      message: 'Quantity must be an integer',
    });
  }

  next();
};

/**
 * Middleware to validate session cart format for migration
 * Requirements: 30.1
 */
export const validateSessionCart = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sessionCart } = req.body;

  if (!sessionCart) {
    return res.status(400).json({
      error: 'Missing session cart',
      message: 'Session cart data is required',
    });
  }

  if (!Array.isArray(sessionCart)) {
    return res.status(400).json({
      error: 'Invalid session cart format',
      message: 'Session cart must be an array',
    });
  }

  // Validate each cart item in session cart
  for (let i = 0; i < sessionCart.length; i++) {
    const item = sessionCart[i];

    if (!item.productId || typeof item.productId !== 'string') {
      return res.status(400).json({
        error: 'Invalid session cart item',
        message: `Item at index ${i} has invalid productId`,
      });
    }

    if (
      !item.quantity ||
      typeof item.quantity !== 'number' ||
      item.quantity < 1 ||
      !Number.isInteger(item.quantity)
    ) {
      return res.status(400).json({
        error: 'Invalid session cart item',
        message: `Item at index ${i} has invalid quantity`,
      });
    }

    if (
      item.variant !== undefined &&
      item.variant !== null &&
      typeof item.variant !== 'string'
    ) {
      return res.status(400).json({
        error: 'Invalid session cart item',
        message: `Item at index ${i} has invalid variant format`,
      });
    }
  }

  next();
};
