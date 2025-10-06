import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusCard from '.';




jest.mock('lucide-react', () => ({
 AlertTriangle: () => <svg data-testid="icon-alerttriangle" />,
 Activity: () => <svg data-testid="icon-activity" />,
}));


function createReading(overrides = {}) {
 return {
   temperature_level: '36',
   pressure_level: '12',
   methane_level: '1.0',
   created_at: new Date().toISOString(),
   ...overrides,
 };
}


describe('StatusCard', () => {
 it('renders system status with "Operational" and no alerts for normal values', () => {
   const reading = createReading();
   render(<StatusCard type="system" latestReading={reading} />);


   expect(screen.getByText(/System Status/i)).toBeInTheDocument();
   expect(screen.getByText(/All systems operational/i)).toBeInTheDocument();
   const operationalElements = screen.getAllByText(/Operational/i);
   expect(operationalElements.length).toBeGreaterThanOrEqual(1);


   expect(screen.getByTestId('icon-alerttriangle')).toBeInTheDocument();
 });


 it('renders system status with "Warning" for out of range temperature', () => {
   const reading = createReading({ temperature_level: '34' });
   render(<StatusCard type="system" latestReading={reading} />);


   expect(screen.getByText(/Sensor values out of normal range/i)).toBeInTheDocument();
   expect(screen.getByText(/Warning/i)).toBeInTheDocument();
   expect(screen.getByTestId('icon-alerttriangle')).toBeInTheDocument();
 });


 it('renders system status with "Warning" for out of range pressure', () => {
   const reading = createReading({ pressure_level: '16' });
   render(<StatusCard type="system" latestReading={reading} />);


   expect(screen.getByText(/Sensor values out of normal range/i)).toBeInTheDocument();
   expect(screen.getByText(/Warning/i)).toBeInTheDocument();
   expect(screen.getByTestId('icon-alerttriangle')).toBeInTheDocument();
 });


 it('renders system status with "Critical" for high methane', () => {
   const reading = createReading({ methane_level: '2.5' });
   render(<StatusCard type="system" latestReading={reading} />);


   expect(screen.getByText(/Critical methane levels detected!/i)).toBeInTheDocument();
 
   const criticalElements = screen.getAllByText(/Critical/i);
   expect(criticalElements.length).toBeGreaterThanOrEqual(1);


   expect(screen.getByTestId('icon-alerttriangle')).toBeInTheDocument();
 });


 it('renders monitoring status with latest update time', () => {
   const reading = createReading();
   render(<StatusCard type="monitoring" latestReading={reading} />);


   expect(screen.getByText(/Automatically monitoring/i)).toBeInTheDocument();
   expect(screen.getByTestId('icon-activity')).toBeInTheDocument();


   const lastUpdate = new Date(reading.created_at).toLocaleTimeString([], {
     hour: '2-digit',
     minute: '2-digit',
   });
   expect(screen.getByText(new RegExp(lastUpdate))).toBeInTheDocument();
 });


 it('renders monitoring status with dash if no latestReading', () => {
   render(<StatusCard type="monitoring" latestReading={null} />);


   expect(screen.getByText(/Automatically monitoring/i)).toBeInTheDocument();
   expect(screen.getByTestId('icon-activity')).toBeInTheDocument();
   expect(screen.getByText(/Last update: –/i)).toBeInTheDocument();
 });
});






