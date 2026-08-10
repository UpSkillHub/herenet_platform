  import { supabase } from '@/integrations/supabase/client';

  export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
  }

  /**
   * Get all categories
   */
  export const fetchCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, image_url, created_at')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error(error.message);
    }

    console.log('Categories from Supabase:', data);

    return data ?? [];
  };

  /**
   * Get a category by ID
   */
  export const fetchCategoryById = async (
    categoryId: string
  ): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, image_url, created_at')
      .eq('id', categoryId)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      throw new Error(error.message);
    }

    return data;
  };

  /**
   * Create a new category
   */
  export const createCategory = async (categoryData: {
    name: string;
    slug: string;
    description?: string | null;
    image_url?: string | null;
  }): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description ?? null,
        image_url: categoryData.image_url ?? null,
      })
      .select('id, name, slug, description, image_url, created_at')
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw new Error(error.message);
    }

    return data;
  };

  /**
   * Update a category
   */
  export const updateCategory = async (
    categoryId: string,
    categoryData: {
      name?: string;
      slug?: string;
      description?: string | null;
      image_url?: string | null;
    }
  ): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .update({
        ...(categoryData.name !== undefined && {
          name: categoryData.name,
        }),

        ...(categoryData.slug !== undefined && {
          slug: categoryData.slug,
        }),

        ...(categoryData.description !== undefined && {
          description: categoryData.description,
        }),

        ...(categoryData.image_url !== undefined && {
          image_url: categoryData.image_url,
        }),
      })
      .eq('id', categoryId)
      .select('id, name, slug, description, image_url, created_at')
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw new Error(error.message);
    }

    return data;
  };

  /**
   * Delete a category
   *
   * A category cannot be deleted if products are
   * currently using that category.
   */
  export const deleteCategory = async (
    categoryId: string
  ): Promise<boolean> => {
    // Check whether products are using this category
    const { count, error: countError } = await supabase
      .from('products')
      .select('id', {
        count: 'exact',
        head: true,
      })
      .eq('category_id', categoryId);

    if (countError) {
      console.error(
        'Error checking category products:',
        countError
      );

      throw new Error(countError.message);
    }

    if (count && count > 0) {
      throw new Error(
        `Cannot delete this category because ${count} product${
          count === 1 ? '' : 's'
        } use it.`
      );
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error('Error deleting category:', error);
      throw new Error(error.message);
    }

    return true;
  };

  /**
   * Check whether the currently logged-in user is an admin.
   *
   * The user's role is stored in:
   * public.profiles.role
   *
   * The profile ID is the same UUID as auth.users.id.
   */
  export const checkIfUserIsAdmin = async (): Promise<boolean> => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return false;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }

    return !!data;
  };
