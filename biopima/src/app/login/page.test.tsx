
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignInPage from "./page";
import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/useFetchLogin";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));


jest.mock("../../hooks/useFetchLogin", () => ({
  useLogin: () => ({
    handleLogin: jest.fn(),
    loading: false,
    error: null,
  }),
}));

describe("SignInPage", () => {
  const mockPush = jest.fn();
  const mockHandleLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useLogin as jest.Mock).mockImplementation(() => ({
      handleLogin: mockHandleLogin,
      loading: false,
      error: null,
    }));
  });

  it("renders form fields correctly", () => {
    const searchParams = Promise.resolve({ role: "consultant" });
    render(<SignInPage searchParams={searchParams} />);

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("submits form and redirects on successful login", async () => {
    mockHandleLogin.mockResolvedValueOnce(true);
    const searchParams = Promise.resolve({ role: "consultant" });

    render(<SignInPage searchParams={searchParams} />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith("user@example.com", "password123", "consultant");
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("passes undefined role when not provided", async () => {
    mockHandleLogin.mockResolvedValueOnce(true);
    const searchParams = Promise.resolve({});

    render(<SignInPage searchParams={searchParams} />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith("test@test.com", "pass", undefined);
    });
  });

  it("shows error message when login fails", () => {
    (useLogin as jest.Mock).mockImplementationOnce(() => ({
      handleLogin: jest.fn(),
      loading: false,
      error: "Invalid credentials",
    }));

    const searchParams = Promise.resolve({ role: "operator" });
    render(<SignInPage searchParams={searchParams} />);

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    const searchParams = Promise.resolve({ role: "consultant" });
    render(<SignInPage searchParams={searchParams} />);

    const passwordInput = screen.getByPlaceholderText("Enter your password") as HTMLInputElement;
    const toggleButton = screen.getByLabelText(/Show password/i);

    expect(passwordInput.type).toBe("password");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  it("navigates to forgot password page", () => {
    const searchParams = Promise.resolve({});
    render(<SignInPage searchParams={searchParams} />);

    fireEvent.click(screen.getByText("Forgot Password?"));
    expect(mockPush).toHaveBeenCalledWith("/forgot-password");
  });

  it("shows sign up link for non-institution roles", () => {
    const searchParams = Promise.resolve({ role: "consultant" });
    render(<SignInPage searchParams={searchParams} />);

    expect(screen.getByText(/Don’t have an account\?/i)).toBeInTheDocument();
  });

  it("hides sign up link for institution role", () => {
    const searchParams = Promise.resolve({ role: "institution" });
    render(<SignInPage searchParams={searchParams} />);

    expect(screen.queryByText(/Don’t have an account\?/i)).not.toBeInTheDocument();
  });
});