import { renderHook, act } from "@testing-library/react";
import { useVerifyCode } from "./useVerifyCode";
import { verifyCodeApi } from "../utils/fetchVerifyCode";

jest.mock("../utils/fetchVerifyCode");

describe("useVerifyCode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets success true on successful verify call", async () => {
    (verifyCodeApi as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useVerifyCode());

    await act(async () => {
      await result.current.verify("test@example.com", "1234");
    });

    expect(verifyCodeApi).toHaveBeenCalledWith("test@example.com", "1234");
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBe("");
    expect(result.current.loading).toBe(false);
  });

  it("sets error message on failed verify call", async () => {
    (verifyCodeApi as jest.Mock).mockRejectedValue(new Error("Invalid code"));

    const { result } = renderHook(() => useVerifyCode());

    await act(async () => {
      await result.current.verify("test@example.com", "9999");
    });

    expect(result.current.error).toBe("Invalid code");
    expect(result.current.success).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it("sets loading true while verifying", async () => {
    let resolvePromise: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    (verifyCodeApi as jest.Mock).mockReturnValue(promise);

    const { result } = renderHook(() => useVerifyCode());

    act(() => {
      result.current.verify("test@example.com", "1234");
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise();
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });
});
