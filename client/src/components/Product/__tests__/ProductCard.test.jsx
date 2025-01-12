import React from 'react';
import { render, screen, fireEvent } from '../../../utils/test-utils';
import ProductCard from '../ProductCard';
import { useCart } from '../../../context/CartContext';

// Mock the useCart hook
jest.mock('../../../context/CartContext', () => ({
  useCart: jest.fn()
}));

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Perfume',
    price: 99.99,
    image: 'test-image.jpg',
    description: 'A lovely fragrance'
  };

  beforeEach(() => {
    // Setup default mock implementation
    useCart.mockImplementation(() => ({
      addItem: jest.fn(),
      cartCount: 0
    }));
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockProduct.image);
    expect(screen.getByRole('img')).toHaveAttribute('alt', mockProduct.name);
  });

  it('calls addItem when Add to Cart button is clicked', () => {
    const mockAddItem = jest.fn();
    useCart.mockImplementation(() => ({
      addItem: mockAddItem,
      cartCount: 0
    }));

    render(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByText(/add to cart/i);
    fireEvent.click(addButton);
    
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct);
  });

  it('applies hover animation on mouse over', () => {
    render(<ProductCard product={mockProduct} />);
    
    const card = screen.getByTestId('product-card');
    fireEvent.mouseEnter(card);
    
    expect(card).toHaveStyleRule('transform', 'translateY(-5px)');
  });
}); 