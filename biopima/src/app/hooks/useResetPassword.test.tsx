import { renderHook, act } from "@testing-library/react";
import useForgotPassword from "./useForgotPassword";
import { useRouter } from "next/navigation";
import forgotPasswordApi from "../utils/fetchForgotPassword";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../utils/fetchForgotPassword");

describe("useForgotPassword", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("sets success and message on successful API call", async () => {
    (forgotPasswordApi as jest.Mock).mockResolvedValue({ detail: "OTP sent successfully" });
    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.sendResetEmail("test@example.com");
    });

    expect(forgotPasswordApi).toHaveBeenCalledWith("test@example.com");
    expect(result.current.success).toBe(true);
    expect(result.current.message).toMatch(/otp sent/i);
  });

  it("sets error on API failure response", async () => {
    (forgotPasswordApi as jest.Mock).mockResolvedValue({ detail: "Error sending OTP" });
    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.sendResetEmail("test@example.com");
    });

    expect(result.current.error).toBe("Error sending OTP");
    expect(result.current.success).toBe(false);
  });

  it("sets error on API throwing error", async () => {
    (forgotPasswordApi as jest.Mock).mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.sendResetEmail("test@example.com");
    });

    expect(result.current.error).toBe("Network error");
  });
});
