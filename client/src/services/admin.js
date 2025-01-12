import api from './api';

class AdminService {
  // Product Management
  async getProducts() {
    try {
      const response = await api.get('/admin/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      const response = await api.post('/admin/products', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(productId, productData) {
    try {
      const response = await api.put(`/admin/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const response = await api.delete(`/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Order Management
  async getOrders() {
    try {
      const response = await api.get('/admin/orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // User Management
  async getUsers() {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateUserRole(userId, role) {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Analytics
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSalesAnalytics(period = '7d') {
    try {
      const response = await api.get(`/admin/analytics/sales?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProductAnalytics() {
    try {
      const response = await api.get('/admin/analytics/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserAnalytics() {
    try {
      const response = await api.get('/admin/analytics/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AdminService(); 