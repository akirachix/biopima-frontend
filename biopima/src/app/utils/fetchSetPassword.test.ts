import { setPassword } from "./fetchSetPassword";

describe("setPassword", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("returns result data when fetch succeeds", async () => {
    const mockResult = { success: true };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResult),
      } as Response)
    );

    const result = await setPassword("test@example.com", "password123");
    expect(result).toEqual(mockResult);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/set-password", expect.any(Object));
  });

  test("throws error with statusText when response not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Bad Request",
        json: () => Promise.resolve({}),
      } as Response)
    );

    await expect(setPassword("test@example.com", "password123")).rejects.toThrow(
      "Setting password failed: Bad Request"
    );
  });

  test("throws error when fetch itself fails", async () => {
    const errorMessage = "Network failure";
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));

    await expect(setPassword("test@example.com", "password123")).rejects.toThrow(
      `Failed to set password: ${errorMessage}`
    );
  });
});
