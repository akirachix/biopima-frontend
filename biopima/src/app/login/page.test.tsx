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
    (useSearchParams as jest.Mock).mockReturnValue({ get: jest.fn().mockReturnValue(null) });
  });

  it("calls handleLogin and redirects on successful login", async () => {
    const mockHandleLogin = jest.fn().mockResolvedValue({
      user_type: "user",  
      token: "abc",
      user_id: 1,
    });
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
    expect(mockHandleLogin).toHaveBeenCalledWith("amanda123@example.com", "amanda@job", undefined);
    expect(mockPush).toHaveBeenCalledWith("/institution"); 
  });
});
