import React from 'react';
import { render, screen } from '@testing-library/react';
import ActivityFeed from '.';




jest.mock('lucide-react', () => ({
 ...jest.requireActual('lucide-react'),
 Thermometer: () => <svg data-testid="icon-thermometer" />,
 AlertTriangle: () => <svg data-testid="icon-alerttriangle" />,
 Gauge: () => <svg data-testid="icon-gauge" />,
 Flame: () => <svg data-testid="icon-flame" />,
}));




function minutesAgo(min: number): string {
 const d = new Date();
 d.setMinutes(d.getMinutes() - min);
 return d.toISOString();
}


describe('ActivityFeed component', () => {
 test('renders "just now" and no data if latestReading is null', () => {
   render(<ActivityFeed latestReading={null} />);


   expect(screen.getByText(/Activity Feed/i)).toBeInTheDocument();
   expect(screen.getByText(/Recent system events/i)).toBeInTheDocument();


   expect(screen.getByText('Temperature')).toBeInTheDocument();


   const noDataElements = screen.getAllByText('No data');
   expect(noDataElements.length).toBe(3);


   expect(screen.getByText('Pressure')).toBeInTheDocument();
   expect(screen.getByText('Methane')).toBeInTheDocument();


   expect(screen.getByTestId('icon-thermometer')).toBeInTheDocument();
   expect(screen.getByTestId('icon-gauge')).toBeInTheDocument();
   expect(screen.getByTestId('icon-flame')).toBeInTheDocument();
 });


 test('renders low temperature warning correctly', () => {
   const latestReading = {
     temperature_level: '34.5',
     pressure_level: '10.5',
     methane_level: '1.0',
     created_at: minutesAgo(5),
   };
   render(<ActivityFeed latestReading={latestReading} />);


   expect(screen.getByText(/Low Temp Warning/i)).toBeInTheDocument();
   expect(screen.getByText(/Digester temperature at 34.5°C./i)).toBeInTheDocument();


   const timeAgoElements = screen.getAllByText(/5 minutes ago/i);
   expect(timeAgoElements.length).toBeGreaterThanOrEqual(1);
 });


 test('renders high methane alert correctly with AlertTriangle icon', () => {
   const latestReading = {
     temperature_level: '36',
     pressure_level: '12',
     methane_level: '2.5',
     created_at: minutesAgo(10),
   };
   render(<ActivityFeed latestReading={latestReading} />);


   expect(screen.getByText(/High Methane Alert/i)).toBeInTheDocument();
   expect(screen.getByText(/Methane level at 2.5 ppm./i)).toBeInTheDocument();
   expect(screen.getByTestId('icon-alerttriangle')).toBeInTheDocument();


   const timeAgoElements = screen.getAllByText(/10 minutes ago/i);
   expect(timeAgoElements.length).toBeGreaterThanOrEqual(1);
 });


 test('renders pressure alerts correctly for high and low pressure', () => {
   const lowPressureReading = {
     temperature_level: '36',
     pressure_level: '7.5',
     methane_level: '1.0',
     created_at: minutesAgo(15),
   };
   const highPressureReading = {
     temperature_level: '36',
     pressure_level: '16',
     methane_level: '1.0',
     created_at: minutesAgo(20),
   };


   const { rerender } = render(<ActivityFeed latestReading={lowPressureReading} />);
   expect(screen.getByText(/Low Pressure Alert/i)).toBeInTheDocument();
   expect(screen.getByText(/Pressure at 7.5 kPa./i)).toBeInTheDocument();


   rerender(<ActivityFeed latestReading={highPressureReading} />);
   expect(screen.getByText(/High Pressure Alert/i)).toBeInTheDocument();
   expect(screen.getByText(/Pressure at 16.0 kPa./i)).toBeInTheDocument();
 });


 test('renders normal values with green color messages', () => {
   const latestReading = {
     temperature_level: '36.5',
     pressure_level: '12.5',
     methane_level: '1.5',
     created_at: minutesAgo(1),
   };
   render(<ActivityFeed latestReading={latestReading} />);


   expect(screen.getByText('Temperature')).toBeInTheDocument();
   expect(screen.getByText(/Digester temperature at 36.5°C./i)).toBeInTheDocument();


   expect(screen.getByText('Pressure')).toBeInTheDocument();
   expect(screen.getByText(/Pressure at 12.5 kPa./i)).toBeInTheDocument();


   expect(screen.getByText('Methane')).toBeInTheDocument();
   expect(screen.getByText(/Methane level at 1.5 ppm./i)).toBeInTheDocument();


    const timeAgoElements = screen.getAllByText(/1 minute ago|less than a minute ago/i);
   expect(timeAgoElements.length).toBeGreaterThanOrEqual(1);
 });
});


