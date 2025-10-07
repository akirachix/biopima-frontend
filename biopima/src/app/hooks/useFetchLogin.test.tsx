import { renderHook, act, waitFor } from "@testing-library/react";
import { useLogin } from "./useFetchLogin";
import * as fetchLoginModule from "../utils/fetchLogin";

interface FakeUser {
  user_type: string;
  token?: string;
  user_id?: number;
}

describe("useLogin hook", () => {
  const mockLoginUser = jest.spyOn(fetchLoginModule, "loginUser");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets loading correctly during login", async () => {
    const fakeUser: FakeUser = { user_type: "admin" };

    mockLoginUser.mockImplementation(
      () =>
        new Promise<FakeUser>((resolve) => setTimeout(() => resolve(fakeUser), 50))
    );

    const { result } = renderHook(() => useLogin());

    expect(result.current.loading).toBe(false);

    let promise: Promise<FakeUser | null>;

    await act(async () => {
      promise = result.current.handleLogin("test@example.com", "password");
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await act(async () => {
      await promise;
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("returns result when login succeeds", async () => {
    const fakeUser: FakeUser = {
      user_type: "admin",
      token: "token123",
      user_id: 1,
    };
    mockLoginUser.mockResolvedValue(fakeUser);

    const { result } = renderHook(() => useLogin());

    let response: FakeUser | null = null;

    await act(async () => {
      response = await result.current.handleLogin("test@example.com", "password");
    });

    expect(response).toEqual(fakeUser);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("sets error when login fails", async () => {
    mockLoginUser.mockRejectedValue(new Error("Login failed"));

    const { result } = renderHook(() => useLogin());

    let response: FakeUser | null = null;

    await act(async () => {
      response = await result.current.handleLogin("test@example.com", "wrongpassword");
    });

    expect(response).toBeNull();
    expect(result.current.error).toBe("Login failed");
    expect(result.current.loading).toBe(false);
  });

  it("sets error when role does not match expectedRole", async () => {
    const fakeUser: FakeUser = { user_type: "user" };
    mockLoginUser.mockResolvedValue(fakeUser);

    const { result } = renderHook(() => useLogin());

    let response: FakeUser | null = null;

    await act(async () => {
      response = await result.current.handleLogin("test@example.com", "password", "admin");
    });

    expect(response).toBeNull();
    expect(result.current.error).toBe("This account does not have access to this role."); 
    expect(result.current.loading).toBe(false);
  });
});
