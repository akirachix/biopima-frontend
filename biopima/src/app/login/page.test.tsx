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
jest.mock("../hooks/useFetchLogin", () => ({
  useLogin: jest.fn(),
}));
describe("SignInPage", () => {
  const mockHandleLogin = jest.fn();
  const mockPush = jest.fn();
  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(() => undefined),
    });
    (useLogin as jest.Mock).mockReturnValue({
      handleLogin: mockHandleLogin,
      loading: false,
      error: null,
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders all form fields", () => {
    render(<SignInPage/>);
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
  });
  it("calls handleLogin and redirects on successful login", async () => {
    mockHandleLogin.mockResolvedValueOnce(true);
    render(<SignInPage/>);
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "amanda123@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "amanda@job" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Sign In/i }).closest("form")!);
    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith("amanda123@example.com", "amanda@job", undefined);
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
  it("shows error message if login fails", () => {
    (useLogin as jest.Mock).mockReturnValue({
      handleLogin: jest.fn(),
      loading: false,
      error: "Invalid email or password",
    });
    render(<SignInPage/>);
    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });
  it("toggles password visibility", () => {
    render(<SignInPage/>);
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const toggleButton = screen.getByLabelText("Show password");
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
  it("navigates to forgot password page when link is clicked", () => {
    render(<SignInPage/>);
    fireEvent.click(screen.getByText("Forgot Password?"));
    expect(mockPush).toHaveBeenCalledWith("/forgot-password");
  });
});
