import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import SignupForm from "./signup"; 
import { useRouter } from "next/navigation";
import { useSignup } from "../hooks/useFetchSignup";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../hooks/useFetchSignup", () => ({
  useSignup: jest.fn(),
}));

describe("SignupForm", () => {
  const mockHandleSignup = jest.fn();
  const mockPush = jest.fn();

  
  const mockSearchParams = Promise.resolve({ role: "user" });

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

  it("updates inputs when user types", async () => {
    await act(async () => {
      render(<SignupForm searchParams={mockSearchParams} />);
    });

  
    await screen.findByPlaceholderText("Name");

    const inputs = {
      name: "John",
      companyName: "Acme",
      companyEmail: "john@example.com",
      phone: "1234567890",
      password: "password123",
      confirmPassword: "password123",
    };

    for (const [name, value] of Object.entries(inputs)) {
      const placeholder =
        name === "name"
          ? "Name"
          : name === "companyName"
          ? "Company Name"
          : name === "companyEmail"
          ? "Email Address"
          : name === "phone"
          ? "Phone Number"
          : name === "password"
          ? "Create Password"
          : "Confirm Password";

      const input = screen.getByPlaceholderText(placeholder);
      fireEvent.change(input, { target: { value } });
      expect(input).toHaveValue(value);
    }
  });

  it("shows error if passwords do not match", async () => {
    await act(async () => {
      render(<SignupForm searchParams={mockSearchParams} />);
    });

    fireEvent.change(await screen.findByPlaceholderText("Create Password"), {
      target: { value: "pass1234" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "pass5678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match!")).toBeInTheDocument();
      expect(mockHandleSignup).not.toHaveBeenCalled();
    });
  });

  it("shows error if password is less than 8 characters", async () => {
    await act(async () => {
      render(<SignupForm searchParams={mockSearchParams} />);
    });

    fireEvent.change(await screen.findByPlaceholderText("Create Password"), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 8 characters")
      ).toBeInTheDocument();
      expect(mockHandleSignup).not.toHaveBeenCalled();
    });
  });

  it("filters non-digit characters from phone input", async () => {
    await act(async () => {
      render(<SignupForm searchParams={mockSearchParams} />);
    });

    const phoneInput = await screen.findByPlaceholderText("Phone Number");
    fireEvent.change(phoneInput, { target: { value: "12a34b56c78" } });
    expect(phoneInput).toHaveValue("12345678");
  });

  it("submits form and redirects on successful signup", async () => {
    mockHandleSignup.mockResolvedValueOnce(true);
    await act(async () => {
      render(<SignupForm searchParams={mockSearchParams} />);
    });

    fireEvent.change(await screen.findByPlaceholderText("Name"), {
      target: { value: "Amanda" },
    });
    fireEvent.change(screen.getByPlaceholderText("Company Name"), {
      target: { value: "Ampersand" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), {
      target: { value: "amanda123@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "0678654324" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create Password"), {
      target: { value: "amanda@job" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "amanda@job" },
    });

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

  it("toggles password visibility", async () => {
    await act(async () => {
      render(<SignupForm searchParams={mockSearchParams} />);
    });

    const passwordInput = await screen.findByPlaceholderText("Create Password");
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

  it("navigates to login when 'Sign In' is clicked", async () => {
    await act(async () => {
      render(<SignupForm searchParams={mockSearchParams} />);
    });
    fireEvent.click(await screen.findByText("Sign In"));
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
