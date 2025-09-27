import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SetPasswordPage from './page';
import { useRouter } from 'next/navigation';
import useSetPassword from '../hooks/useFetchSetPassword';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../hooks/useFetchSetPassword');

describe('SetPasswordPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    pushMock.mockClear();
  });

  test('renders form and inputs', () => {
    (useSetPassword as jest.Mock).mockReturnValue({
      SetPassword: jest.fn(),
      loading: false,
      error: null,
    });

    render(<SetPasswordPage />);

    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Set Password/i})).toBeInTheDocument();
  });

  test('password validation error if less than 8 chars', async () => {
    (useSetPassword as jest.Mock).mockReturnValue({
      SetPassword: jest.fn(),
      loading: false,
      error: null,
    });

    render(<SetPasswordPage />);
    await userEvent.type(screen.getByPlaceholderText(/New Password/i), 'short');
    fireEvent.blur(screen.getByPlaceholderText(/New Password/i));
    expect(screen.getByText(/Password must be at least 8 characters./i)).toBeInTheDocument();
  });

  test('confirm password mismatch shows error', async () => {
    (useSetPassword as jest.Mock).mockReturnValue({
      SetPassword: jest.fn(),
      loading: false,
      error: null,
    });

    render(<SetPasswordPage />);
    await userEvent.type(screen.getByPlaceholderText(/New Password/i), 'password123');
    await userEvent.type(screen.getByPlaceholderText(/Confirm Password/i), 'password321');
    fireEvent.blur(screen.getByPlaceholderText(/Confirm Password/i));
    expect(screen.getByText(/Passwords do not match./i)).toBeInTheDocument();
  });

  test('successful password set shows success message and navigates', async () => {
    const mockSetPassword = jest.fn().mockResolvedValue({ success: true });
    (useSetPassword as jest.Mock).mockReturnValue({
      SetPassword: mockSetPassword,
      loading: false,
      error: null,
    });

    render(<SetPasswordPage />);

    await userEvent.type(screen.getByPlaceholderText(/Email Address/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/New Password/i), 'password123');
    await userEvent.type(screen.getByPlaceholderText(/Confirm Password/i), 'password123');

    fireEvent.click(screen.getByRole('button', { name: /Set Password/i }));

    await waitFor(() => screen.getByText(/Password Set Successful!/i));
    expect(screen.getByText(/Password Set Successful!/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Go to Login/i }));
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  test('show and hide password toggles input type', async () => {
    (useSetPassword as jest.Mock).mockReturnValue({
      SetPassword: jest.fn(),
      loading: false,
      error: null,
    });

    render(<SetPasswordPage />);

    const passwordInput = screen.getByPlaceholderText(/New Password/i);
    const toggleButton = screen.getAllByRole('button', { name: /Show password/i })[0];

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
