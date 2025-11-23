import { renderHook } from "@testing-library/react";
import useSWR from "swr";
import { useEvents } from "@/lib/api";

jest.mock("swr");
const mockedSWR = useSWR as jest.Mock;

describe("useEvents hook", () => {
  test("calls SWR with correct key", () => {
    mockedSWR.mockReturnValue({ data: [], isLoading: false });

    renderHook(() => useEvents());

    expect(mockedSWR).toHaveBeenCalledWith("/api/events", expect.any(Function), {
      keepPreviousData: true,
    });
  });
});
