import api from './api';

class SearchService {
  async searchProducts(params) {
    try {
      const response = await api.get('/products/search', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getFilters() {
    try {
      const response = await api.get('/products/filters');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new SearchService(); 