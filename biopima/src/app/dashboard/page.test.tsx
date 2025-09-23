import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';

jest.mock('../hooks/useFetchSensorReadings', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('./components/Header', () => {
  const Header = () => <div>Header</div>;
  Header.displayName = 'Header';
  return Header;
});

jest.mock('./components/MetricCard', () => {
  interface MetricCardProps {
    title?: string;
  }
  const MetricCard = (props: MetricCardProps) => <div data-testid="MetricCard">{props.title}</div>;
  MetricCard.displayName = 'MetricCard';
  return MetricCard;
});

jest.mock('./components/StatusCard', () => {
  interface StatusCardProps {
    type?: 'system' | 'monitoring';
  }
  const StatusCard = (props: StatusCardProps) => <div data-testid="StatusCard">{props.type}</div>;
  StatusCard.displayName = 'StatusCard';
  return StatusCard;
});

jest.mock('./components/ChartSection', () => {
  const ChartSection = () => <div data-testid="ChartSection" />;
  ChartSection.displayName = 'ChartSection';
  return ChartSection;
});

jest.mock('./components/ActivityFeed', () => {
  const ActivityFeed = () => <div>ActivityFeed</div>;
  ActivityFeed.displayName = 'ActivityFeed';
  return ActivityFeed;
});

jest.mock('./components/AlertBox', () => {
  interface AlertBoxProps {
    methaneLevel?: number | null;
  }
  const AlertBox = (props: AlertBoxProps) => (
    <div data-testid="AlertBox" data-methanelevel={props.methaneLevel !== undefined ? String(props.methaneLevel) : 'null'} />
  );
  AlertBox.displayName = 'AlertBox';
  return AlertBox;
});

import useFetchSensorReadings from '../hooks/useFetchSensorReadings';

describe('DashboardPage', () => {
  it('renders loading state', () => {
    (useFetchSensorReadings as jest.Mock).mockReturnValue({
      sensorReadings: [],
      loading: true,
      error: null,
    });

    render(<DashboardPage />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useFetchSensorReadings as jest.Mock).mockReturnValue({
      sensorReadings: [],
      loading: false,
      error: 'Failed to load',
    });

    render(<DashboardPage />);

    expect(screen.getByText(/Oops! Something went wrong loading the data./i)).toBeInTheDocument();
  });

  it('renders dashboard with data', () => {
    const mockReadings = [
      {
        created_at: new Date().toISOString(),
        methane_level: '300',
        temperature_level: '28',
        pressure_level: '1.5',
      },
      {
        created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
        methane_level: '310',
        temperature_level: '27',
        pressure_level: '1.4',
      },
    ];

    (useFetchSensorReadings as jest.Mock).mockReturnValue({
      sensorReadings: mockReadings,
      loading: false,
      error: null,
    });

    render(<DashboardPage />);

    expect(screen.getByText('Header')).toBeInTheDocument();

    expect(screen.getAllByTestId('MetricCard')).toHaveLength(3);
    expect(screen.getByText('Methane')).toBeInTheDocument();
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('Pressure')).toBeInTheDocument();

    expect(screen.getAllByTestId('StatusCard')).toHaveLength(2);
    expect(screen.getByTestId('ChartSection')).toBeInTheDocument();
    expect(screen.getByText('ActivityFeed')).toBeInTheDocument();

    expect(screen.getByTestId('AlertBox').getAttribute('data-methanelevel')).toBe('300');
  });
});
