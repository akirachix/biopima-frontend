// src/app/dashboard/components/StatusCard/index.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import StatusCard from ".";

// Mock lucide-react icons for predictable tests
jest.mock("lucide-react", () => ({
  AlertTriangle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="alert-triangle-icon" {...props} />
  ),
  Activity: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="activity-icon" {...props} />
  ),
}));

describe("StatusCard", () => {
  it("renders system status correctly", () => {
    render(<StatusCard type="system" />);

    // Check text content
    expect(screen.getByText("System Status")).toBeInTheDocument();
    expect(screen.getByText("All systems operational")).toBeInTheDocument();
    expect(screen.getByText("Warning")).toBeInTheDocument();

    // Check icon presence
    expect(screen.getByTestId("alert-triangle-icon")).toBeInTheDocument();
  });

  it("renders monitoring status correctly", () => {
    render(<StatusCard type="monitoring" />);

    // Check text content
    expect(
      screen.getByText(
        "Automatically monitoring pressure, temperature, & volume."
      )
    ).toBeInTheDocument();

    // Check icon presence
    expect(screen.getByTestId("activity-icon")).toBeInTheDocument();
  });
});
