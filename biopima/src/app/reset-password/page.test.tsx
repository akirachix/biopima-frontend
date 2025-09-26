import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordPage from "./page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockHandleResetPassword = jest.fn();
const mockUseResetPassword = {
  password: "",
  setPassword: jest.fn(),
  confirmPassword: "",
  setConfirmPassword: jest.fn(),
  error: "",
  message: "",
  handleResetPassword: mockHandleResetPassword,
};

jest.mock("../hooks/useResetPassword", () => () => mockUseResetPassword);

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key) => {
          if (key === "email") return "test@example.com";
          if (key === "otp") return "123456";
          return null;
        }),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  it("renders password and confirm password inputs and submit button", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("displays validation error for too short password", () => {
    render(<ResetPasswordPage />);
    const passwordInput = screen.getByPlaceholderText(/new password/i);
    fireEvent.change(passwordInput, { target: { value: "123" } });
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it("displays validation error when passwords do not match", () => {
    render(<ResetPasswordPage />);
    const passwordInput = screen.getByPlaceholderText(/new password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm password/i);
    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    fireEvent.change(confirmInput, { target: { value: "87654321" } });
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("calls handleResetPassword on valid form submit and shows 'Sending...'", async () => {
    mockHandleResetPassword.mockResolvedValueOnce(undefined);
    render(<ResetPasswordPage />);
    mockUseResetPassword.password = "12345678";
    mockUseResetPassword.confirmPassword = "12345678";
    mockUseResetPassword.setPassword("12345678");
    mockUseResetPassword.setConfirmPassword("12345678");
    const passwordInput = screen.getByPlaceholderText(/new password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm password/i);
    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    fireEvent.change(confirmInput, { target: { value: "12345678" } });
    const submitButton = screen.getByRole("button", { name: /reset password/i });
    fireEvent.click(submitButton);
    expect(await screen.findByRole("button", { name: /sending/i })).toBeDisabled();
    await waitFor(() => {
      expect(mockHandleResetPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "12345678",
        otp: "123456",
      });
    });
  });

  it("shows success message when password reset is successful", () => {
    mockUseResetPassword.message = "Password reset successful!";
    render(<ResetPasswordPage />);
    expect(screen.getByText(/password reset successful!/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to login/i })).toBeInTheDocument();
  });

  it("shows error message when error is set", () => {
    mockUseResetPassword.error = "Failed to reset password";
    mockUseResetPassword.message = "";
    render(<ResetPasswordPage />);
    expect(screen.getByText(/failed to reset password/i)).toBeInTheDocument();
  });
});
