import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import ForgetPasswordPage from './page';
import useForgotPassword from '../hooks/useForgotPassword';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../hooks/useForgotPassword');

describe('ForgetPasswordPage', () => {
  const mockPush = jest.fn();
  const mockSendResetEmail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders the form', () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      sendResetEmail: mockSendResetEmail,
      loading: false,
      error: null,
      success: false,
    });

    render(<ForgetPasswordPage />);
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('updates email input value', () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      sendResetEmail: mockSendResetEmail,
      loading: false,
      error: null,
      success: false,
    });

    render(<ForgetPasswordPage />);
    const input = screen.getByLabelText(/Email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect((input as HTMLInputElement).value).toBe('test@example.com');
  });


  it('disables submit button while loading', () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      sendResetEmail: jest.fn(),
      loading: true,
      error: null,
      success: false,
    });

    render(<ForgetPasswordPage />);
    expect(screen.getByRole('button', { name: /Sending.../i })).toBeDisabled();
  });

  it('navigates to /verify-code on success', () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      sendResetEmail: mockSendResetEmail,
      loading: false,
      error: null,
      success: true,
    });

    render(<ForgetPasswordPage />);
    expect(mockPush).toHaveBeenCalledWith('/verify-code');
  });

  it('displays error message when error exists', () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      sendResetEmail: mockSendResetEmail,
      loading: false,
      error: 'Email not found',
      success: false,
    });

    render(<ForgetPasswordPage />);
    expect(screen.getByText('Email not found')).toBeInTheDocument();
    expect(screen.getByText(/Please check your email address/i)).toBeInTheDocument();
  });
});
