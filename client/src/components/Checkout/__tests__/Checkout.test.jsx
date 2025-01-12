import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import { useNavigate } from 'react-router-dom';
import Checkout from '../Checkout';
import { useCart } from '../../../contexts/CartContext';
import { OrderService } from '../../../services/OrderService';
import { mockProduct } from '../../../utils/test-utils';

// Mock the necessary dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../../../contexts/CartContext');
jest.mock('../../../services/OrderService');

describe('Checkout', () => {
  const mockNavigate = jest.fn();
  const mockClearCart = jest.fn();
  const mockCartItems = [
    { ...mockProduct, quantity: 2 },
    { ...mockProduct, id: 2, name: 'Test Product 2', quantity: 1 }
  ];

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useCart.mockReturnValue({
      cartItems: mockCartItems,
      clearCart: mockClearCart,
      total: 199.98
    });
    OrderService.createOrder.mockResolvedValue({ id: 'order123' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders checkout form correctly', () => {
    render(<Checkout />);

    // Check for form fields
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();

    // Check for order summary
    mockCartItems.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(`${item.quantity}x`)).toBeInTheDocument();
    });
    expect(screen.getByText('$199.98')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<Checkout />);

    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/city is required/i)).toBeInTheDocument();
      expect(screen.getByText(/postal code is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<Checkout />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('handles successful order placement', async () => {
    render(<Checkout />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: '12345' } });

    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(OrderService.createOrder).toHaveBeenCalledWith({
        customerDetails: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main St',
          city: 'Test City',
          postalCode: '12345'
        },
        items: mockCartItems,
        total: 199.98
      });
      expect(mockClearCart).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/order-confirmation/order123');
    });
  });

  it('handles order placement error', async () => {
    const errorMessage = 'Failed to place order';
    OrderService.createOrder.mockRejectedValue(new Error(errorMessage));

    render(<Checkout />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: '12345' } });

    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/error placing order/i)).toBeInTheDocument();
      expect(mockClearCart).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('redirects to home if cart is empty', () => {
    useCart.mockReturnValue({
      cartItems: [],
      clearCart: mockClearCart,
      total: 0
    });

    render(<Checkout />);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('displays loading state during order placement', async () => {
    render(<Checkout />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: '12345' } });

    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });
}); 