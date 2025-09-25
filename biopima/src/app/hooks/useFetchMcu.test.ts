import { renderHook, waitFor } from "@testing-library/react";
import useFetchMcu from "./useFetchMcu";
import { fetchMcu } from "../utils/fetchMcu";
import { McuType } from "../utils/types"; 


jest.mock("../utils/fetchMcu");

describe("useFetchMcu hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with loading true and error null", async () => {
    (fetchMcu as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useFetchMcu());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.mcu).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("should fetch and set MCU data successfully", async () => {
    const mockMcu: McuType[] = [
      {
        mcu_id: 1,
        description: "MCU",
        status: "active",
        installed_at: "2025-09-01",
        updated_at: "2025-09-02",
        user: 1,
      },
    ];

    (fetchMcu as jest.Mock).mockResolvedValue(mockMcu);

    const { result } = renderHook(() => useFetchMcu());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.mcu).toEqual(mockMcu);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    (fetchMcu as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useFetchMcu());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Network Error");
    expect(result.current.mcu).toEqual([]);
  });

  it("should handle the case where no MCU items are found", async () => {
    (fetchMcu as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useFetchMcu());

    expect(result.current.loading).toBe(true);
    expect(result.current.mcu).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.mcu).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});