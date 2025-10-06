

import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';




jest.mock('recharts', () => {
 const OriginalRecharts = jest.requireActual('recharts');
 return {
   ...OriginalRecharts,
   ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
     <div data-testid="mocked-responsive-container">{children}</div>
   ),
 };
});




jest.mock('../hooks/useFetchSensorReadings', () => ({
 __esModule: true,
 default: jest.fn(),
}));


import useLiveSensorReadings from '../hooks/useFetchSensorReadings';


describe('DashboardPage', () => {
 beforeEach(() => {
   jest.clearAllMocks();
 });


 it('renders loading state when connecting', () => {
   (useLiveSensorReadings as jest.Mock).mockReturnValue({
     sensorReadings: [],
     latestReading: null,
     isConnected: false,
     error: null,
     isLoading: false,
   });
   render(<DashboardPage />);
   expect(screen.getByText(/Connecting/i)).toBeInTheDocument();
   expect(screen.getAllByText(/No data/i).length).toBeGreaterThan(0);
 });


 it('renders live connection status when connected', () => {
   (useLiveSensorReadings as jest.Mock).mockReturnValue({
     sensorReadings: [],
     latestReading: null,
     isConnected: true,
     error: null,
     isLoading: false,
   });
   render(<DashboardPage />);
   expect(screen.getByText(/Live connection/i)).toBeInTheDocument();
 });


 it('renders error message when error exists', () => {
   (useLiveSensorReadings as jest.Mock).mockReturnValue({
     sensorReadings: [],
     latestReading: null,
     isConnected: false,
     error: 'Some error occurred',
     isLoading: false,
   });
   render(<DashboardPage />);
   expect(screen.getByText('Some error occurred')).toBeInTheDocument();
 });


 it('displays metric cards with latest readings and correct status', () => {
   const latestReading = {
     temperature_level: '36.5',
     pressure_level: '12.5',
     methane_level: '1.0',
     created_at: new Date().toISOString(),
   };
   (useLiveSensorReadings as jest.Mock).mockReturnValue({
     sensorReadings: [latestReading],
     latestReading,
     isConnected: true,
     error: null,
     isLoading: false,
   });
   render(<DashboardPage />);


 
   expect(screen.getByText('36.5')).toBeInTheDocument();
   expect(screen.getByText('°C')).toBeInTheDocument();
   expect(screen.getByText('12.5')).toBeInTheDocument();
   expect(screen.getByText('kPa')).toBeInTheDocument();
   expect(screen.getByText('1.00')).toBeInTheDocument();
   expect(screen.getByText('ppm')).toBeInTheDocument();


 
   const metricTitles = screen.getAllByRole('heading', { level: 3 });
   const titlesText = metricTitles.map((el) => el.textContent);
   expect(titlesText).toEqual(
     expect.arrayContaining(['Methane', 'Temperature', 'Pressure'])
   );
 });


 it('displays critical status for high methane levels', () => {
   const latestReading = {
     temperature_level: '36.5',
     pressure_level: '12',
     methane_level: '3.0',
     created_at: new Date().toISOString(),
   };
   (useLiveSensorReadings as jest.Mock).mockReturnValue({
     sensorReadings: [latestReading],
     latestReading,
     isConnected: true,
     error: null,
     isLoading: false,
   });
   render(<DashboardPage />);


   expect(screen.getByText('3.00')).toBeInTheDocument();
   expect(screen.getByText(/Bubbles in the tank!/i)).toBeInTheDocument();
 });
});




