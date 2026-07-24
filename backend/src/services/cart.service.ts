// backend/src/services/cart.service.ts
import prisma from '../config/database';
import { Prisma } from '@prisma/client';

interface CartItemInput {
  productId: string;
  quantity: number;
  variant?: string;
}

interface SessionCartItem {
  productId: string;
  quantity: number;
  variant?: string;
}

const cartService = {
  /**
   * Create a new cart for a user
   * Requirement 5.1: Store Persistent_Cart in database
   */
  async createCart(userId: string) {
    const cart = await prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                user: true,
              },
            },
          },
        },
      },
    });

    return cart;
  },

  /**
   * Get cart for authenticated user
   * Requirement 5.1: Retrieve Persistent_Cart from database
   */
  async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                user: true,
              },
            },
          },
        },
      },
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await this.createCart(userId);
    }

    // Requirement 5.5: Validate inventory for each cart item
    const validatedItems = await this.validateCartInventory(cart.items);

    return {
      ...cart,
      items: validatedItems,
    };
  },

  /**
   * Validate cart items against current inventory
   * Requirement 5.5: Validate inventory availability and adjust quantities
   */
  async validateCartInventory(items: any[]) {
    const validatedItems = [];

    for (const item of items) {
      const product = item.product;

      // Check if product is still available and approved
      if (product.status !== 'approved') {
        // Mark item as unavailable but keep in response for user info
        validatedItems.push({
          ...item,
          availabilityWarning: 'Product is no longer available',
          isAvailable: false,
        });
        continue;
      }

      // Check inventory
      let availableStock = product.inventory;

      // If variant exists, check variant-specific stock
      if (item.variant && item.variant !== '[]') {
        const variantKey = item.variant;
        const variantStock = product.variantStock as Record<string, number> | null;

        if (variantStock && variantStock[variantKey] !== undefined) {
          availableStock = variantStock[variantKey];
        }
      }

      // Requirement 5.5: If inventory less than requested, display warning and adjust
      if (availableStock < item.quantity) {
        validatedItems.push({
          ...item,
          availabilityWarning:
            availableStock === 0
              ? 'Product is out of stock'
              : `Only ${availableStock} units available. Quantity adjusted.`,
          suggestedQuantity: availableStock,
          isAvailable: availableStock > 0,
        });
      } else {
        validatedItems.push({
          ...item,
          isAvailable: true,
        });
      }
    }

    return validatedItems;
  },

  /**
   * Add item to cart with inventory validation
   * Requirement 4.1 & 5.1: Add products to cart
   * Requirement 5.3: Save to Persistent_Cart immediately
   */
  async addItem(userId: string, itemData: CartItemInput) {
    const { productId, quantity, variant } = itemData;

    // Validate product exists and is approved
    const product = await prisma.ad.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.status !== 'approved') {
      throw new Error('Product is not available for purchase');
    }

    // Validate inventory availability
    let availableStock = product.inventory;
    const variantStr = variant || '[]';

    if (variant && variant !== '[]') {
      const variantStock = product.variantStock as Record<string, number> | null;
      if (variantStock && variantStock[variant] !== undefined) {
        availableStock = variantStock[variant];
      }
    }

    if (availableStock < quantity) {
      throw new Error(
        `Insufficient inventory. Only ${availableStock} units available.`
      );
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item with same variant already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variant: variantStr,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      const newQuantity = existingItem.quantity + quantity;

      // Validate new quantity against inventory
      if (newQuantity > availableStock) {
        throw new Error(
          `Cannot add ${quantity} more. Maximum ${availableStock} units available.`
        );
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          variant: variantStr,
        },
      });
    }

    // Return updated cart
    return this.getCart(userId);
  },

  /**
   * Update item quantity in cart
   * Requirement 5.3: Update quantities in Persistent_Cart
   */
  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    // Get cart item and verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    if (cartItem.cart.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Validate inventory
    let availableStock = cartItem.product.inventory;

    if (cartItem.variant && cartItem.variant !== '[]') {
      const variantStock = cartItem.product.variantStock as Record<string, number> | null;
      if (variantStock && variantStock[cartItem.variant] !== undefined) {
        availableStock = variantStock[cartItem.variant];
      }
    }

    if (quantity > availableStock) {
      throw new Error(
        `Insufficient inventory. Only ${availableStock} units available.`
      );
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(userId);
  },

  /**
   * Remove item from cart
   * Requirement 5.3: Remove products from Persistent_Cart
   */
  async removeItem(userId: string, itemId: string) {
    // Verify cart item ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    if (cartItem.cart.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Delete item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  },

  /**
   * Clear all items from cart
   * Used after successful order creation
   */
  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return { success: true };
    }

    // Delete all cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { success: true };
  },

  /**
   * Migrate session cart to persistent cart on login/registration
   * Requirement 30.1: Migrate Session_Cart to Persistent_Cart
   */
  async migrateSessionCart(userId: string, sessionCart: SessionCartItem[]) {
    if (!sessionCart || sessionCart.length === 0) {
      return this.getCart(userId);
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // Process each session cart item
    for (const sessionItem of sessionCart) {
      try {
        // Validate product exists and is available
        const product = await prisma.ad.findUnique({
          where: { id: sessionItem.productId },
        });

        if (!product || product.status !== 'approved') {
          // Skip unavailable products
          continue;
        }

        // Validate inventory
        const variantStr = sessionItem.variant || '[]';
        let availableStock = product.inventory;

        if (sessionItem.variant && sessionItem.variant !== '[]') {
          const variantStock = product.variantStock as Record<string, number> | null;
          if (variantStock && variantStock[sessionItem.variant] !== undefined) {
            availableStock = variantStock[sessionItem.variant];
          }
        }

        if (availableStock < 1) {
          // Skip out-of-stock products
          continue;
        }

        // Check if item already exists in persistent cart
        const existingItem = await prisma.cartItem.findFirst({
          where: {
            cartId: cart.id,
            productId: sessionItem.productId,
            variant: variantStr,
          },
        });

        if (existingItem) {
          // Requirement 30.1: Merge carts - combine quantities for duplicates
          const newQuantity = existingItem.quantity + sessionItem.quantity;
          const finalQuantity = Math.min(newQuantity, availableStock);

          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: finalQuantity },
          });
        } else {
          // Add new item
          const finalQuantity = Math.min(sessionItem.quantity, availableStock);

          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: sessionItem.productId,
              quantity: finalQuantity,
              variant: variantStr,
            },
          });
        }
      } catch (error) {
        // Log error but continue with other items
        console.error(`Error migrating cart item ${sessionItem.productId}:`, error);
        continue;
      }
    }

    // Requirement 30.1: Validate inventory for all migrated items
    return this.getCart(userId);
  },

  /**
   * Get cart item count for header display
   */
  async getCartItemCount(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return 0;
    }

    return cart.items.reduce((total, item) => total + item.quantity, 0);
  },

  /**
   * Calculate cart totals
   */
  async getCartTotals(userId: string) {
    const cartData = await this.getCart(userId);

    let subtotal = 0;
    let estimatedShipping = 0;

    for (const item of cartData.items) {
      if (item.isAvailable) {
        const itemPrice = item.product.price;
        const itemQuantity = item.quantity;
        subtotal += itemPrice * itemQuantity;
        estimatedShipping += item.product.shippingFee || 0;
      }
    }

    const serviceFee = subtotal * 0.02; // 2% service fee for buyers
    const total = subtotal + estimatedShipping + serviceFee;

    return {
      subtotal,
      estimatedShipping,
      serviceFee,
      total,
      itemCount: cartData.items.length,
    };
  },
};

export default cartService;
