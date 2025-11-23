import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./page";

// Mock API calls
jest.mock("./lib/api", () => ({
  registerEvent: jest.fn(() => Promise.resolve({ registration_count: 6 })),
  leaveEvent: jest.fn(() => Promise.resolve({ registration_count: 4 })),
  fetchEvents: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        name: "Test Event",
        date: "2024-12-12",
        registration_count: 5,
      },
    ])
  ),
}));

// Mock SWR
jest.mock("swr");

describe("Events Page", () => {
  it("renders event list", async () => {
    render(<Home />);

    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText("Registrations: 5")).toBeInTheDocument();
  });

  it("calls register function when Register clicked", async () => {
    render(<Home />);

    fireEvent.click(screen.getByText("Register"));

    expect(require("./lib/api").registerEvent).toHaveBeenCalledWith(1);
  });

  it("calls leave function when Leave clicked", async () => {
    render(<Home />);

    fireEvent.click(screen.getByText("Leave"));

    expect(require("./lib/api").leaveEvent).toHaveBeenCalledWith(1);
  });
});
