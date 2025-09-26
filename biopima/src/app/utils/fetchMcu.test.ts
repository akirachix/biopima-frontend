import { fetchMcu } from "./fetchMcu";

describe("fetchMcu", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns data when response is ok", async () => {
    const mockResponseData = [{ id: "201", type: "mcu" }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      statusText: "OK",
      json: () => Promise.resolve(mockResponseData),
    } as Response);

    const result = await fetchMcu();

    expect(result).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith("/api/mcus");
  });

  it("throws error when response is not ok but not 404", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: "Bad Request",
      json: () => Promise.resolve({}),
    } as Response);

    await expect(fetchMcu()).rejects.toThrow("Failed to fetch mcuSomething went wrongBad Request");
    expect(fetch).toHaveBeenCalledWith("/api/mcus");
  });

 

  it("throws error when fetch promise rejects", async () => {
    const errorMessage = "Network failure";
    global.fetch = jest.fn().mockRejectedValue(new Error(errorMessage));

    await expect(fetchMcu()).rejects.toThrow("Failed to fetch mcuNetwork failure");
    expect(fetch).toHaveBeenCalledWith("/api/mcus");
  });

  it("returns empty array when no mcu objects are present", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);

    const result = await fetchMcu();

    expect(result).toEqual([]);
    expect(fetch).toHaveBeenCalledWith("/api/mcus");
  });
});
