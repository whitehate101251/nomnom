import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/test-utils';
import Cart from '../Cart';
import { useCart } from '../../../context/CartContext';
import { mockProduct } from '../../../utils/test-utils';

// Mock the useCart hook
jest.mock('../../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

describe('Cart Component', () => {
  const mockCartItems = [
    {
      ...mockProduct,
      quantity: 2,
      size: { value: 50, unit: 'ml', price: 49.99 },
    },
  ];

  const mockCartContext = {
    items: mockCartItems,
    cartTotal: 99.98,
    cartCount: 2,
    updateQuantity: jest.fn(),
    removeItem: jest.fn(),
    clearCart: jest.fn(),
  };

  beforeEach(() => {
    useCart.mockImplementation(() => mockCartContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders cart with items', () => {
    render(<Cart isOpen={true} onClose={() => {}} />);
    
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText('$99.98')).toBeInTheDocument();
  });

  it('handles quantity updates', async () => {
    render(<Cart isOpen={true} onClose={() => {}} />);
    
    const increaseButton = screen.getByLabelText('Increase quantity');
    fireEvent.click(increaseButton);

    await waitFor(() => {
      expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(
        mockProduct.id,
        3
      );
    });
  });

  it('handles item removal', async () => {
    render(<Cart isOpen={true} onClose={() => {}} />);
    
    const removeButton = screen.getByLabelText('Remove item');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(mockCartContext.removeItem).toHaveBeenCalledWith(mockProduct.id);
    });
  });

  it('handles cart clearing', async () => {
    render(<Cart isOpen={true} onClose={() => {}} />);
    
    const clearButton = screen.getByText('Clear Cart');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockCartContext.clearCart).toHaveBeenCalled();
    });
  });

  it('displays empty cart message when no items', () => {
    useCart.mockImplementation(() => ({
      ...mockCartContext,
      items: [],
      cartTotal: 0,
      cartCount: 0,
    }));

    render(<Cart isOpen={true} onClose={() => {}} />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Cart isOpen={true} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Close cart');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });
}); 