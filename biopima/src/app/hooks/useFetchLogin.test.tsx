import { renderHook, act } from "@testing-library/react";
import { useLogin } from "./useFetchLogin";
import * as fetchLoginModule from "../utils/fetchLogin";

interface FakeUser {
  user: {
    role: string;
  };
}

describe("useLogin hook", () => {
  const mockLoginUser = jest.spyOn(fetchLoginModule, "loginUser");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets loading correctly during login", async () => {
    const fakeUser: FakeUser = { user: { role: "admin" } };

    mockLoginUser.mockImplementation(
      () =>
        new Promise<FakeUser>((resolve) => {
          setTimeout(() => resolve(fakeUser), 50);
        })
    );

    const { result } = renderHook(() => useLogin());

    let promise: Promise<FakeUser | null>;

    act(() => {
      promise = result.current.handleLogin("test@example.com", "password");
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.loading).toBe(true);

   
    await act(async () => {
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it("returns result when login succeeds", async () => {
    const fakeUser: FakeUser = { user: { role: "admin" } };
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
      response = await result.current.handleLogin(
        "test@example.com",
        "wrongpassword"
      );
    });

    expect(response).toBeNull();
    expect(result.current.error).toBe("Login failed");
    expect(result.current.loading).toBe(false);
  });

  it("sets error when role does not match expectedRole", async () => {
    const fakeUser: FakeUser = { user: { role: "user" } };
    mockLoginUser.mockResolvedValue(fakeUser);

    const { result } = renderHook(() => useLogin());

    let response: FakeUser | null = null;
    await act(async () => {
      response = await result.current.handleLogin(
        "test@example.com",
        "password",
        "admin"
      );
    });

    expect(response).toBeNull();
    expect(result.current.error).toBe(
      "This account does not have access to this role."
    );
    expect(result.current.loading).toBe(false);
  });
});
