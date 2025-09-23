import { fetchUsers, createUser } from "./fetchUsers";
import { NewUserType } from "./types";

describe("fetchUsers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns data when response is ok", async () => {
    const mockResponseData = [{ id: "1", name: "Makuto" }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        statusText: "OK",
        json: () => Promise.resolve(mockResponseData),
      } as Response)
    );
    const result = await fetchUsers();
    expect(result).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith("/api/user");
  });

  it("throws error when response is not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: () => Promise.resolve({}),
      } as Response)
    );
    await expect(fetchUsers()).rejects.toThrow("Something went wrong");
    expect(fetch).toHaveBeenCalledWith("/api/user");
  });

  it("throws error when fetch rejects", async () => {
    const errorMessage = "Network failure";
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));
    await expect(fetchUsers()).rejects.toThrow(
      "Failed to fetch users" + errorMessage
    );
    expect(fetch).toHaveBeenCalledWith("/api/user");
  });
});

describe("createUser", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns data when user is created successfully", async () => {
    const mockUser: NewUserType = {
      name: "mildred",
      email: "mildred@example.com",
      username: "mildred",
      phone_number: "0734567890",
      user_type: "Institutional operator",
      password: "milenna#500",
    };
    const mockResponseData = { id: "2", ...mockUser };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        statusText: "Created",
        json: () => Promise.resolve(mockResponseData),
      } as Response)
    );

    const result = await createUser(mockUser);
    expect(result).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith(
      "/api/user",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockUser),
      })
    );
  });

  it("throws generic error on non-ok response", async () => {
    const mockUser: NewUserType = {
      name: "Eve",
      email: "eve@example.com",
      username: "eve",
      phone_number: "0787654321",
      user_type: "Institutional operator",
      password: "evera@207",
    };
    const statusText = "Bad Request";
    const status = 400;

    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status,
        statusText,
        json: () => Promise.resolve({}),
      } as Response)
    );

    await expect(createUser(mockUser)).rejects.toThrow(
      `Something went wrong: ${status} ${statusText}`
    );
    expect(fetch).toHaveBeenCalledWith(
      "/api/user",
      expect.objectContaining({
        method: "POST",
      })
    );
  });


  it("throws generic error when fetch rejects", async () => {
    const mockUser: NewUserType = {
      name: "Sam",
      email: "sam@example.com",
      username: "sam",
      phone_number: "0722334455",
      user_type: "Institutional operator",
      password: "password#607",
    };
    const errorMessage = "Network error";
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));

    await expect(createUser(mockUser)).rejects.toThrow(
      "Failed to create user: " + errorMessage
    );
    expect(fetch).toHaveBeenCalledWith(
      "/api/user",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockUser),
      })
    );
  });
});
