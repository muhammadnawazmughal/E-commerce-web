import api from './api';

export const categoryService = {
  async getCategories() {
    return await api.get('/categories');
  },

  async createCategory(data) {
    return await api.post('/categories', data);
  },

  async updateCategory(id, data) {
    return await api.put(`/categories/${id}`, data);
  },

  async deleteCategory(id) {
    return await api.delete(`/categories/${id}`);
  }
};
