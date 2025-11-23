import { registerEvent, leaveEvent } from "@/lib/api";

global.fetch = jest.fn();

describe("API functions", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("registerEvent calls correct endpoint", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    await registerEvent(1);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/events/1/register"),
      expect.objectContaining({ method: "POST" })
    );
  });

  test("leaveEvent calls correct endpoint", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    await leaveEvent(1);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/events/1/leave"),
      expect.objectContaining({ method: "POST" })
    );
  });
});
