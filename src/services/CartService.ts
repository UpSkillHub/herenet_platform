import { supabase } from '@/integrations/supabase/client';
import { CartItem, Product } from '@/lib/utils';


// =====================================================
// FETCH CART
// =====================================================

export const fetchCart = async (): Promise<CartItem[]> => {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required to access cart');
  }


  const {
    data,
    error,
  } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      product_id,
      products:product_id (
        id,
        name,
        description,
        price,
        stock,
        image_url,
        category_id,
        in_stock,
        featured
      )
    `)
    .eq('user_id', user.id);


  if (error) {
    console.error('Error fetching cart:', error);
    throw new Error(error.message);
  }


  return (data || [])
    .filter((item) => item.products)
    .map((item) => {

      const dbProduct = item.products as any;


      const product: Product = {

        id: dbProduct.id,

        name: dbProduct.name,

        description:
          dbProduct.description || '',

        price:
          Number(dbProduct.price),

        stock:
          Number(dbProduct.stock || 0),

        image:
          dbProduct.image_url || '',

        category:
          dbProduct.category_id
            ? {
                id: dbProduct.category_id,
                name: 'Category'
              }
            : null,

        inStock:
          dbProduct.in_stock ?? false,

        featured:
          dbProduct.featured ?? false,

        discount: 0,

        rating: 0,

        new: false,

        specifications: {}
      };


      return {

        product,

        quantity: item.quantity

      } as CartItem;

    });

};



// =====================================================
// ADD TO CART
// =====================================================

export const addToCart = async (
  productId: string,
  quantity: number = 1
): Promise<void> => {


  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    throw new Error(
      'Authentication required to add to cart'
    );
  }


  if (quantity <= 0) {
    throw new Error(
      'Quantity must be greater than zero'
    );
  }


  // ---------------------------------------------------
  // Check product exists and has enough stock
  // ---------------------------------------------------

  const {
    data: product,
    error: productError,
  } = await supabase
    .from('products')
    .select(`
      id,
      name,
      stock,
      in_stock
    `)
    .eq('id', productId)
    .single();


  if (productError) {

    console.error(
      'Error checking product:',
      productError
    );

    throw new Error(productError.message);

  }


  if (!product) {
    throw new Error('Product not found');
  }


  if (!product.in_stock || product.stock <= 0) {

    throw new Error(
      'This product is currently out of stock'
    );

  }


  // ---------------------------------------------------
  // Check existing cart item
  // ---------------------------------------------------

  const {
    data: existingItem,
    error: existingError,
  } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();


  if (existingError) {

    console.error(
      'Error checking cart:',
      existingError
    );

    throw new Error(existingError.message);

  }


  // ---------------------------------------------------
  // Existing item
  // ---------------------------------------------------

  if (existingItem) {

    const newQuantity =
      existingItem.quantity + quantity;


    if (newQuantity > product.stock) {

      throw new Error(
        `Only ${product.stock} items are available`
      );

    }


    const {
      error,
    } = await supabase
      .from('cart_items')
      .update({
        quantity: newQuantity
      })
      .eq('id', existingItem.id)
      .eq('user_id', user.id);


    if (error) {

      console.error(
        'Error updating cart quantity:',
        error
      );

      throw new Error(error.message);

    }


    return;

  }


  // ---------------------------------------------------
  // New cart item
  // ---------------------------------------------------

  const {
    error,
  } = await supabase
    .from('cart_items')
    .insert({
      user_id: user.id,
      product_id: productId,
      quantity
    });


  if (error) {

    console.error(
      'Error adding product to cart:',
      error
    );

    throw new Error(error.message);

  }

};



// =====================================================
// UPDATE CART ITEM QUANTITY
// =====================================================

export const updateCartItemQuantity = async (
  productId: string,
  quantity: number
): Promise<void> => {


  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    throw new Error(
      'Authentication required to update cart'
    );
  }


  if (quantity <= 0) {

    await removeFromCart(productId);

    return;

  }


  // ---------------------------------------------------
  // Check stock
  // ---------------------------------------------------

  const {
    data: product,
    error: productError,
  } = await supabase
    .from('products')
    .select('stock, in_stock')
    .eq('id', productId)
    .single();


  if (productError) {
    throw new Error(productError.message);
  }


  if (!product) {
    throw new Error('Product not found');
  }


  if (!product.in_stock) {
    throw new Error(
      'This product is out of stock'
    );
  }


  if (quantity > product.stock) {

    throw new Error(
      `Only ${product.stock} items are available`
    );

  }


  const {
    error,
  } = await supabase
    .from('cart_items')
    .update({
      quantity
    })
    .eq('user_id', user.id)
    .eq('product_id', productId);


  if (error) {

    console.error(
      'Error updating cart:',
      error
    );

    throw new Error(error.message);

  }

};



// =====================================================
// REMOVE FROM CART
// =====================================================

export const removeFromCart = async (
  productId: string
): Promise<void> => {


  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    throw new Error(
      'Authentication required to remove from cart'
    );
  }


  let query = supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id);


  if (productId !== 'all') {

    query = query.eq(
      'product_id',
      productId
    );

  }


  const {
    error,
  } = await query;


  if (error) {

    console.error(
      'Error removing cart item:',
      error
    );

    throw new Error(error.message);

  }

};



// =====================================================
// SYNC LOCAL CART WITH SERVER
// =====================================================

export const syncCartWithServer = async (
  localCart: CartItem[]
): Promise<CartItem[]> => {


  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    throw new Error(
      'Authentication required to sync cart'
    );
  }


  // Clear existing server cart

  const {
    error: deleteError,
  } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id);


  if (deleteError) {

    console.error(
      'Error clearing cart:',
      deleteError
    );

    throw new Error(
      deleteError.message
    );

  }


  if (localCart.length === 0) {
    return [];
  }


  const cartItems = localCart.map(
    (item) => ({
      user_id: user.id,
      product_id: item.product.id,
      quantity: item.quantity
    })
  );


  const {
    error,
  } = await supabase
    .from('cart_items')
    .insert(cartItems);


  if (error) {

    console.error(
      'Error syncing cart:',
      error
    );

    throw new Error(
      error.message
    );

  }


  return fetchCart();

};