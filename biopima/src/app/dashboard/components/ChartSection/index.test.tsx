import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartSection from './';


class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

const mockGetBoundingClientRect = jest.fn(() => ({
  width: 800,
  height: 400,
  top: 0,
  left: 0,
  bottom: 400,
  right: 800,
  x: 0,
  y: 0,
  toJSON: () => {},
}));


const sampleData = [
  { time: '10:00', pressure: 100, timestamp: new Date('2025-09-23T10:00:00Z') },
  { time: '11:00', pressure: 105, timestamp: new Date('2025-09-23T11:00:00Z') },
  { time: '12:00', pressure: 102, timestamp: new Date('2025-09-23T12:00:00Z') },
  { time: '13:00', pressure: 110, timestamp: new Date('2025-09-23T13:00:00Z') },
  { time: '14:00', pressure: 115, timestamp: new Date('2025-09-23T14:00:00Z') },
  { time: '15:00', pressure: 113, timestamp: new Date('2025-09-23T15:00:00Z') },
  { time: '16:00', pressure: 118, timestamp: new Date('2025-09-23T16:00:00Z') },
];

beforeAll(() => {
 
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: mockGetBoundingClientRect,
  });
});

describe('ChartSection', () => {
  it('renders title and no data message when empty', () => {
    render(<ChartSection pressureData={[]} currentPressure={null} />);
    expect(screen.getByText('Gas Production')).toBeInTheDocument();
    expect(screen.getByText('No gas production data available')).toBeInTheDocument();
  });

  it('renders last updated and line chart with data', () => {
    render(<ChartSection pressureData={sampleData} currentPressure={null} />);
    expect(screen.getByText('Gas Production')).toBeInTheDocument();
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();

    
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('shows live currentPressure indicator', () => {
    const current = '120 kPa';
    render(<ChartSection pressureData={sampleData} currentPressure={current} />);

    expect(screen.getByText(`Live: ${current}`)).toBeInTheDocument();

   
    const pulseDot = document.querySelector('.bg-green-500.animate-pulse');
    expect(pulseDot).toBeInTheDocument();
  });

  it('tickFormatter returns correct ticks for many points', () => {
    const { container } = render(<ChartSection pressureData={sampleData} currentPressure={null} />);
    const ticks = container.querySelectorAll('.recharts-cartesian-axis-tick text');
    expect(ticks.length).toBeGreaterThanOrEqual(7);
    expect(ticks[0].textContent).toBe('10:00');
    expect(ticks[1].textContent).toBe('');
    expect(ticks[2].textContent).toBe('12:00');
    expect(ticks[3].textContent).toBe('');
    expect(ticks[4].textContent).toBe('14:00');
  });
});
