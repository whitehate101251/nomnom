import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import ProductList from '../ProductList';
import { ProductService } from '../../../services/ProductService';
import { mockProduct } from '../../../utils/test-utils';

// Mock the ProductService
jest.mock('../../../services/ProductService');

describe('ProductList', () => {
  const mockProducts = [
    mockProduct,
    { ...mockProduct, id: 2, name: 'Test Product 2' },
    { ...mockProduct, id: 3, name: 'Test Product 3' }
  ];

  beforeEach(() => {
    ProductService.getProducts.mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders product list correctly', async () => {
    render(<ProductList />);

    await waitFor(() => {
      mockProducts.forEach(product => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
        expect(screen.getByText(`$${product.price.toFixed(2)}`)).toBeInTheDocument();
      });
    });
  });

  it('displays loading state initially', () => {
    render(<ProductList />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles search filtering', async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(searchInput, { target: { value: 'Test Product 2' } });

    await waitFor(() => {
      expect(screen.queryByText(mockProducts[0].name)).not.toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });
  });

  it('handles category filtering', async () => {
    ProductService.getCategories.mockResolvedValue(['Category 1', 'Category 2']);
    
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    const categoryFilter = screen.getByText('Category 1');
    fireEvent.click(categoryFilter);

    await waitFor(() => {
      expect(ProductService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'Category 1' })
      );
    });
  });

  it('handles price sorting', async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
    });

    const sortSelect = screen.getByLabelText(/sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

    await waitFor(() => {
      expect(ProductService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'price-asc' })
      );
    });
  });

  it('handles error state', async () => {
    const errorMessage = 'Failed to fetch products';
    ProductService.getProducts.mockRejectedValue(new Error(errorMessage));

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
    });
  });

  it('handles empty results', async () => {
    ProductService.getProducts.mockResolvedValue([]);

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
    });

    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(ProductService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      );
    });
  });

  it('resets to first page when filters change', async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
    });

    // Go to next page
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    // Change search filter
    const searchInput = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    await waitFor(() => {
      expect(ProductService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1 })
      );
    });
  });
}); 