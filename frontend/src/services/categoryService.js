import api from './api';

export const categoryService = {
  // GET /api/categories
  async getCategories(params = { all: 'true' }) {
    return api.get('/categories', { params });
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
  },

  // POST /api/categories/bulk
  async bulkCreateCategories(categories) {
    const payload = Array.isArray(categories) ? { categories } : categories;
    return api.post('/categories/bulk', payload);
  },

  // POST /api/categories/bulk-delete
  async bulkDeleteCategories(ids) {
    return api.post('/categories/bulk-delete', { ids });
  }
};

export default categoryService;