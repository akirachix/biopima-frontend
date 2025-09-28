import { render, screen, fireEvent } from "@testing-library/react";
import SignInForm from "./login";
import { useLogin } from "../hooks/useFetchLogin";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("../hooks/useFetchLogin");
const mockUseLogin = useLogin as jest.Mock;

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("SignInForm", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  it("renders all input fields", () => {
    mockUseLogin.mockReturnValue({ handleLogin: jest.fn(), loading: false, error: null });
    render(<SignInForm />);

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
  });

  it("updates input fields on change", () => {
    mockUseLogin.mockReturnValue({ handleLogin: jest.fn(), loading: false, error: null });
    render(<SignInForm />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(emailInput, { target: { value: "amanda123@example.com" } });
    expect(emailInput).toHaveValue("amanda123@example.com");

    const passwordInput = screen.getByPlaceholderText("Enter your password");
    fireEvent.change(passwordInput, { target: { value: "amanda@job" } });
    expect(passwordInput).toHaveValue("amanda@job");
  });

  it("calls handleLogin and redirects on successful login", async () => {
    const mockHandleLogin = jest.fn().mockResolvedValue({});
    mockUseLogin.mockReturnValue({ handleLogin: mockHandleLogin, loading: false, error: null });

    render(<SignInForm />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "amanda123@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "amanda@job" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in|signing in/i }));

    await screen.findByPlaceholderText("Enter your email"); 
    expect(mockHandleLogin).toHaveBeenCalledWith(
      "amanda123@example.com",
      "amanda@job",
      undefined
    );
    expect(mockPush).toHaveBeenCalledWith("/institution");
  });

  it("shows error message if login fails", () => {
    mockUseLogin.mockReturnValue({ handleLogin: jest.fn(), loading: false, error: "Login failed" });
    render(<SignInForm />);

    const errorMessage = screen.getByText(/login failed/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("disables submit button while loading", () => {
    mockUseLogin.mockReturnValue({ handleLogin: jest.fn(), loading: true, error: null });
    render(<SignInForm />);

    const button = screen.getByRole("button", { name: /sign in|signing in/i });
    expect(button).toBeDisabled();
  });
});
