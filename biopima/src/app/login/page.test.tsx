import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignInPage from "./login";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "../hooks/useFetchLogin";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../hooks/useFetchLogin', () => ({
  useLogin: jest.fn(),
}));


jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, priority, ...rest } = props;
    return (
      <img 
        {...rest} 
        fill={fill ? "true" : undefined} 
        priority={priority ? "true" : undefined} 
      />
    );
  },
}));

describe('SignInPage', () => {
  const mockPush = jest.fn();
  const mockGet = jest.fn();
  const mockHandleLogin = jest.fn();
  const mockLocalStorage = {
    setItem: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
    (useLogin as jest.Mock).mockReturnValue({
      handleLogin: mockHandleLogin,
      loading: false,
      error: null,
    });

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    jest.clearAllMocks();
  });

  test('renders sign in form correctly', () => {
    mockGet.mockReturnValue('consultant');
    
    const { container } = render(<SignInPage />);
    
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('BioPima')).toBeInTheDocument();
    
    expect(screen.getByText('Company Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    
    const signupPrompt = container.querySelector('p.text-center');
    expect(signupPrompt).toBeInTheDocument();
    expect(signupPrompt?.textContent).toContain('Don');
    expect(signupPrompt?.textContent).toContain('have an account');
    
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('does not show sign up link for institution role', () => {
    mockGet.mockReturnValue('institution');
    
    const { container } = render(<SignInPage />);
    
    const signupPrompt = container.querySelector('p.text-center');
    expect(signupPrompt).not.toBeInTheDocument();
    
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    mockGet.mockReturnValue('consultant');
    
    render(<SignInPage />);
    
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-label', 'Show password');
  });

  test('updates form fields on change', () => {
    mockGet.mockReturnValue('consultant');
    
    render(<SignInPage />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('submits form with correct values', async () => {
    mockGet.mockReturnValue('consultant');
    const mockResult = {
      user_id: '123',
      token: 'token123',
      email: 'test@example.com',
    };
    mockHandleLogin.mockResolvedValue(mockResult);
    
    render(<SignInPage />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(mockHandleLogin).toHaveBeenCalledWith('test@example.com', 'password123', 'consultant');
    
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('userId', '123');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'token123');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('email', 'test@example.com');
      expect(mockPush).toHaveBeenCalledWith('/settings');
    });
  });

  test('displays loading state during login', () => {
    mockGet.mockReturnValue('consultant');
    (useLogin as jest.Mock).mockReturnValue({
      handleLogin: mockHandleLogin,
      loading: true,
      error: null,
    });
    
    render(<SignInPage />);
    
    const submitButton = screen.getByRole('button', { name: 'Signing in...' });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass('opacity-70', 'cursor-not-allowed');
  });

  test('displays error message when login fails', () => {
    mockGet.mockReturnValue('consultant');
    (useLogin as jest.Mock).mockReturnValue({
      handleLogin: mockHandleLogin,
      loading: false,
      error: 'Invalid credentials',
    });
    
    render(<SignInPage />);
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    expect(screen.getByText('Invalid credentials')).toHaveClass('text-red-600');
  });

  test('navigates to forgot password page', () => {
    mockGet.mockReturnValue('consultant');
    
    render(<SignInPage />);
    
    const forgotPasswordButton = screen.getByText('Forgot Password?');
    fireEvent.click(forgotPasswordButton);
    
    expect(mockPush).toHaveBeenCalledWith('/forgot-password');
  });

  test('navigates to signup page', () => {
    mockGet.mockReturnValue('consultant');
    
    render(<SignInPage />);
    
    const signupButton = screen.getByText('Sign Up');
    fireEvent.click(signupButton);
    
    expect(mockPush).toHaveBeenCalledWith('/signup');
  });
});