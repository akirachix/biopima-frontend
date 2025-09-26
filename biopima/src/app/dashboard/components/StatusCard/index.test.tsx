import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusCard from '../StatusCard';


jest.mock('lucide-react', () => ({
  AlertTriangle: jest.fn(({ className }) => <svg data-testid="mock-AlertTriangle" className={className} />),
  Activity: jest.fn(({ className }) => <svg data-testid="mock-Activity" className={className} />),
}));

describe('StatusCard', () => {
  it('renders system status card correctly', () => {
    render(<StatusCard type="system" />);

    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('All systems operational')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();

    const icon = screen.getByTestId('mock-AlertTriangle');
    expect(icon).toHaveClass('w-5', 'h-5', 'text-red-500');

    const container = screen.getByText('System Status').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-green-100', 'rounded-3xl', 'shadow-lg', 'p-4', 'flex', 'flex-col');
  });

  it('renders monitoring status card correctly', () => {
    render(<StatusCard type="monitoring" />);

    expect(screen.getByText('Automatically monitoring pressure, temperature, & volume.')).toBeInTheDocument();

    const icon = screen.getByTestId('mock-Activity');
    expect(icon).toHaveClass('w-5', 'h-5', 'text-green-700');

    const container = screen.getByText('Automatically monitoring pressure, temperature, & volume.').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-green-100', 'rounded-3xl', 'shadow-lg', 'p-4', 'flex', 'flex-col');
  });
});
