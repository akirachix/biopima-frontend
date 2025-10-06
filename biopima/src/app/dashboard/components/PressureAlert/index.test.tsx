import React from 'react';
import { render, screen } from '@testing-library/react';
import PressureAlert from '.';




jest.mock('lucide-react', () => ({
 Gauge: () => <svg data-testid="icon-gauge" />,
}));


describe('PressureAlert', () => {
 it('does not render when pressureLevel is null', () => {
   const { container } = render(<PressureAlert pressureLevel={null} />);
   expect(container).toBeEmptyDOMElement();
 });


 it('does not render when pressureLevel is within normal range (8 to 15)', () => {
   const { container } = render(<PressureAlert pressureLevel={8} />);
   expect(container).toBeEmptyDOMElement();


   const { container: container2 } = render(<PressureAlert pressureLevel={12} />);
   expect(container2).toBeEmptyDOMElement();


   const { container: container3 } = render(<PressureAlert pressureLevel={15} />);
   expect(container3).toBeEmptyDOMElement();
 });


 it('renders alert for low pressure below 8', () => {
   render(<PressureAlert pressureLevel={7.2} />);


   expect(screen.getByText('Pressure Alert')).toBeInTheDocument();
   expect(screen.getByText(/Pressure is too low: 7.2 kPa\./i)).toBeInTheDocument();
   expect(screen.getByTestId('icon-gauge')).toBeInTheDocument();
 });


 it('renders alert for high pressure above 15', () => {
   render(<PressureAlert pressureLevel={18.5} />);


   expect(screen.getByText('Pressure Alert')).toBeInTheDocument();
   expect(screen.getByText(/Pressure is too high: 18.5 kPa\./i)).toBeInTheDocument();
   expect(screen.getByTestId('icon-gauge')).toBeInTheDocument();
 });
});




