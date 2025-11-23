import { render } from "@testing-library/react";
import EventList from "@/components/EventList";
import { useEvents } from "@/lib/api";

jest.mock("@/lib/api");

describe("EventList Snapshot", () => {
  test("matches snapshot", () => {
    (useEvents as jest.Mock).mockReturnValue({
      data: [
        { id: 1, name: "Snapshot Event", date: "2025-02-01", registration_count: 3 },
      ],
      isLoading: false,
      mutate: jest.fn(),
    });

    const { container } = render(<EventList />);
    expect(container).toMatchSnapshot();
  });
});
