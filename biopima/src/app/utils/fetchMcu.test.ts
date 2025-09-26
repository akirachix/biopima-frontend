import { fetchMcu } from "./fetchMcu";

describe("fetchMcu", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns data when response is ok", async () => {
    const mockResponseData = [{ id: "201", type: "mcu" }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        statusText: "OK",
        json: () => Promise.resolve(mockResponseData),
      } as Response)
    );
    const result = await fetchMcu();
    expect(result).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith("/api/mcus");
  });

  it("throws error when response is not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Bad Request",
        json: () => Promise.resolve({}),
      } as Response)
    );
    await expect(fetchMcu()).rejects.toThrow("Something went wrong");
    expect(fetch).toHaveBeenCalledWith("/api/mcus");
  });

  it("throws error when mcu object is not found", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: () => Promise.resolve({}),
      } as Response)
    );
 
    await expect(fetchMcu()).rejects.toThrow("No Mcu matches the given query");
    expect(fetch).toHaveBeenCalledWith("/api/mcus");
  });

  it("throws error when fetching is rejected", async () => {
    const errorMessage = "Network failure";
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));
    await expect(fetchMcu()).rejects.toThrow("Network failure");
    expect(fetch).toHaveBeenCalledWith("/api/mcus");
  });

 
  it("returns empty array when no mcu objects are present", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response)
    );
    const result = await fetchMcu();
    expect(result).toEqual([]);
    expect(fetch).toHaveBeenCalledWith("/api/mcus");
  });
});