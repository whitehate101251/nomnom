import api from './api';
import EmailService from './email';

class CheckoutService {
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      await EmailService.sendOrderConfirmation({
        orderId: response.data.id,
        customerEmail: orderData.shipping.email,
        orderDetails: {
          items: orderData.items,
          total: orderData.total,
          shipping: orderData.shipping
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async validateShipping(address) {
    try {
      const response = await api.post('/shipping/validate', address);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async calculateShipping(address, items) {
    try {
      const response = await api.post('/shipping/calculate', { address, items });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async processPayment(paymentData) {
    try {
      const response = await api.post('/payments/process', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CheckoutService(); 