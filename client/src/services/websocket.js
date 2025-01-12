import io from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.subscribers = new Map();
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.socket) return;

    this.socket = io(process.env.REACT_APP_WS_URL || 'ws://localhost:3001', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on('connect', () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('message', (message) => {
      this.handleMessage(message);
    });
  }

  handleMessage(message) {
    const { channel, data } = message;
    if (this.subscribers.has(channel)) {
      this.subscribers.get(channel).forEach(callback => callback(data));
    }
  }

  subscribe(channel, callback) {
    if (!this.socket) {
      this.connect();
    }

    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
      this.socket.emit('subscribe', channel);
    }

    this.subscribers.get(channel).add(callback);
  }

  unsubscribe(channel, callback) {
    if (!this.subscribers.has(channel)) return;

    if (callback) {
      this.subscribers.get(channel).delete(callback);
    } else {
      this.subscribers.delete(channel);
      this.socket.emit('unsubscribe', channel);
    }

    if (this.subscribers.get(channel)?.size === 0) {
      this.subscribers.delete(channel);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.subscribers.clear();
    }
  }

  emit(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket is not connected');
    }
  }
}

export default new WebSocketService(); 