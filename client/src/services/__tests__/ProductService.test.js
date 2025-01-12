import { ProductService } from '../ProductService';
import axios from 'axios';
import { mockProduct } from '../../utils/test-utils';

// Mock axios
jest.mock('axios');

describe('ProductService', () => {
  const mockProducts = [
    mockProduct,
    { ...mockProduct, id: 2, name: 'Test Product 2' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('fetches products successfully', async () => {
      const response = { data: mockProducts };
      axios.get.mockResolvedValue(response);

      const result = await ProductService.getProducts();

      expect(result).toEqual(mockProducts);
      expect(axios.get).toHaveBeenCalledWith('/api/products');
    });

    it('handles query parameters', async () => {
      const params = {
        search: 'test',
        category: 'electronics',
        sort: 'price-asc',
        page: 2,
        limit: 10
      };

      const response = { data: mockProducts };
      axios.get.mockResolvedValue(response);

      const result = await ProductService.getProducts(params);

      expect(result).toEqual(mockProducts);
      expect(axios.get).toHaveBeenCalledWith('/api/products', { params });
    });

    it('handles error response', async () => {
      const errorMessage = 'Network error';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(ProductService.getProducts()).rejects.toThrow(errorMessage);
    });
  });

  describe('getProduct', () => {
    it('fetches single product successfully', async () => {
      const response = { data: mockProduct };
      axios.get.mockResolvedValue(response);

      const result = await ProductService.getProduct(mockProduct.id);

      expect(result).toEqual(mockProduct);
      expect(axios.get).toHaveBeenCalledWith(`/api/products/${mockProduct.id}`);
    });

    it('handles error response', async () => {
      const errorMessage = 'Product not found';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(ProductService.getProduct('invalid-id')).rejects.toThrow(errorMessage);
    });
  });

  describe('createProduct', () => {
    it('creates product successfully', async () => {
      const newProduct = {
        name: 'New Product',
        description: 'Description',
        price: 29.99,
        category: 'electronics'
      };

      const response = { data: { ...newProduct, id: 'new-id' } };
      axios.post.mockResolvedValue(response);

      const result = await ProductService.createProduct(newProduct);

      expect(result).toEqual(response.data);
      expect(axios.post).toHaveBeenCalledWith('/api/products', newProduct);
    });

    it('handles validation error', async () => {
      const errorMessage = 'Validation failed';
      axios.post.mockRejectedValue(new Error(errorMessage));

      const invalidProduct = { name: '' };

      await expect(ProductService.createProduct(invalidProduct)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateProduct', () => {
    it('updates product successfully', async () => {
      const updatedProduct = { ...mockProduct, name: 'Updated Name' };
      const response = { data: updatedProduct };
      axios.put.mockResolvedValue(response);

      const result = await ProductService.updateProduct(mockProduct.id, updatedProduct);

      expect(result).toEqual(updatedProduct);
      expect(axios.put).toHaveBeenCalledWith(`/api/products/${mockProduct.id}`, updatedProduct);
    });

    it('handles error response', async () => {
      const errorMessage = 'Product not found';
      axios.put.mockRejectedValue(new Error(errorMessage));

      await expect(ProductService.updateProduct('invalid-id', {})).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteProduct', () => {
    it('deletes product successfully', async () => {
      const response = { data: { message: 'Product deleted' } };
      axios.delete.mockResolvedValue(response);

      await ProductService.deleteProduct(mockProduct.id);

      expect(axios.delete).toHaveBeenCalledWith(`/api/products/${mockProduct.id}`);
    });

    it('handles error response', async () => {
      const errorMessage = 'Product not found';
      axios.delete.mockRejectedValue(new Error(errorMessage));

      await expect(ProductService.deleteProduct('invalid-id')).rejects.toThrow(errorMessage);
    });
  });

  describe('getCategories', () => {
    it('fetches categories successfully', async () => {
      const categories = ['electronics', 'clothing', 'books'];
      const response = { data: categories };
      axios.get.mockResolvedValue(response);

      const result = await ProductService.getCategories();

      expect(result).toEqual(categories);
      expect(axios.get).toHaveBeenCalledWith('/api/products/categories');
    });

    it('handles error response', async () => {
      const errorMessage = 'Failed to fetch categories';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(ProductService.getCategories()).rejects.toThrow(errorMessage);
    });
  });

  describe('uploadProductImage', () => {
    it('uploads image successfully', async () => {
      const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const imageUrl = 'https://example.com/images/test.jpg';
      const response = { data: { url: imageUrl } };
      axios.post.mockResolvedValue(response);

      const formData = new FormData();
      formData.append('image', imageFile);

      const result = await ProductService.uploadProductImage(imageFile);

      expect(result).toBe(imageUrl);
      expect(axios.post).toHaveBeenCalledWith('/api/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    });

    it('handles upload error', async () => {
      const errorMessage = 'Upload failed';
      axios.post.mockRejectedValue(new Error(errorMessage));

      const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

      await expect(ProductService.uploadProductImage(imageFile)).rejects.toThrow(errorMessage);
    });
  });
}); 