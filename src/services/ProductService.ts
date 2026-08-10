import { supabase } from '@/integrations/supabase/client';
import { Product, DbProduct } from '@/lib/utils';

export type ProductCategory = {
  id: string;
  name: string;
};

/**
 * Convert a Supabase database product into
 * the Product format used by the frontend.
 */
export const mapDbProductToProduct = (
  dbProduct: DbProduct
): Product => {
  return {
    id: dbProduct.id,

    name: dbProduct.name,

    description: dbProduct.description || '',

    price: Number(dbProduct.price),

    stock: Number(dbProduct.stock ?? 0),

    image: dbProduct.image_url || '',

    category: dbProduct.categories
      ? {
          id: dbProduct.categories.id,
          name: dbProduct.categories.name,
        }
      : {
          id: 'uncategorized',
          name: 'Uncategorized',
        },

    rating:
      dbProduct.ratings &&
      dbProduct.ratings.length > 0
        ? Number(dbProduct.ratings[0].average_rating || 0)
        : 0,

    discount: 0,

    new: false,

    featured: dbProduct.featured ?? false,

    // Do not rely on frontend calculation here.
    // This comes from PostgreSQL generated column.
    inStock: dbProduct.in_stock ?? false,

    specifications: {},
  };
};

/**
 * Fetch products
 */
export const fetchProducts = async (
  {
    category = '',
    search = '',
    minPrice = 0,
    maxPrice = 0,
    inStock = true,
    featured = false,
    isNew = false,
    page = 1,
    limit = 12,
    sortBy = 'name',
    sortOrder = 'asc',
  } = {}
) => {
  let query = supabase
    .from('products')
    .select(
      `
        *,
        categories:category_id (
          id,
          name
        ),
        ratings:product_ratings (
          average_rating,
          review_count
        )
      `,
      { count: 'exact' }
    );

  /**
   * Category filter
   */
  if (category) {
    query = query.eq('category_id', category);
  }

  /**
   * Search
   */
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  /**
   * Minimum price
   */
  if (minPrice > 0) {
    query = query.gte('price', minPrice);
  }

  /**
   * Maximum price
   */
  if (maxPrice > 0) {
    query = query.lte('price', maxPrice);
  }

  /**
   * Stock filter
   */
  if (inStock !== null) {
    query = query.eq('in_stock', inStock);
  }

  /**
   * Featured products
   */
  if (featured) {
    query = query.eq('featured', true);
  }

  /**
   * IMPORTANT:
   * Your database does NOT have an `is_new` column.
   *
   * Therefore we do not filter by `is_new`.
   */

  /**
   * Sorting
   */
  const allowedSortFields = [
    'name',
    'price',
    'created_at',
    'stock',
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : 'name';

  query = query.order(safeSortBy, {
    ascending: sortOrder === 'asc',
  });

  /**
   * Pagination
   */
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const {
    data,
    error,
    count,
  } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.message);
  }

  const products =
    data?.map((product) =>
      mapDbProductToProduct(product as DbProduct)
    ) || [];

  return {
    products,
    count: count || 0,
    page,
    limit,
    totalPages: count
      ? Math.ceil(count / limit)
      : 0,
  };
};


/**
 * Fetch one product by ID
 */
