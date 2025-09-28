
import { renderHook, act } from "@testing-library/react";
import useSetPassword from "./useFetchSetPassword";

import { setPassword as mockSetPassword } from "../utils/fetchSetPassword";

jest.mock("../utils/fetchSetPassword");

describe("useSetPassword", () => {
 
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sets loading state correctly and returns result on success", async () => {
    const mockedResult = { success: true };
  
    (mockSetPassword as jest.Mock).mockResolvedValue(mockedResult);

    const { result } = renderHook(() => useSetPassword());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);

    await act(async () => {
      const res = await result.current.SetPassword("test@example.com", "password123");
      expect(res).toEqual(mockedResult);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test("sets error state when setPassword rejects", async () => {
    const errorMessage = "Network Error";
    (mockSetPassword as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useSetPassword());

    await act(async () => {
      const res = await result.current.SetPassword("test@example.com", "password123");
      expect(res).toBeNull();
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });
  
  test("handles the custom error thrown when setPassword returns null", async () => {
  
    (mockSetPassword as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useSetPassword());

    await act(async () => {
      const res = await result.current.SetPassword("test@example.com", "password123");
      expect(res).toBeNull();
    });

  
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Setting password failed");
  });
});
