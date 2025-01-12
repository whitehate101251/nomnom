import api from './api';
import WebSocketService from './websocket';

class OrderTrackingService {
  constructor() {
    this.ws = WebSocketService;
  }

  async getOrderStatus(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getShipmentDetails(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/shipment`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  subscribeToShipmentUpdates(orderId, callback) {
    this.ws.subscribe(`shipment_updates_${orderId}`, callback);
  }

  unsubscribeFromShipmentUpdates(orderId) {
    this.ws.unsubscribe(`shipment_updates_${orderId}`);
  }

  async getDeliveryEstimate(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/delivery-estimate`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new OrderTrackingService(); 