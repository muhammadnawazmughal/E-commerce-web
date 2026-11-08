import api from './api';

export const userService = {
  async getUsers(params = {}) {
    return await api.get('/users', { params });
  },

  async updateUser(id, data) {
    return await api.patch(`/users/${id}`, data);
  },

  async getDashboardMetrics() {
    return await api.get('/users/dashboard/metrics');
  }
};
