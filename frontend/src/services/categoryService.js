import api from './api';

export const categoryService = {
  // GET /api/categories
  async getCategories() {
    return api.get('/categories');
  },

  // GET /api/categories/:id
  async getCategoryById(id) {
    return api.get(`/categories/${id}`);
  },

  // POST /api/categories
  async createCategory(categoryData) {
    return api.post('/categories', categoryData);
  },

  // PUT /api/categories/:id
  async updateCategory(id, categoryData) {
    return api.put(
      `/categories/${id}`,
      categoryData
    );
  },

  // PATCH /api/categories/:id/status
  async updateCategoryStatus(id, isActive) {
    return api.patch(
      `/categories/${id}/status`,
      { isActive }
    );
  },

  // DELETE /api/categories/:id
  async deleteCategory(id) {
    return api.delete(`/categories/${id}`);
  }
};

export default categoryService;