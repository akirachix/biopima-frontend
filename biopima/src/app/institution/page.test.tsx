import { render, screen, within } from "@testing-library/react";
import Dashboard from "./page";

jest.mock("../hooks/useFetchMcu", () => ({
  __esModule: true,
  default: () => ({
    mcu: [
      { user: "1", status: "active" },
      { user: "2", status: "inactive" },
    ],
  }),
}));

jest.mock("../hooks/useFetchUsers", () => ({
  __esModule: true,
  default: () => ({
    users: [
      { id: "1", name: "Client A", user_type: "Institutional operator" },
      { id: "2", name: "Client B", user_type: "Institutional operator" },
      { id: "3", name: "Client C", user_type: "Individual" },
    ],
  }),
}));

jest.mock("../hooks/useFetchSensorReadings", () => ({
  __esModule: true,
  default: () => ({
    sensorReadings: [
      { methane_level: "2.1", temperature_level: "34", pressure_level: "7" },
      { methane_level: "1.8", temperature_level: "36", pressure_level: "10" },
      { methane_level: "0.5", temperature_level: "38", pressure_level: "16" },
    ],
  }),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    render(<Dashboard />);
  });

  it("renders the client list table correctly with names and statuses", () => {
    const rows = screen.getAllByRole("row"); 
  
    const dataRows = rows.slice(1);

    const clientARow = dataRows.find((row) =>
      within(row).queryByText("Client A")
    );
    expect(clientARow).toBeDefined();
    expect(clientARow && within(clientARow).getByText(/active/i)).toBeInTheDocument();

    const clientBRow = dataRows.find((row) =>
      within(row).queryByText("Client B")
    );
    expect(clientBRow).toBeDefined();
    expect(clientBRow && within(clientBRow).getByText(/inactive/i)).toBeInTheDocument();
  });
});
