import { render, screen } from '@testing-library/react';
import ActivityFeed from '.';

describe('ActivityFeed', () => {
  let container: HTMLElement;

  beforeEach(() => {
    const rendered = render(<ActivityFeed />);
    container = rendered.container;
  });

  it('renders main heading and subtitle', () => {
    expect(screen.getByRole('heading', { name: /Activity Feed/i })).toBeInTheDocument();
    expect(screen.getByText(/Recent system events and alerts/i)).toBeInTheDocument();
  });

  it('renders two activity items with correct titles and descriptions', () => {
    expect(screen.getByText('Temp Warning')).toBeInTheDocument();
    expect(screen.getByText(/Low Temperature Warning: Digester temperature at 34.6°C./i)).toBeInTheDocument();

    expect(screen.getByText('Leak Warning')).toBeInTheDocument();
    expect(screen.getByText(/Leak Warning: Pressure at 1.02 bar \(15.0% drop\)./i)).toBeInTheDocument();
  });

  it('displays correct timestamps for each alert', () => {
    const timestamps = screen.getAllByText(/less than a minute ago/i);
    expect(timestamps.length).toBe(2);
  });

  it('renders Thermometer SVG icon in Temp Warning section', () => {
    const thermometerIcon = container.querySelector('svg.lucide-thermometer');
    expect(thermometerIcon).toBeInTheDocument();
  });

  it('renders AlertTriangle SVG icon in Leak Warning section', () => {
    const alertTriangleIcon = container.querySelector('svg.lucide-triangle-alert');
    expect(alertTriangleIcon).toBeInTheDocument();
  });

  it('uses correct colors for status indicator dots', () => {
    const greenDot = container.querySelector('span.bg-green-500');
    expect(greenDot).toBeInTheDocument();

    const yellowDot = container.querySelector('span.bg-yellow-700');
    expect(yellowDot).toBeInTheDocument();
  });
});
