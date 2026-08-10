import { supabase } from '@/integrations/supabase/client';

export const uploadProductImage = async (
  file: File
): Promise<string> => {

  if (!file) {
    throw new Error('No image selected');
  }

  // Validate image type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }

  // Validate size - 5MB maximum
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image must be smaller than 5MB');
  }

  // Create a unique filename
  const fileExt = file.name.split('.').pop();

  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  // Store images inside the products folder
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from('products')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Image upload error:', error);
    throw new Error(error.message);
  }

  // Get public URL
  const { data } = supabase.storage
    .from('products')
    .getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error('Could not get image URL');
  }

  return data.publicUrl;
};