import { render, screen } from "@testing-library/react";
import EventList from "@/components/EventList";
import { useEvents } from "@/lib/api";

jest.mock("@/lib/api");

describe("EventList – Loading State", () => {
  test("shows loading message", () => {
    (useEvents as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<EventList />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
