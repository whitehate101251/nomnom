import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import { useParams } from 'react-router-dom';
import OrderConfirmation from '../OrderConfirmation';
import { OrderService } from '../../../services/OrderService';
import { mockProduct } from '../../../utils/test-utils';

// Mock the necessary dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
jest.mock('../../../services/OrderService');

describe('OrderConfirmation', () => {
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
    status: 'confirmed',
    createdAt: '2024-03-15T10:30:00Z'
  };

  beforeEach(() => {
    useParams.mockReturnValue({ orderId: 'order123' });
    OrderService.getOrder.mockResolvedValue(mockOrder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders order confirmation details correctly', async () => {
    render(<OrderConfirmation />);

    await waitFor(() => {
      // Check order number
      expect(screen.getByText(/order #order123/i)).toBeInTheDocument();

      // Check customer details
      expect(screen.getByText(mockOrder.customerDetails.fullName)).toBeInTheDocument();
      expect(screen.getByText(mockOrder.customerDetails.email)).toBeInTheDocument();
      expect(screen.getByText(mockOrder.customerDetails.phone)).toBeInTheDocument();
      expect(screen.getByText(mockOrder.customerDetails.address)).toBeInTheDocument();
      expect(screen.getByText(mockOrder.customerDetails.city)).toBeInTheDocument();
      expect(screen.getByText(mockOrder.customerDetails.postalCode)).toBeInTheDocument();

      // Check order items
      mockOrder.items.forEach(item => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
        expect(screen.getByText(`${item.quantity}x`)).toBeInTheDocument();
        expect(screen.getByText(`$${(item.price * item.quantity).toFixed(2)}`)).toBeInTheDocument();
      });

      // Check total
      expect(screen.getByText(`$${mockOrder.total.toFixed(2)}`)).toBeInTheDocument();

      // Check status
      expect(screen.getByText(/confirmed/i)).toBeInTheDocument();

      // Check date
      expect(screen.getByText(/march 15, 2024/i)).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    render(<OrderConfirmation />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles error when fetching order', async () => {
    const errorMessage = 'Failed to fetch order';
    OrderService.getOrder.mockRejectedValue(new Error(errorMessage));

    render(<OrderConfirmation />);

    await waitFor(() => {
      expect(screen.getByText(/error loading order details/i)).toBeInTheDocument();
    });
  });

  it('handles invalid order ID', async () => {
    OrderService.getOrder.mockResolvedValue(null);

    render(<OrderConfirmation />);

    await waitFor(() => {
      expect(screen.getByText(/order not found/i)).toBeInTheDocument();
    });
  });

  it('displays different status styles', async () => {
    const orderWithDifferentStatus = {
      ...mockOrder,
      status: 'processing'
    };
    OrderService.getOrder.mockResolvedValue(orderWithDifferentStatus);

    render(<OrderConfirmation />);

    await waitFor(() => {
      const statusElement = screen.getByText(/processing/i);
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveStyle({
        backgroundColor: expect.any(String)
      });
    });
  });

  it('formats date correctly', async () => {
    const orderWithDifferentDate = {
      ...mockOrder,
      createdAt: '2024-03-20T15:45:30Z'
    };
    OrderService.getOrder.mockResolvedValue(orderWithDifferentDate);

    render(<OrderConfirmation />);

    await waitFor(() => {
      expect(screen.getByText(/march 20, 2024/i)).toBeInTheDocument();
    });
  });

  it('displays shipping address section', async () => {
    render(<OrderConfirmation />);

    await waitFor(() => {
      expect(screen.getByText(/shipping address/i)).toBeInTheDocument();
      expect(screen.getByText(`${mockOrder.customerDetails.address}, ${mockOrder.customerDetails.city}, ${mockOrder.customerDetails.postalCode}`)).toBeInTheDocument();
    });
  });

  it('displays order summary section', async () => {
    render(<OrderConfirmation />);

    await waitFor(() => {
      expect(screen.getByText(/order summary/i)).toBeInTheDocument();
      expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
      expect(screen.getByText(/shipping/i)).toBeInTheDocument();
      expect(screen.getByText(/total/i)).toBeInTheDocument();
    });
  });
}); 