export const fetchProductById = async (
  productId: string
): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
        *,
        categories:category_id (
          id,
          name
        ),
        ratings:product_ratings (
          average_rating,
          review_count
        )
      `
    )
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Product not found');
  }

  return mapDbProductToProduct(data as DbProduct);
};


/**
 * Create a product
 *
 * IMPORTANT:
 * This converts the frontend Product object
 * into the actual Supabase products table structure.
 */
export const createProduct = async (
  product: Omit<Product, 'id'>
): Promise<Product> => {

  /**
   * Make sure a category was selected.
   */
  if (!product.category?.id) {
    throw new Error('Please select a category.');
  }

  /**
   * This object MUST only contain columns
   * that actually exist in the products table.
   */
  const dbProduct = {
  name: product.name,

  description:
    product.description || null,

  price: Number(product.price),

  stock:
    product.stock ?? 0,

  image_url:
    product.image || null,

  category_id:
    product.category.id,

  featured:
    product.featured ?? false,
};

  console.log(
    'Product being sent to Supabase:',
    dbProduct
  );

  const {
    data,
    error,
  } = await supabase
    .from('products')
    .insert(dbProduct)
    .select(
      `
        *,
        categories:category_id (
          id,
          name
        ),
        ratings:product_ratings (
          average_rating,
          review_count
        )
      `
    )
    .single();

  if (error) {
    console.error(
      'Error creating product:',
      error
    );

    console.error(
      'Supabase error details:',
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw new Error(error.message);
  }

  return mapDbProductToProduct(
    data as DbProduct
  );
};


/**
 * Update product
 */
export const updateProduct = async (
  productId: string,
  productData: Partial<Product> & {
    category_id?: string;
  }
): Promise<Product> => {

  const dbProduct: Record<string, any> = {};

  // Name
  if (productData.name !== undefined) {
    dbProduct.name = productData.name;
  }

  // Description
  if (productData.description !== undefined) {
    dbProduct.description =
      productData.description || null;
  }

  // Price
  if (productData.price !== undefined) {
    dbProduct.price = Number(productData.price);
  }

  // Image
  if (productData.image !== undefined) {
    dbProduct.image_url =
      productData.image || null;
  }

  // Category
  if (productData.category_id !== undefined) {
    dbProduct.category_id =
      productData.category_id;
  } else if (productData.category?.id) {
    dbProduct.category_id =
      productData.category.id;
  }

  // ==========================================
  // STOCK
  // ==========================================
  // IMPORTANT:
  // Do NOT update `in_stock`.
  //
  // `in_stock` is generated by PostgreSQL:
  //
  // stock > 0 => true
  // stock = 0 => false
  //
  if (productData.stock !== undefined) {
    const stock = Math.max(
      0,
      Number(productData.stock)
    );

    dbProduct.stock = stock;
  }

  // Featured
  if (productData.featured !== undefined) {
    dbProduct.featured =
      productData.featured;
  }

  console.log(
    'Product update being sent to Supabase:',
    dbProduct
  );

  const {
    data,
    error,
  } = await supabase
    .from('products')
    .update(dbProduct)
    .eq('id', productId)
    .select(
      `
        *,
        categories:category_id (
          id,
          name
        ),
        ratings:product_ratings (
          average_rating,
          review_count
        )
      `
    )
    .single();

  if (error) {
    console.error(
      'Error updating product:',
      error
    );

    throw new Error(error.message);
  }

  return mapDbProductToProduct(
    data as DbProduct
  );
};


/**
 * Delete product
 */
export const deleteProduct = async (
  productId: string
): Promise<boolean> => {

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error(
      'Error deleting product:',
      error
    );

    throw new Error(error.message);
  }

  return true;
};


/**
 * Update product inventory
 */
export const updateProductInventory = async (
  productId: string,
  stock: number
): Promise<Product> => {

  const quantity = Math.max(0, Number(stock));

  const {
    data,
    error,
  } = await supabase
    .from('products')
    .update({
      stock: quantity,
    })
    .eq('id', productId)
    .select(
      `
        *,
        categories:category_id (
          id,
          name
        ),
        ratings:product_ratings (
          average_rating,
          review_count
        )
      `
    )
    .single();

  if (error) {
    console.error(
      'Error updating inventory:',
      error
    );

    throw new Error(error.message);
  }

  return mapDbProductToProduct(
    data as DbProduct
  );
};


/**
 * Fetch products belonging to a category
 */
export const fetchProductsByCategory = async (
  categoryId: string
) => {

  const {
    data,
    error,
  } = await supabase
    .from('products')
    .select(
      `
        *,
        categories:category_id (
          id,
          name
        ),
        ratings:product_ratings (
          average_rating,
          review_count
        )
      `
    )
    .eq('category_id', categoryId)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error(
      'Error fetching products by category:',
      error
    );

    throw new Error(error.message);
  }

  return (
    data || []
  ).map((product) =>
    mapDbProductToProduct(
      product as DbProduct
    )
  );
};
