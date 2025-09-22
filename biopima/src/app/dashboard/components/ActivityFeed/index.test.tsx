
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityFeed from '.';

describe('ActivityFeed', () => {
  it('renders title and description', () => {
    render(<ActivityFeed />);

    const title = screen.getByText(/Activity Feed/i);
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-green-900');

    const description = screen.getByText(/Recent system events and alerts./i);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-green-700');
  });

  it('renders temperature warning activity item', () => {
    render(<ActivityFeed />);

    const tempDot = screen.getAllByRole('presentation')[0]; 
    expect(tempDot).toHaveClass('bg-green-500');

    const thermometerIcon = screen.getByLabelText(/thermometer/i);
    expect(thermometerIcon).toBeInTheDocument();

    const tempTitle = screen.getByText(/Temp Warning/i);
    expect(tempTitle).toBeInTheDocument();
    expect(tempTitle).toHaveClass('text-green-700');

    const tempTime = screen.getByText(/less than a minute ago/i);
    expect(tempTime).toBeInTheDocument();

    const tempDesc = screen.getByText(/Low Temperature Warning: Digester temperature at 34.6°C./i);
    expect(tempDesc).toBeInTheDocument();
    expect(tempDesc).toHaveClass('text-gray-700');
  });

  it('renders leak warning activity item', () => {
    render(<ActivityFeed />);

    const leakDot = screen.getAllByRole('presentation')[1];
    expect(leakDot).toHaveClass('bg-yellow-700');

    const alertIcon = screen.getByLabelText(/alert triangle/i);
    expect(alertIcon).toBeInTheDocument();

    const leakTitle = screen.getByText(/Leak Warning/i);
    expect(leakTitle).toBeInTheDocument();
    expect(leakTitle).toHaveClass('text-yellow-700');

    const leakTime = screen.getByText(/less than a minute ago/i);
    expect(leakTime).toBeInTheDocument();

    const leakDesc = screen.getByText(/Leak Warning: Pressure at 1.02 bar \(15.0% drop\)./i);
    expect(leakDesc).toBeInTheDocument();
    expect(leakDesc).toHaveClass('text-gray-700');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<ActivityFeed />);
    expect(asFragment()).toMatchSnapshot();
  });
});