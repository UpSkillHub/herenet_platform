// backend/src/services/product.service.ts

import prisma from '../config/database';

/**
 * Product service
 * Handles all product-related business logic.
 */
const productService = {

  // =====================================================
  // CREATE PRODUCT
  // =====================================================

  async createProduct(data: any) {

    const {
      name,
      description,
      price,
      originalPrice,
      image,
      categoryId,
      vendorId,
      stock,
      rating,
      isSponsored
    } = data;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        originalPrice,
        image,
        categoryId,
        vendorId,
        stock: stock || 0,
        rating: rating || 0,
        isSponsored: isSponsored || false
      }
    });

    return product;
  },


  // =====================================================
  // GET ALL PRODUCTS
  // =====================================================

  async getProducts(filters?: {
    categoryId?: string;
    vendorId?: string;
    search?: string;
    isSponsored?: boolean;
  }) {

    const where: any = {};

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.vendorId) {
      where.vendorId = filters.vendorId;
    }

    if (filters?.isSponsored !== undefined) {
      where.isSponsored = filters.isSponsored;
    }

    if (filters?.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive'
      };
    }

    const products = await prisma.product.findMany({
      where,

      orderBy: {
        createdAt: 'desc'
      }
    });

    return products;
  },


  // =====================================================
  // GET SINGLE PRODUCT
  // =====================================================

  async getProductById(productId: string) {

    const product = await prisma.product.findUnique({
      where: {
        id: productId
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  },


  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  async updateProduct(
    productId: string,
    data: any
  ) {

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: productId
        }
      });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const product = await prisma.product.update({
      where: {
        id: productId
      },

      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        image: data.image,
        categoryId: data.categoryId,
        stock: data.stock,
        rating: data.rating,
        isSponsored: data.isSponsored
      }
    });

    return product;
  },


  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  async deleteProduct(productId: string) {

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: productId
        }
      });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    await prisma.product.delete({
      where: {
        id: productId
      }
    });

    return {
      success: true
    };
  },


  // =====================================================
  // UPDATE STOCK
  // =====================================================

  async updateStock(
    productId: string,
    stock: number
  ) {

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId
        }
      });

    if (!product) {
      throw new Error('Product not found');
    }

    if (stock < 0) {
      throw new Error(
        'Stock cannot be negative'
      );
    }

    const updatedProduct =
      await prisma.product.update({
        where: {
          id: productId
        },

        data: {
          stock
        }
      });

    return updatedProduct;
  },


  // =====================================================
  // UPDATE PRICE
  // =====================================================

  async updatePrice(
    productId: string,
    price: number
  ) {

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId
        }
      });

    if (!product) {
      throw new Error('Product not found');
    }

    if (price < 0) {
      throw new Error(
        'Price cannot be negative'
      );
    }

    return await prisma.product.update({
      where: {
        id: productId
      },

      data: {
        price
      }
    });
  },


  // =====================================================
  // UPDATE PRODUCT STATUS
  // =====================================================

  async updateProductStatus(
    productId: string,
    isSponsored: boolean
  ) {

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId
        }
      });

    if (!product) {
      throw new Error('Product not found');
    }

    return await prisma.product.update({
      where: {
        id: productId
      },

      data: {
        isSponsored
      }
    });
  },


  // =====================================================
  // GET PRODUCTS BY CATEGORY
  // =====================================================

  async getProductsByCategory(
    categoryId: string
  ) {

    return await prisma.product.findMany({
      where: {
        categoryId
      },

      orderBy: {
        createdAt: 'desc'
      }
    });
  },


  // =====================================================
  // GET PRODUCTS BY VENDOR
  // =====================================================

  async getProductsByVendor(
    vendorId: string
  ) {

    return await prisma.product.findMany({
      where: {
        vendorId
      },

      orderBy: {
        createdAt: 'desc'
      }
    });
  }

};


export default productService;