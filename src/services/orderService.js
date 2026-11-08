import api from './api';

export const orderService = {
  async createOrder(orderData) {
    return await api.post('/orders', orderData);
  },

  async getMyOrders() {
    return await api.get('/orders/my');
  },

  async getOrderById(id) {
    return await api.get(`/orders/${id}`);
  },

  async getAllOrders(params = {}) {
    return await api.get('/orders', { params });
  },

  async updateOrderStatus(id, status, note = '') {
    return await api.patch(`/orders/${id}/status`, { status, note });
  }
};
