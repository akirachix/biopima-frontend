import React from 'react';
import { render, screen } from '@testing-library/react';
import TemperatureAlert from '.';




jest.mock('lucide-react', () => ({
 Thermometer: () => <svg data-testid="icon-thermometer" />,
}));


describe('TemperatureAlert', () => {
 it('does not render when temperatureLevel is null', () => {
   const { container } = render(<TemperatureAlert temperatureLevel={null} />);
   expect(container).toBeEmptyDOMElement();
 });


 it('does not render when temperatureLevel is between 35 and 37 inclusive', () => {
   [35, 36, 37].forEach((val) => {
     const { container } = render(<TemperatureAlert temperatureLevel={val} />);
     expect(container).toBeEmptyDOMElement();
   });
 });


 it('renders alert with "too low" when temperatureLevel is below 35', () => {
   render(<TemperatureAlert temperatureLevel={34.5} />);
   expect(screen.getByText(/Temperature Alert/i)).toBeInTheDocument();
   expect(screen.getByText(/Temperature is too low: 34.5°C./i)).toBeInTheDocument();
   expect(screen.getByTestId('icon-thermometer')).toBeInTheDocument();
 });


 it('renders alert with "too high" when temperatureLevel is above 37', () => {
   render(<TemperatureAlert temperatureLevel={38.2} />);
   expect(screen.getByText(/Temperature Alert/i)).toBeInTheDocument();
   expect(screen.getByText(/Temperature is too high: 38.2°C./i)).toBeInTheDocument();
   expect(screen.getByTestId('icon-thermometer')).toBeInTheDocument();
 });
});




