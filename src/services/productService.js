import api from './api';

export const productService = {
  async getProducts(params = {}) {
    return await api.get('/products', { params });
  },

  async getProductById(id) {
    return await api.get(`/products/${id}`);
  },

  async createProduct(data) {
    return await api.post('/products', data);
  },

  async updateProduct(id, data) {
    return await api.put(`/products/${id}`, data);
  },

  async deleteProduct(id) {
    return await api.delete(`/products/${id}`);
  },

  async addReview(productId, reviewData) {
    return await api.post(`/products/${productId}/reviews`, reviewData);
  }
};
