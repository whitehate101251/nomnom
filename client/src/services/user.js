import api from './api';

class UserService {
  async getUserProfile() {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(passwordData) {
    try {
      const response = await api.put('/user/password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getOrderHistory() {
    try {
      const response = await api.get('/user/orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getOrderDetails(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService(); 