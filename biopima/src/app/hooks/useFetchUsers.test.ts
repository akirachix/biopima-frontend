import { renderHook, waitFor, act } from "@testing-library/react";
import useFetchUsers from "./useFetchUsers";
import { fetchUsers, createUser } from "../utils/fetchUsers";
import { NewUserType, UserType } from "../utils/types";

jest.mock("../utils/fetchUsers");
const mockFetchUsers = fetchUsers as jest.Mock;
const mockCreateUser = createUser as jest.Mock;

describe("useFetchUsers hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should start with loading true and no error", async () => {
    mockFetchUsers.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useFetchUsers());
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("should fetch and set users successfully", async () => {
    const mockUsers: UserType[] = [
      {
        id: 1,
        username: "makutomercy",
        name: "Makuto",
        image: "",
        email: "makuto@test.com",
        phone_number: "0734567890",
        user_type: "Institutional operator",
        password: "",
      },
      {
        id: 2,
        username: "marionnyai",
        name: "Marion",
        image: "",
        email: "marion@test.com",
        phone_number: "0787654321",
        user_type: "Consultant",
        password: "",
      },
    ];
    mockFetchUsers.mockResolvedValueOnce(mockUsers);
    const { result } = renderHook(() => useFetchUsers());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(mockUsers);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    const errorMessage = "Network Error";
    mockFetchUsers.mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useFetchUsers());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(errorMessage);
  });

it("should handle where no user matches the query", async () => {
    const errorMessage = "No user matches the given query";
    mockFetchUsers.mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useFetchUsers());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it("should create a user successfully", async () => {
    const newUserPayload: NewUserType = {
      name: "mildred",
      email: "mildred@example.com",
      username: "mildred",
      phone_number: "0734567890",
      user_type: "Institutional operator",
      password: "biopima1234",
    };
    const createdUserResponse: UserType = {
      id: 1,
      ...newUserPayload,
      image: "image-url",
    };
    mockCreateUser.mockResolvedValueOnce(createdUserResponse);
    const { result } = renderHook(() => useFetchUsers());
    let createdUser: any;
    await act(async () => {
      createdUser = await result.current.AddUser(newUserPayload);
    });
    expect(mockCreateUser).toHaveBeenCalledWith(newUserPayload);
    expect(result.current.successMessage).toBe("User created successfully!");
    expect(createdUser).toEqual(createdUserResponse);
  });

  it("should handle user creation error", async () => {
    const newUserPayload: NewUserType = {
      name: "mildred",
      email: "mildred@example.com",
      username: "mildred",
      phone_number: "0734567890",
      user_type: "Institutional operator",
      password: "password@20",
    };
    const errorMessage = "Failed to create user";
    mockCreateUser.mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useFetchUsers());
    await act(async () => {
      await expect(result.current.AddUser(newUserPayload)).rejects.toThrow(
        errorMessage
      );
    });
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.successMessage).toBe(null);
  });

  it("should not create a user when some required fields are missing", async () => {
    const partialPayload = {
      name: "Mercy",
      email: "mercy@gmail.com",
      username: "",
      phone_number: "",
      user_type: "Institutional operator",
      password: "",
    };
    const errorMessage = "All fields are required";
    mockCreateUser.mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useFetchUsers());
    await act(async () => {
      await expect(result.current.AddUser(partialPayload as any)).rejects.toThrow(
        errorMessage
      );
    });
    expect(mockCreateUser).toHaveBeenCalledWith(partialPayload);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.successMessage).toBe(null);
  });

});