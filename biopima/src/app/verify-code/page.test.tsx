import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VerifyCodePage from "./page";
import { useVerifyCode } from "../hooks/useVerifyCode";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../hooks/useVerifyCode");

describe("VerifyCodePage", () => {
  const mockPush = jest.fn();
  const mockVerify = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useVerifyCode as jest.Mock).mockReturnValue({
      verify: mockVerify,
      loading: false,
      error: "",
      success: false,
    });
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "test@example.com"),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
  });

  it("renders all input boxes and buttons", () => {
    render(<VerifyCodePage />);
    expect(screen.getByText(/verify code/i)).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
    expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("updates input value on change", () => {
    render(<VerifyCodePage />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "1" } });
    expect(inputs[0]).toHaveValue("1");
  });

  it("calls verify with concatenated code on valid submit", async () => {
    (useVerifyCode as jest.Mock).mockReturnValue({
      verify: mockVerify,
      loading: false,
      error: "",
      success: false,
    });

    render(<VerifyCodePage />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    fireEvent.change(inputs[2], { target: { value: "3" } });
    fireEvent.change(inputs[3], { target: { value: "4" } });
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(mockVerify).toHaveBeenCalledWith("test@example.com", "1234");
    });
  });

  it("shows error message when error is present", () => {
    (useVerifyCode as jest.Mock).mockReturnValue({
      verify: mockVerify,
      loading: false,
      error: "Invalid code",
      success: false,
    });

    render(<VerifyCodePage />);
    expect(screen.getByText(/invalid code/i)).toBeInTheDocument();
  });

  it("redirects to /resetpassword on success", () => {
    (useVerifyCode as jest.Mock).mockReturnValue({
      verify: mockVerify,
      loading: false,
      error: "",
      success: true,
    });

    render(<VerifyCodePage />);
    expect(screen.getByText(/verification successful/i)).toBeInTheDocument();
  });

  it("cancel button redirects to /forgotpassword", () => {
    render(<VerifyCodePage />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockPush).toHaveBeenCalledWith("/forgotpassword");
  });
});
