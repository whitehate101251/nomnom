import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import UserProfile from '../UserProfile';
import { useAuth } from '../../../contexts/AuthContext';
import { UserService } from '../../../services/UserService';

// Mock the necessary dependencies
jest.mock('../../../contexts/AuthContext');
jest.mock('../../../services/UserService');

describe('UserProfile', () => {
  const mockUser = {
    id: 'user123',
    email: 'john@example.com',
    fullName: 'John Doe',
    phone: '1234567890',
    address: '123 Main St',
    city: 'Test City',
    postalCode: '12345',
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        sms: false
      }
    }
  };

  const mockUpdateUser = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
      updateUser: mockUpdateUser
    });
    UserService.updateProfile.mockResolvedValue(mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user profile form with current user data', () => {
    render(<UserProfile />);

    expect(screen.getByDisplayValue(mockUser.fullName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.phone)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.address)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.city)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.postalCode)).toBeInTheDocument();
    
    // Check preferences
    expect(screen.getByRole('checkbox', { name: /newsletter/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /email notifications/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /sms notifications/i })).not.toBeChecked();
  });

  it('validates required fields', async () => {
    render(<UserProfile />);

    // Clear required fields
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<UserProfile />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('handles successful profile update', async () => {
    render(<UserProfile />);

    const updatedName = 'Jane Doe';
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: updatedName } });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(UserService.updateProfile).toHaveBeenCalledWith({
        ...mockUser,
        fullName: updatedName
      });
      expect(mockUpdateUser).toHaveBeenCalledWith({
        ...mockUser,
        fullName: updatedName
      });
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });

  it('handles profile update error', async () => {
    const errorMessage = 'Failed to update profile';
    UserService.updateProfile.mockRejectedValue(new Error(errorMessage));

    render(<UserProfile />);

    const updatedName = 'Jane Doe';
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: updatedName } });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/error updating profile/i)).toBeInTheDocument();
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });
  });

  it('toggles preference settings', async () => {
    render(<UserProfile />);

    const newsletterCheckbox = screen.getByRole('checkbox', { name: /newsletter/i });
    const emailNotificationsCheckbox = screen.getByRole('checkbox', { name: /email notifications/i });
    const smsNotificationsCheckbox = screen.getByRole('checkbox', { name: /sms notifications/i });

    fireEvent.click(newsletterCheckbox);
    fireEvent.click(emailNotificationsCheckbox);
    fireEvent.click(smsNotificationsCheckbox);

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(UserService.updateProfile).toHaveBeenCalledWith({
        ...mockUser,
        preferences: {
          newsletter: false,
          notifications: {
            email: false,
            sms: true
          }
        }
      });
    });
  });

  it('displays loading state during update', async () => {
    render(<UserProfile />);

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('handles password change section', async () => {
    UserService.changePassword.mockResolvedValue({ message: 'Password updated successfully' });

    render(<UserProfile />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(currentPasswordInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } });

    const changePasswordButton = screen.getByRole('button', { name: /change password/i });
    fireEvent.click(changePasswordButton);

    await waitFor(() => {
      expect(UserService.changePassword).toHaveBeenCalledWith({
        currentPassword: 'oldpass123',
        newPassword: 'newpass123'
      });
      expect(screen.getByText(/password updated successfully/i)).toBeInTheDocument();
    });
  });

  it('validates password change fields', async () => {
    render(<UserProfile />);

    const changePasswordButton = screen.getByRole('button', { name: /change password/i });
    fireEvent.click(changePasswordButton);

    await waitFor(() => {
      expect(screen.getByText(/current password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/confirm password is required/i)).toBeInTheDocument();
    });
  });
}); 