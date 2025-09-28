// src/app/dashboard/components/MetricCard/index.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import MetricCard from ".";

// Mock icons so we can check them via data-testid
jest.mock("lucide-react", () => ({
  Activity: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="activity-icon" {...props} />
  ),
  Thermometer: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="thermometer-icon" {...props} />
  ),
  Gauge: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="gauge-icon" {...props} />
  ),
}));

describe("MetricCard", () => {
  it("renders methane metric correctly", () => {
    render(
      <MetricCard
        title="Methane Level"
        value="3.2"
        unit="ppm"
        description="Normal methane level"
        variant="methane"
      />
    );

    expect(screen.getByText("Methane Level")).toBeInTheDocument();
    expect(screen.getByText("3.2")).toBeInTheDocument();
    expect(screen.getByText("ppm")).toBeInTheDocument();
    expect(screen.getByText("Normal methane level")).toBeInTheDocument();
    expect(screen.getByTestId("activity-icon")).toBeInTheDocument();
  });

  it("renders temperature metric correctly", () => {
    render(
      <MetricCard
        title="Temperature"
        value="34.5"
        unit="°C"
        description="Current digester temperature"
        variant="temperature"
      />
    );

    expect(screen.getByText("Temperature")).toBeInTheDocument();
    expect(screen.getByText("34.5")).toBeInTheDocument();
    expect(screen.getByText("°C")).toBeInTheDocument();
    expect(screen.getByText("Current digester temperature")).toBeInTheDocument();
    expect(screen.getByTestId("thermometer-icon")).toBeInTheDocument();
  });

  it("renders pressure metric correctly", () => {
    render(
      <MetricCard
        title="Pressure"
        value="1.02"
        unit="bar"
        description="Current system pressure"
        variant="pressure"
      />
    );

    expect(screen.getByText("Pressure")).toBeInTheDocument();
    expect(screen.getByText("1.02")).toBeInTheDocument();
    expect(screen.getByText("bar")).toBeInTheDocument();
    expect(screen.getByText("Current system pressure")).toBeInTheDocument();
    expect(screen.getByTestId("gauge-icon")).toBeInTheDocument();
  });

  it("applies correct styles for each variant", () => {
    const { container: methaneCard } = render(
      <MetricCard
        title="Methane"
        value="3.0"
        unit="ppm"
        description="Desc"
        variant="methane"
      />
    );
    expect(methaneCard.firstChild).toHaveClass("border-green-200");

    const { container: tempCard } = render(
      <MetricCard
        title="Temp"
        value="30"
        unit="°C"
        description="Desc"
        variant="temperature"
      />
    );
    expect(tempCard.firstChild).toHaveClass("border-pink-200");

    const { container: pressureCard } = render(
      <MetricCard
        title="Pressure"
        value="1.0"
        unit="bar"
        description="Desc"
        variant="pressure"
      />
    );
    expect(pressureCard.firstChild).toHaveClass("border-orange-200");
  });
});
