import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { UserService } from '../../services/UserService';

// Mock the UserService
jest.mock('../../services/UserService');

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
  const mockUser = {
    id: 'user123',
    email: 'john@example.com',
    fullName: 'John Doe',
    role: 'user'
  };

  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('provides initial unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('loads user from token on mount', async () => {
    localStorage.setItem('token', mockToken);
    UserService.getProfile.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Should be loading initially
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      // Wait for user to be loaded
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('handles successful login', async () => {
    UserService.login.mockResolvedValue({ token: mockToken, user: mockUser });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('john@example.com', 'password123');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('handles failed login', async () => {
    const errorMessage = 'Invalid credentials';
    UserService.login.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAuth(), { wrapper });

    try {
      await act(async () => {
        await result.current.login('john@example.com', 'wrongpassword');
      });
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('handles logout', async () => {
    // Setup initial authenticated state
    localStorage.setItem('token', mockToken);
    UserService.getProfile.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      // Wait for user to be loaded
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify initial authenticated state
    expect(result.current.isAuthenticated).toBe(true);

    // Perform logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('handles user profile update', async () => {
    const updatedUser = { ...mockUser, fullName: 'Jane Doe' };
    UserService.updateProfile.mockResolvedValue(updatedUser);

    // Setup initial authenticated state
    localStorage.setItem('token', mockToken);
    UserService.getProfile.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      // Wait for initial user to be loaded
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.updateUser(updatedUser);
    });

    expect(result.current.user).toEqual(updatedUser);
  });

  it('handles failed profile update', async () => {
    const errorMessage = 'Failed to update profile';
    UserService.updateProfile.mockRejectedValue(new Error(errorMessage));

    // Setup initial authenticated state
    localStorage.setItem('token', mockToken);
    UserService.getProfile.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      // Wait for initial user to be loaded
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    try {
      await act(async () => {
        await result.current.updateUser({ ...mockUser, fullName: 'Jane Doe' });
      });
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }

    expect(result.current.user).toEqual(mockUser);
  });

  it('handles registration', async () => {
    UserService.register.mockResolvedValue({ token: mockToken, user: mockUser });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        email: 'john@example.com',
        password: 'password123',
        fullName: 'John Doe'
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('handles failed registration', async () => {
    const errorMessage = 'Email already exists';
    UserService.register.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAuth(), { wrapper });

    try {
      await act(async () => {
        await result.current.register({
          email: 'john@example.com',
          password: 'password123',
          fullName: 'John Doe'
        });
      });
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('handles invalid token on mount', async () => {
    localStorage.setItem('token', 'invalid-token');
    UserService.getProfile.mockRejectedValue(new Error('Invalid token'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      // Wait for user load attempt to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('provides correct role-based authorization', async () => {
    const adminUser = { ...mockUser, role: 'admin' };
    UserService.login.mockResolvedValue({ token: mockToken, user: adminUser });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('admin@example.com', 'password123');
    });

    expect(result.current.isAdmin).toBe(true);
  });
}); 