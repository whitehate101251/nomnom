import WebSocketService from './websocket';

class OrderUpdatesService {
  constructor() {
    this.ws = WebSocketService;
  }

  subscribeToOrderUpdates(orderId, callback) {
    this.ws.subscribe(`order_updates_${orderId}`, (data) => {
      callback(data);
    });
  }

  unsubscribeFromOrderUpdates(orderId) {
    this.ws.unsubscribe(`order_updates_${orderId}`);
  }
}

export default new OrderUpdatesService(); 