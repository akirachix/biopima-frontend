// src/app/dashboard/components/ActivityFeed/index.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import ActivityFeed from "./index";

// Mock icons for predictable testing
jest.mock("lucide-react", () => ({
  Thermometer: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="thermometer-icon" {...props} />
  ),
  AlertTriangle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="alert-triangle-icon" {...props} />
  ),
  Gauge: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="gauge-icon" {...props} />
  ),
  Activity: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="activity-icon" {...props} />
  ),
}));

describe("ActivityFeed", () => {
  beforeEach(() => {
    render(<ActivityFeed />);
  });

  it("renders Temp Warning event correctly", () => {
    // Check title
    expect(screen.getByText("Temp Warning")).toBeInTheDocument();

    // Use regex with wildcards to handle extra characters / formatting
    expect(screen.getByText(/Low Temperature Warning.*34\.6°C/i)).toBeInTheDocument();

    // Check thermometer icon
    expect(screen.getByTestId("thermometer-icon")).toBeInTheDocument();
  });

  it("renders Leak Warning event correctly", () => {
    // Check title
    expect(screen.getByText("Leak Warning")).toBeInTheDocument();

    // Use regex with wildcards to match the full dynamic text
    expect(screen.getByText(/Leak Warning.*1\.02 bar.*15\.0% drop/i)).toBeInTheDocument();

    // Check alert triangle icon
    expect(screen.getByTestId("alert-triangle-icon")).toBeInTheDocument();
  });

  it("renders overall Activity Feed container and description", () => {
    expect(screen.getByText("Activity Feed")).toBeInTheDocument();
    expect(screen.getByText("Recent system events and alerts.")).toBeInTheDocument();
  });
});
