import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import UserService from '../../services/user';

// Mock UserService
jest.mock('../../services/user');

// Test component that uses auth context
const TestComponent = () => {
  const { user, loading, login, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <div data-testid="user-email">{user?.email}</div>
      <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('initializes with loading state', () => {
    UserService.getUserProfile.mockImplementation(() => new Promise(() => {}));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('loads user profile if token exists', async () => {
    localStorage.setItem('token', 'test-token');
    const mockUser = { email: 'test@example.com' };
    UserService.getUserProfile.mockResolvedValue(mockUser);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email);
  });

  it('handles login success', async () => {
    const mockUser = { email: 'test@example.com' };
    const mockResponse = { token: 'test-token', user: mockUser };
    UserService.login.mockResolvedValue(mockResponse);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.queryByTestId('user-email')).toBeNull();

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(localStorage.getItem('token')).toBe(mockResponse.token);
    expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email);
  });

  it('handles logout', async () => {
    localStorage.setItem('token', 'test-token');
    const mockUser = { email: 'test@example.com' };
    UserService.getUserProfile.mockResolvedValue(mockUser);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email);

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.queryByTestId('user-email')).toBeNull();
  });

  it('handles failed user profile load', async () => {
    localStorage.setItem('token', 'invalid-token');
    UserService.getUserProfile.mockRejectedValue(new Error('Invalid token'));

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.queryByTestId('user-email')).toBeNull();
  });
}); 