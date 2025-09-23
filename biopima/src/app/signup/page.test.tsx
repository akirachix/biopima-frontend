import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import SignupPage from "./page";
import { useRouter } from "next/navigation";
import { useSignup } from "../hooks/useFetchSignup";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({ get: () => "user" })),
}));

jest.mock("../hooks/useFetchSignup", () => ({
  useSignup: jest.fn(),
}));

describe("SignupPage", () => {
  const mockHandleSignup = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useSignup as jest.Mock).mockReturnValue({
      handleSignup: mockHandleSignup,
      loading: false,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<SignupPage />);
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Company Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Create Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  it("updates inputs when user types", () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Company Name"), { target: { value: "Acme" } });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText("Create Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password123" } });
    expect(screen.getByPlaceholderText("Name")).toHaveValue("John");
    expect(screen.getByPlaceholderText("Company Name")).toHaveValue("Acme");
    expect(screen.getByPlaceholderText("Email Address")).toHaveValue("john@example.com");
    expect(screen.getByPlaceholderText("Phone Number")).toHaveValue("1234567890");
    expect(screen.getByPlaceholderText("Create Password")).toHaveValue("password123");
    expect(screen.getByPlaceholderText("Confirm Password")).toHaveValue("password123");
  });

  it("shows error if passwords do not match", async () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByPlaceholderText("Create Password"), {
      target: { value: "password1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    await waitFor(() => {
      expect(screen.getByText("Passwords do not match!")).toBeInTheDocument();
      expect(mockHandleSignup).not.toHaveBeenCalled();
    });
  });

  it("shows error if password less than 8 characters", async () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByPlaceholderText("Create Password"), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    await waitFor(() => {
      expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
      expect(mockHandleSignup).not.toHaveBeenCalled();
    });
  });

  it("submits form and redirects on successful signup", async () => {
    mockHandleSignup.mockResolvedValueOnce(true);
    render(<SignupPage />);
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Amanda" } });
    fireEvent.change(screen.getByPlaceholderText("Company Name"), { target: { value: "Ampersand" } });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "amanda123@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), { target: { value: "0678654324" } });
    fireEvent.change(screen.getByPlaceholderText("Create Password"), { target: { value: "amanda@job" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "amanda@job" } });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockHandleSignup).toHaveBeenCalledWith({
        name: "Amanda",
        companyName: "Ampersand",
        companyEmail: "amanda123@gmail.com",
        phone: "0678654324",
        password: "amanda@job",
        confirmPassword: "amanda@job",
      });
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("toggles password visibility", () => {
    render(<SignupPage />);
    const passwordInput = screen.getByPlaceholderText("Create Password");
    const confirmInput = screen.getByPlaceholderText("Confirm Password");
    const passwordToggle = screen.getByLabelText("Show password");
    const confirmToggle = screen.getByLabelText("Show confirm password");

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmInput).toHaveAttribute("type", "password");

    fireEvent.click(passwordToggle);
    expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(passwordToggle);
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(confirmToggle);
    expect(confirmInput).toHaveAttribute("type", "text");
    fireEvent.click(confirmToggle);
    expect(confirmInput).toHaveAttribute("type", "password");
  });
});
