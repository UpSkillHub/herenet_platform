// frontend/services/category.service.ts
import api from '../lib/api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const categoryService = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get('/ads/categories');
    return response.data;
  },

  // Get single category by ID
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await api.get(`/ads/categories/${id}`);
    return response.data;
  },
};