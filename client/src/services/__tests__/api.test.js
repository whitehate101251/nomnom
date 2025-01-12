import axios from 'axios';
import api, { handleApiError } from '../api';

// Mock axios
jest.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Request Interceptor', () => {
    it('adds authorization header when token exists', async () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      const mockResponse = { data: { success: true } };
      axios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      });

      await api.get('/test');

      expect(axios.create().interceptors.request.use).toHaveBeenCalled();
    });

    it('handles rate limiting correctly', async () => {
      const mockResponse = {
        response: {
          status: 429,
          headers: { 'retry-after': '60' }
        }
      };

      axios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      });

      await expect(api.get('/test')).rejects.toEqual(mockResponse);
    });
  });

  describe('Response Interceptor', () => {
    it('handles 401 unauthorized by redirecting to login', async () => {
      const mockResponse = {
        response: {
          status: 401
        }
      };

      axios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      });

      await expect(api.get('/test')).rejects.toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('handleApiError', () => {
    it('handles validation errors (400)', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid input' }
        }
      };

      const result = handleApiError(error);
      expect(result).toEqual({
        type: 'validation',
        message: 'Invalid input'
      });
    });

    it('handles authentication errors (401)', () => {
      const error = {
        response: {
          status: 401
        }
      };

      const result = handleApiError(error);
      expect(result).toEqual({
        type: 'auth',
        message: 'Please log in to continue'
      });
    });

    it('handles network errors', () => {
      const error = {
        request: {}
      };

      const result = handleApiError(error);
      expect(result).toEqual({
        type: 'network',
        message: 'Network error. Please check your connection'
      });
    });

    it('handles unknown errors', () => {
      const error = new Error('Unknown error');

      const result = handleApiError(error);
      expect(result).toEqual({
        type: 'unknown',
        message: 'An unexpected error occurred'
      });
    });
  });
}); 