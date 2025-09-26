import { renderHook, act } from "@testing-library/react";
import { useUserSettings } from "./useFetchSettings";
import { updateUser } from "../utils/fetchProfile";

jest.mock("../utils/fetchSettings");

describe("useUserSettings", () => {
  const mockUpdateUser = updateUser as jest.MockedFunction<typeof updateUser>;
  const mockSettings = { theme: "dark" } as any;
  const mockBaseUrl = "https://api.example.com";
  const mockUserId = "user123";
  const mockToken = "token456";
  const mockImageFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have initial state", () => {
    const { result } = renderHook(() => useUserSettings());

    expect(result.current.updating).toBe(false);
    expect(result.current.updateError).toBe(null);
    expect(result.current.success).toBe(false);
  });

  describe("fetch behavior", () => {
    it("should set updating to true during fetch operation", async () => {
      let resolveUpdate: any;
      const updatePromise = new Promise<void>((resolve) => {
        resolveUpdate = resolve;
      });

      mockUpdateUser.mockReturnValueOnce(updatePromise);
      const { result } = renderHook(() => useUserSettings());

      act(() => {
        result.current.updateSettings(mockBaseUrl, mockUserId, mockSettings);
      });

      expect(result.current.updating).toBe(true);

      await act(async () => {
        resolveUpdate();
        await updatePromise;
      });
    });

    it("should set updating to false after successful fetch", async () => {
      mockUpdateUser.mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useUserSettings());

      await act(async () => {
        await result.current.updateSettings(
          mockBaseUrl,
          mockUserId,
          mockSettings
        );
      });

      expect(result.current.updating).toBe(false);
    });

    it("should set updating to false after failed fetch", async () => {
      const error = new Error("Update failed");
      mockUpdateUser.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useUserSettings());

      await act(async () => {
        await result.current.updateSettings(
          mockBaseUrl,
          mockUserId,
          mockSettings
        );
      });

      expect(result.current.updating).toBe(false);
    });

    it("should reset states before starting new fetch", async () => {
      mockUpdateUser.mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useUserSettings());

      await act(async () => {
        await result.current.updateSettings(
          mockBaseUrl,
          mockUserId,
          mockSettings
        );
      });

      expect(result.current.success).toBe(true);
      expect(result.current.updateError).toBe(null);

      mockUpdateUser.mockRejectedValueOnce(new Error("New error"));
      await act(async () => {
        await result.current.updateSettings(
          mockBaseUrl,
          mockUserId,
          mockSettings
        );
      });

      expect(result.current.success).toBe(false);
      expect(result.current.updateError).toBe("New error");
    });

    it("should return true on successful fetch", async () => {
      mockUpdateUser.mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useUserSettings());

      let returnValue;
      await act(async () => {
        returnValue = await result.current.updateSettings(
          mockBaseUrl,
          mockUserId,
          mockSettings
        );
      });

      expect(returnValue).toBe(true);
    });

    it("should return false on failed fetch", async () => {
      const error = new Error("Update failed");
      mockUpdateUser.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useUserSettings());

      let returnValue;
      await act(async () => {
        returnValue = await result.current.updateSettings(
          mockBaseUrl,
          mockUserId,
          mockSettings
        );
      });

      expect(returnValue).toBe(false);
    });
  });

  it("should set success on successful update", async () => {
    mockUpdateUser.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useUserSettings());

    await act(async () => {
      await result.current.updateSettings(
        mockBaseUrl,
        mockUserId,
        mockSettings
      );
    });

    expect(result.current.success).toBe(true);
    expect(result.current.updateError).toBe(null);
  });

  it("should set error on failed update", async () => {
    const error = new Error("Update failed");
    mockUpdateUser.mockRejectedValueOnce(error);
    const { result } = renderHook(() => useUserSettings());

    await act(async () => {
      await result.current.updateSettings(
        mockBaseUrl,
        mockUserId,
        mockSettings
      );
    });

    expect(result.current.updateError).toBe("Update failed");
    expect(result.current.success).toBe(false);
  });

  it("should fail update when required field is empty", async () => {
    mockUpdateUser.mockRejectedValueOnce(new Error("User ID is required"));

    const { result } = renderHook(() => useUserSettings());

    let returnValue;
    await act(async () => {
      returnValue = await result.current.updateSettings(
        mockBaseUrl,
        "",
        mockSettings
      );
    });

    expect(returnValue).toBe(false);
    expect(result.current.updateError).toBe("User ID is required");
    expect(result.current.success).toBe(false);
  });
});
