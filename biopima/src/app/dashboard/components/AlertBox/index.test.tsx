// src/components/AlertBox.test.tsx
import { render, screen } from "@testing-library/react";
import AlertBox from ".";

describe("AlertBox", () => {
  it("does not render when methaneLevel is null", () => {
    const { container } = render(<AlertBox methaneLevel={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("does not render when methaneLevel is 2 or less", () => {
    const { container } = render(<AlertBox methaneLevel={2} />);
    expect(container.firstChild).toBeNull();

    const { container: container1 } = render(<AlertBox methaneLevel={0} />);
    expect(container1.firstChild).toBeNull();
  });

  it("renders alert when methaneLevel is greater than 2", () => {
    render(<AlertBox methaneLevel={5.5} />);
    
    expect(screen.getByText(/Methane Alert/i)).toBeInTheDocument();
    expect(screen.getByText(/High Methane Detected/i)).toBeInTheDocument();
  });

  it("displays the correct methane level in the text", () => {
    const level = 7.3;
    render(<AlertBox methaneLevel={level} />);
    
    expect(screen.getByText(`High Methane Detected: Methane level at ${level.toFixed(1)} ppm.`)).toBeInTheDocument();
  });
});
