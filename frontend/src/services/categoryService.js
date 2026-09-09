import { categories } from '../data/categories';

/**
 * Category Service
 * Ready for GET /api/categories integration
 */
export const categoryService = {
  // GET /api/categories
  async getCategories() {
    return Promise.resolve([...categories]);
  },

  // GET /api/categories/:id
  async getCategoryById(id) {
    const category = categories.find(c => c.id === id);
    return Promise.resolve(category || null);
  }
};
