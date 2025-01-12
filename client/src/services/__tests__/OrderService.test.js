import { OrderService } from '../OrderService';
import axios from 'axios';
import { mockProduct } from '../../utils/test-utils';

// Mock axios
jest.mock('axios');

describe('OrderService', () => {
  const mockOrder = {
    id: 'order123',
    customerDetails: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Test City',
      postalCode: '12345'
    },
    items: [
      { ...mockProduct, quantity: 2 },
      { ...mockProduct, id: 2, name: 'Test Product 2', quantity: 1 }
    ],
    total: 199.98,
    status: 'pending',
    createdAt: '2024-03-15T10:30:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('creates order successfully', async () => {
      const response = { data: mockOrder };
      axios.post.mockResolvedValue(response);

      const result = await OrderService.createOrder({
        customerDetails: mockOrder.customerDetails,
        items: mockOrder.items,
        total: mockOrder.total
      });

      expect(result).toEqual(mockOrder);
      expect(axios.post).toHaveBeenCalledWith('/api/orders', {
        customerDetails: mockOrder.customerDetails,
        items: mockOrder.items,
        total: mockOrder.total
      });
    });

    it('handles validation error', async () => {
      const errorMessage = 'Validation failed';
      axios.post.mockRejectedValue(new Error(errorMessage));

      const invalidOrder = {
        customerDetails: { fullName: '' },
        items: [],
        total: 0
      };

      await expect(OrderService.createOrder(invalidOrder)).rejects.toThrow(errorMessage);
    });
  });

  describe('getOrders', () => {
    it('fetches orders successfully', async () => {
      const response = { data: [mockOrder] };
      axios.get.mockResolvedValue(response);

      const result = await OrderService.getOrders();

      expect(result).toEqual([mockOrder]);
      expect(axios.get).toHaveBeenCalledWith('/api/orders');
    });

    it('handles query parameters', async () => {
      const params = {
        status: 'pending',
        page: 2,
        limit: 10,
        sort: 'createdAt-desc'
      };

      const response = { data: [mockOrder] };
      axios.get.mockResolvedValue(response);

      const result = await OrderService.getOrders(params);

      expect(result).toEqual([mockOrder]);
      expect(axios.get).toHaveBeenCalledWith('/api/orders', { params });
    });

    it('handles error response', async () => {
      const errorMessage = 'Network error';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(OrderService.getOrders()).rejects.toThrow(errorMessage);
    });
  });

  describe('getOrder', () => {
    it('fetches single order successfully', async () => {
      const response = { data: mockOrder };
      axios.get.mockResolvedValue(response);

      const result = await OrderService.getOrder(mockOrder.id);

      expect(result).toEqual(mockOrder);
      expect(axios.get).toHaveBeenCalledWith(`/api/orders/${mockOrder.id}`);
    });

    it('handles error response', async () => {
      const errorMessage = 'Order not found';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(OrderService.getOrder('invalid-id')).rejects.toThrow(errorMessage);
    });
  });

  describe('updateOrderStatus', () => {
    it('updates order status successfully', async () => {
      const updatedOrder = { ...mockOrder, status: 'completed' };
      const response = { data: updatedOrder };
      axios.patch.mockResolvedValue(response);

      const result = await OrderService.updateOrderStatus(mockOrder.id, 'completed');

      expect(result).toEqual(updatedOrder);
      expect(axios.patch).toHaveBeenCalledWith(`/api/orders/${mockOrder.id}/status`, {
        status: 'completed'
      });
    });

    it('handles invalid status', async () => {
      const errorMessage = 'Invalid status';
      axios.patch.mockRejectedValue(new Error(errorMessage));

      await expect(OrderService.updateOrderStatus(mockOrder.id, 'invalid-status'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('cancelOrder', () => {
    it('cancels order successfully', async () => {
      const cancelledOrder = { ...mockOrder, status: 'cancelled' };
      const response = { data: cancelledOrder };
      axios.post.mockResolvedValue(response);

      const result = await OrderService.cancelOrder(mockOrder.id);

      expect(result).toEqual(cancelledOrder);
      expect(axios.post).toHaveBeenCalledWith(`/api/orders/${mockOrder.id}/cancel`);
    });

    it('handles error when order cannot be cancelled', async () => {
      const errorMessage = 'Order cannot be cancelled';
      axios.post.mockRejectedValue(new Error(errorMessage));

      await expect(OrderService.cancelOrder(mockOrder.id)).rejects.toThrow(errorMessage);
    });
  });

  describe('getOrdersByUser', () => {
    it('fetches user orders successfully', async () => {
      const response = { data: [mockOrder] };
      axios.get.mockResolvedValue(response);

      const result = await OrderService.getOrdersByUser();

      expect(result).toEqual([mockOrder]);
      expect(axios.get).toHaveBeenCalledWith('/api/orders/user');
    });

    it('handles query parameters for user orders', async () => {
      const params = {
        status: 'completed',
        page: 1,
        limit: 5
      };

      const response = { data: [mockOrder] };
      axios.get.mockResolvedValue(response);

      const result = await OrderService.getOrdersByUser(params);

      expect(result).toEqual([mockOrder]);
      expect(axios.get).toHaveBeenCalledWith('/api/orders/user', { params });
    });

    it('handles error response for user orders', async () => {
      const errorMessage = 'Failed to fetch user orders';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(OrderService.getOrdersByUser()).rejects.toThrow(errorMessage);
    });
  });

  describe('getOrderStatistics', () => {
    it('fetches order statistics successfully', async () => {
      const statistics = {
        total: 100,
        pending: 20,
        completed: 70,
        cancelled: 10,
        revenue: 9999.99
      };

      const response = { data: statistics };
      axios.get.mockResolvedValue(response);

      const result = await OrderService.getOrderStatistics();

      expect(result).toEqual(statistics);
      expect(axios.get).toHaveBeenCalledWith('/api/orders/statistics');
    });

    it('handles error response for statistics', async () => {
      const errorMessage = 'Failed to fetch statistics';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(OrderService.getOrderStatistics()).rejects.toThrow(errorMessage);
    });
  });
}); 