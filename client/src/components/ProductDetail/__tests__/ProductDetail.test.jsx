import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import ProductDetail from '../ProductDetail';
import { useCart } from '../../../contexts/CartContext';
import { useWishlist } from '../../../contexts/WishlistContext';
import { mockProduct } from '../../../utils/test-utils';

// Mock the context hooks
jest.mock('../../../contexts/CartContext');
jest.mock('../../../contexts/WishlistContext');

describe('ProductDetail', () => {
  const mockAddToCart = jest.fn();
  const mockAddToWishlist = jest.fn();
  const mockRemoveFromWishlist = jest.fn();

  beforeEach(() => {
    useCart.mockReturnValue({
      addToCart: mockAddToCart,
    });
    useWishlist.mockReturnValue({
      addToWishlist: mockAddToWishlist,
      removeFromWishlist: mockRemoveFromWishlist,
      isInWishlist: jest.fn().mockReturnValue(false),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders product details correctly', () => {
    render(<ProductDetail product={mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to wishlist/i })).toBeInTheDocument();
  });

  it('handles add to cart click', async () => {
    render(<ProductDetail product={mockProduct} />);

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });
  });

  it('handles add to wishlist click', async () => {
    render(<ProductDetail product={mockProduct} />);

    const addToWishlistButton = screen.getByRole('button', { name: /add to wishlist/i });
    fireEvent.click(addToWishlistButton);

    await waitFor(() => {
      expect(mockAddToWishlist).toHaveBeenCalledWith(mockProduct);
    });
  });

  it('handles remove from wishlist when product is in wishlist', async () => {
    useWishlist.mockReturnValue({
      addToWishlist: mockAddToWishlist,
      removeFromWishlist: mockRemoveFromWishlist,
      isInWishlist: jest.fn().mockReturnValue(true),
    });

    render(<ProductDetail product={mockProduct} />);

    const removeFromWishlistButton = screen.getByRole('button', { name: /remove from wishlist/i });
    fireEvent.click(removeFromWishlistButton);

    await waitFor(() => {
      expect(mockRemoveFromWishlist).toHaveBeenCalledWith(mockProduct.id);
    });
  });

  it('displays out of stock message when quantity is 0', () => {
    const outOfStockProduct = { ...mockProduct, quantity: 0 };
    render(<ProductDetail product={outOfStockProduct} />);

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });

  it('displays product images correctly', () => {
    render(<ProductDetail product={mockProduct} />);

    mockProduct.images.forEach(image => {
      expect(screen.getByAltText(`${mockProduct.name} - view`)).toBeInTheDocument();
    });
  });

  it('updates quantity when using quantity controls', () => {
    render(<ProductDetail product={mockProduct} />);

    const incrementButton = screen.getByRole('button', { name: /increment/i });
    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.click(incrementButton);
    expect(quantityInput.value).toBe('2');

    fireEvent.click(decrementButton);
    expect(quantityInput.value).toBe('1');

    fireEvent.change(quantityInput, { target: { value: '5' } });
    expect(quantityInput.value).toBe('5');
  });
}); 