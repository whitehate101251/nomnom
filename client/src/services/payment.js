import api from './api';
import { handleApiError } from './api';

class PaymentService {
  async processPayment(paymentDetails) {
    try {
      const response = await api.post('/payments/process', paymentDetails);
      return response.data;
    } catch (error) {
      const errorData = handleApiError(error);
      
      // Handle specific payment errors
      if (error.response?.data?.code) {
        switch (error.response.data.code) {
          case 'insufficient_funds':
            throw new Error('Insufficient funds. Please use a different payment method.');
          case 'card_declined':
            throw new Error('Card declined. Please try another card.');
          case 'expired_card':
            throw new Error('Card expired. Please use a valid card.');
          case 'invalid_cvc':
            throw new Error('Invalid CVC code.');
          default:
            throw new Error(errorData.message);
        }
      }
      
      throw new Error(errorData.message);
    }
  }

  async validateCard(cardDetails) {
    try {
      const response = await api.post('/payments/validate-card', cardDetails);
      return response.data.isValid;
    } catch (error) {
      const errorData = handleApiError(error);
      throw new Error(errorData.message);
    }
  }

  async getPaymentMethods() {
    try {
      const response = await api.get('/payments/methods');
      return response.data;
    } catch (error) {
      const errorData = handleApiError(error);
      throw new Error(errorData.message);
    }
  }
}

export default new PaymentService(); 