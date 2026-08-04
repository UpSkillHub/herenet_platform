// backend/src/controllers/product.controller.ts

import { Request, Response } from 'express';
import productService from '../services/products.Services';

/**
 * Product controller
 *
 * Handles HTTP requests related to products.
 *
 * Product management includes:
 * - Creating products
 * - Getting products
 * - Getting a single product
 * - Updating products
 * - Deleting products
 * - Updating stock
 * - Updating price
 * - Managing sponsored status
 */
const productController = {

  // =====================================================
  // CREATE PRODUCT
  // =====================================================

  /**
   * POST /api/products
   *
   * Create a new product.
   */
  async createProduct(req: Request, res: Response) {

    try {

      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: 'Authentication required'
        });
      }

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
      } = req.body;


      // -------------------------------------------------
      // VALIDATION
      // -------------------------------------------------

      if (!name) {
        return res.status(400).json({
          message: 'Product name is required'
        });
      }

      if (price === undefined || price === null) {
        return res.status(400).json({
          message: 'Product price is required'
        });
      }

      if (!categoryId) {
        return res.status(400).json({
          message: 'Category ID is required'
        });
      }

      if (stock !== undefined && stock < 0) {
        return res.status(400).json({
          message: 'Stock cannot be negative'
        });
      }


      // -------------------------------------------------
      // CREATE
      // -------------------------------------------------

      const product =
        await productService.createProduct({
          name,
          description,
          price,
          originalPrice,
          image,
          categoryId,
          vendorId: vendorId || userId,
          stock,
          rating,
          isSponsored
        });


      return res.status(201).json({
        message: 'Product created successfully',
        product
      });

    } catch (error: any) {

      console.error(
        '💥 Create Product Error:',
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          'Failed to create product'
      });
    }
  },


  // =====================================================
  // GET ALL PRODUCTS
  // =====================================================

  /**
   * GET /api/products
   *
   * Get all products.
   *
   * Optional query parameters:
   *
   * ?categoryId=...
   * ?vendorId=...
   * ?search=...
   * ?isSponsored=true
   */
  async getProducts(req: Request, res: Response) {

    try {

      const {
        categoryId,
        vendorId,
        search,
        isSponsored
      } = req.query;


      const filters: any = {};


      if (categoryId) {
        filters.categoryId =
          String(categoryId);
      }


      if (vendorId) {
        filters.vendorId =
          String(vendorId);
      }


      if (search) {
        filters.search =
          String(search);
      }


      if (isSponsored !== undefined) {

        filters.isSponsored =
          String(isSponsored) === 'true';

      }


      const products =
        await productService.getProducts(
          filters
        );


      return res.json({
        products,
        count: products.length
      });

    } catch (error: any) {

      console.error(
        '💥 Get Products Error:',
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          'Failed to fetch products'
      });
    }
  },


  // =====================================================
  // GET SINGLE PRODUCT
  // =====================================================

  /**
   * GET /api/products/:productId
   */
  async getProductById(
    req: Request,
    res: Response
  ) {

    try {

      const productId =
        Array.isArray(req.params.productId)
          ? req.params.productId[0]
          : req.params.productId;


      if (!productId) {
        return res.status(400).json({
          message: 'Product ID is required'
        });
      }


      const product =
        await productService.getProductById(
          productId
        );


      return res.json({
        product
      });

    } catch (error: any) {

      console.error(
        '💥 Get Product Error:',
        error
      );


      if (
        error.message
          ?.toLowerCase()
          .includes('not found')
      ) {

        return res.status(404).json({
          message: error.message
        });

      }


      return res.status(500).json({
        message:
          error.message ||
          'Failed to fetch product'
      });
    }
  },


  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  /**
   * PUT /api/products/:productId
   */
  async updateProduct(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        (req as any).user?.userId;


      if (!userId) {
        return res.status(401).json({
          message: 'Authentication required'
        });
      }


      const productId =
        Array.isArray(req.params.productId)
          ? req.params.productId[0]
          : req.params.productId;


      if (!productId) {
        return res.status(400).json({
          message: 'Product ID is required'
        });
      }


      const {
        name,
        description,
        price,
        originalPrice,
        image,
        categoryId,
        stock,
        rating,
        isSponsored
      } = req.body;


      // -------------------------------------------------
      // BASIC VALIDATION
      // -------------------------------------------------

      if (
        price !== undefined &&
        price < 0
      ) {

        return res.status(400).json({
          message: 'Price cannot be negative'
        });

      }


      if (
        stock !== undefined &&
        stock < 0
      ) {

        return res.status(400).json({
          message: 'Stock cannot be negative'
        });

      }


      const product =
        await productService.updateProduct(
          productId,
          {
            name,
            description,
            price,
            originalPrice,
            image,
            categoryId,
            stock,
            rating,
            isSponsored
          }
        );


      return res.json({
        message:
          'Product updated successfully',
        product
      });

    } catch (error: any) {

      console.error(
        '💥 Update Product Error:',
        error
      );


      if (
        error.message
          ?.toLowerCase()
          .includes('not found')
      ) {

        return res.status(404).json({
          message: error.message
        });

      }


      return res.status(500).json({
        message:
          error.message ||
          'Failed to update product'
      });
    }
  },


  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  /**
   * DELETE /api/products/:productId
   */
  async deleteProduct(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        (req as any).user?.userId;


      if (!userId) {
        return res.status(401).json({
          message: 'Authentication required'
        });
      }


      const productId =
        Array.isArray(req.params.productId)
          ? req.params.productId[0]
          : req.params.productId;


      if (!productId) {
        return res.status(400).json({
          message: 'Product ID is required'
        });
      }


      await productService.deleteProduct(
        productId
      );


      return res.json({
        message:
          'Product deleted successfully',
        success: true
      });

    } catch (error: any) {

      console.error(
        '💥 Delete Product Error:',
        error
      );


      if (
        error.message
          ?.toLowerCase()
          .includes('not found')
      ) {

        return res.status(404).json({
          message: error.message
        });

      }


      return res.status(500).json({
        message:
          error.message ||
          'Failed to delete product'
      });
    }
  },


  // =====================================================
  // UPDATE STOCK
  // =====================================================

  /**
   * PATCH /api/products/:productId/stock
   */
  async updateStock(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        (req as any).user?.userId;


      if (!userId) {
        return res.status(401).json({
          message: 'Authentication required'
        });
      }


      const productId =
        Array.isArray(req.params.productId)
          ? req.params.productId[0]
          : req.params.productId;


      const { stock } = req.body;


      if (stock === undefined) {
        return res.status(400).json({
          message: 'Stock is required'
        });
      }


      if (
        typeof stock !== 'number' ||
        stock < 0
      ) {

        return res.status(400).json({
          message:
            'Stock must be a number greater than or equal to 0'
        });

      }


      const product =
        await productService.updateStock(
          productId,
          stock
        );


      return res.json({
        message:
          'Product stock updated successfully',
        product
      });

    } catch (error: any) {

      console.error(
        '💥 Update Product Stock Error:',
        error
      );


      if (
        error.message
          ?.toLowerCase()
          .includes('not found')
      ) {

        return res.status(404).json({
          message: error.message
        });

      }


      return res.status(500).json({
        message:
          error.message ||
          'Failed to update product stock'
      });
    }
  },


  // =====================================================
  // UPDATE PRICE
  // =====================================================

  /**
   * PATCH /api/products/:productId/price
   */
  async updatePrice(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        (req as any).user?.userId;


      if (!userId) {
        return res.status(401).json({
          message: 'Authentication required'
        });
      }


      const productId =
        Array.isArray(req.params.productId)
          ? req.params.productId[0]
          : req.params.productId;


      const { price } = req.body;


      if (price === undefined) {
        return res.status(400).json({
          message: 'Price is required'
        });
      }


      if (
        typeof price !== 'number' ||
        price < 0
      ) {

        return res.status(400).json({
          message:
            'Price must be a number greater than or equal to 0'
        });

      }


      const product =
        await productService.updatePrice(
          productId,
          price
        );


      return res.json({
        message:
          'Product price updated successfully',
        product
      });

    } catch (error: any) {

      console.error(
        '💥 Update Product Price Error:',
        error
      );


      if (
        error.message
          ?.toLowerCase()
          .includes('not found')
      ) {

        return res.status(404).json({
          message: error.message
        });

      }


      return res.status(500).json({
        message:
          error.message ||
          'Failed to update product price'
      });
    }
  },


  // =====================================================
  // UPDATE SPONSORED STATUS
  // =====================================================

  /**
   * PATCH /api/products/:productId/sponsored
   */
  async updateSponsoredStatus(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        (req as any).user?.userId;


      if (!userId) {
        return res.status(401).json({
          message: 'Authentication required'
        });
      }


      const productId =
        Array.isArray(req.params.productId)
          ? req.params.productId[0]
          : req.params.productId;


      const { isSponsored } = req.body;


      if (
        typeof isSponsored !== 'boolean'
      ) {

        return res.status(400).json({
          message:
            'isSponsored must be a boolean'
        });

      }


      const product =
        await productService.updateProductStatus(
          productId,
          isSponsored
        );


      return res.json({
        message:
          'Product sponsored status updated successfully',
        product
      });

    } catch (error: any) {

      console.error(
        '💥 Update Sponsored Status Error:',
        error
      );


      if (
        error.message
          ?.toLowerCase()
          .includes('not found')
      ) {

        return res.status(404).json({
          message: error.message
        });

      }


      return res.status(500).json({
        message:
          error.message ||
          'Failed to update sponsored status'
      });
    }
  },


  // =====================================================
  // GET PRODUCTS BY CATEGORY
  // =====================================================

  /**
   * GET /api/products/category/:categoryId
   */
  async getProductsByCategory(
    req: Request,
    res: Response
  ) {

    try {

      const categoryId =
        Array.isArray(req.params.categoryId)
          ? req.params.categoryId[0]
          : req.params.categoryId;


      if (!categoryId) {
        return res.status(400).json({
          message: 'Category ID is required'
        });
      }


      const products =
        await productService.getProductsByCategory(
          categoryId
        );


      return res.json({
        products,
        count: products.length
      });

    } catch (error: any) {

      console.error(
        '💥 Get Category Products Error:',
        error
      );


      return res.status(500).json({
        message:
          error.message ||
          'Failed to fetch category products'
      });
    }
  },


  // =====================================================
  // GET PRODUCTS BY VENDOR
  // =====================================================

  /**
   * GET /api/products/vendor/:vendorId
   */
  async getProductsByVendor(
    req: Request,
    res: Response
  ) {

    try {

      const vendorId =
        Array.isArray(req.params.vendorId)
          ? req.params.vendorId[0]
          : req.params.vendorId;


      if (!vendorId) {
        return res.status(400).json({
          message: 'Vendor ID is required'
        });
      }


      const products =
        await productService.getProductsByVendor(
          vendorId
        );


      return res.json({
        products,
        count: products.length
      });

    } catch (error: any) {

      console.error(
        '💥 Get Vendor Products Error:',
        error
      );


      return res.status(500).json({
        message:
          error.message ||
          'Failed to fetch vendor products'
      });
    }
  }

};


export default productController;