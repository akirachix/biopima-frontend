import { fetchUser, updateUser } from "./fetchProfile";
import { UserSettings } from "./types/profile";

global.fetch = jest.fn();

describe("fetchUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("successfully fetches user data", async () => {
    const mockUserData = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      phone_number: "1234567890",
      image: "profile.jpg",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
      text: async () => JSON.stringify(mockUserData),
    });

    const result = await fetchUser(
      "https://api.example.com",
      "123",
      "token123"
    );

    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/api/user/123/",
      expect.objectContaining({
        headers: {
          Authorization: "Bearer token123",
          "Content-Type": "application/json",
        },
      })
    );

    expect(result).toEqual(mockUserData);
  });

  test("handles API error response", async () => {
    const errorMessage = "User not found";
    const errorResponse = { error: errorMessage };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => errorResponse,
      text: async () => JSON.stringify(errorResponse),
    });

    await expect(
      fetchUser("https://api.example.com", "123", "token123")
    ).rejects.toThrow(errorMessage);
  });

  test("handles network error", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    await expect(
      fetchUser("https://api.example.com", "123", "token123")
    ).rejects.toThrow("Network error");
  });
});

describe("updateUser", () => {
  const mockSettings: UserSettings = {
    fullName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "1234567890",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("successfully updates user without image", async () => {
    const mockResponse = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      phone_number: "1234567890",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    const result = await updateUser(
      "https://api.example.com",
      "123",
      mockSettings,
      null,
      "token123"
    );

    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/api/user/123/",
      expect.objectContaining({
        method: "PUT",
        headers: {
          Authorization: "Bearer token123",
        },
        body: expect.any(FormData),
      })
    );

    const formData = (fetch as jest.Mock).mock.calls[0][1].body as FormData;
    expect(formData.get("id")).toBe("123");
    expect(formData.get("name")).toBe("John Doe");
    expect(formData.get("email")).toBe("john@example.com");
    expect(formData.get("phone_number")).toBe("1234567890");
    expect(formData.get("image")).toBeNull();

    expect(result).toEqual(mockResponse);
  });

  test("successfully updates user with image", async () => {
    const mockImageFile = new File(["test"], "test.jpg", {
      type: "image/jpeg",
    });
    const mockResponse = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      phone_number: "1234567890",
      image: "new-profile.jpg",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    const result = await updateUser(
      "https://api.example.com",
      "123",
      mockSettings,
      mockImageFile,
      "token123"
    );

    const formData = (fetch as jest.Mock).mock.calls[0][1].body as FormData;
    expect(formData.get("image")).toBe(mockImageFile);

    expect(result).toEqual(mockResponse);
  });

  test("handles API error during update", async () => {
    const errorMessage = "Update failed";
    const errorResponse = { detail: errorMessage };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => errorResponse,
      text: async () => JSON.stringify(errorResponse),
    });

    await expect(
      updateUser(
        "https://api.example.com",
        "123",
        mockSettings,
        null,
        "token123"
      )
    ).rejects.toThrow(errorMessage);
  });

  test("handles network error during update", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    await expect(
      updateUser(
        "https://api.example.com",
        "123",
        mockSettings,
        null,
        "token123"
      )
    ).rejects.toThrow("Network error");
  });

  test("works without token", async () => {
    const mockResponse = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      phone_number: "1234567890",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
      text: async () => JSON.stringify(mockResponse),
    });

    await updateUser(
      "https://api.example.com",
      "123",
      mockSettings,
      null,
      undefined
    );

    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/api/user/123/",
      expect.objectContaining({
        method: "PUT",
        headers: {
          Authorization: "",
        },
        body: expect.any(FormData),
      })
    );
  });
});
