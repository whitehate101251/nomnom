import api from './api';

class EmailService {
  async sendOrderConfirmation(orderData) {
    try {
      const response = await api.post('/email/order-confirmation', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async sendShippingUpdate(orderData) {
    try {
      const response = await api.post('/email/shipping-update', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async subscribeToNewsletter(email) {
    try {
      const response = await api.post('/email/newsletter-subscribe', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new EmailService(); 