import { render, screen } from "@testing-library/react";
import EventList from "@/components/EventList";
import { useEvents } from "@/lib/api";

jest.mock("@/lib/api");

describe("EventList – Error State", () => {
  test("shows error when no events returned", () => {
    (useEvents as jest.Mock).mockReturnValue({
      data: null,
      error: new Error("Fetch failed"),
      isLoading: false,
    });

    render(<EventList />);

    expect(screen.getByText(/no events/i)).toBeInTheDocument();
  });
});
