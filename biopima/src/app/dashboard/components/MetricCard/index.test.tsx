import React from 'react';
import { render, screen } from '@testing-library/react';
import MetricCard from '.';






jest.mock('lucide-react', () => ({
 Activity: () => <div data-testid="icon-activity" />,
 Thermometer: () => <div data-testid="icon-thermometer" />,
 Gauge: () => <div data-testid="icon-gauge" />,
 AlertTriangle: () => <div data-testid="icon-alerttriangle" />,
 AlertCircle: () => <div data-testid="icon-alertcircle" />,
}));


describe('MetricCard', () => {
 it('renders methane card with normal status', () => {
   render(
     <MetricCard
       title="Methane"
       value="1.23"
       unit="ppm"
       description="Normal methane levels"
       variant="methane"
       status="normal"
     />
   );


   expect(screen.getByText('Methane')).toBeInTheDocument();
   expect(screen.getByText('1.23')).toBeInTheDocument();
   expect(screen.getByText('ppm')).toBeInTheDocument();
   expect(screen.getByText('Normal methane levels')).toBeInTheDocument();


   expect(screen.queryByTestId('icon-alerttriangle')).toBeNull();
   expect(screen.queryByTestId('icon-alertcircle')).toBeNull();
   expect(screen.getByTestId('icon-activity')).toBeInTheDocument();
 });


 it('renders temperature card with warning status and alert icon', () => {
   render(
     <MetricCard
       title="Temperature"
       value="38.5"
       unit="°C"
       description="High temperature warning"
       variant="temperature"
       status="warning"
     />
   );


   expect(screen.getByText('Temperature')).toBeInTheDocument();
   expect(screen.getByText('38.5')).toBeInTheDocument();
   expect(screen.getByText('°C')).toBeInTheDocument();
   expect(screen.getByText('High temperature warning')).toBeInTheDocument();


   expect(screen.getByTestId('icon-alerttriangle')).toBeInTheDocument();


    expect(screen.getByTestId('icon-thermometer')).toBeInTheDocument();
 });


 it('renders pressure card with critical status and alert circle icon', () => {
   render(
     <MetricCard
       title="Pressure"
       value="16.7"
       unit="kPa"
       description="Critical pressure level"
       variant="pressure"
       status="critical"
     />
   );


   expect(screen.getByText('Pressure')).toBeInTheDocument();
   expect(screen.getByText('16.7')).toBeInTheDocument();
   expect(screen.getByText('kPa')).toBeInTheDocument();
   expect(screen.getByText('Critical pressure level')).toBeInTheDocument();


   expect(screen.getByTestId('icon-alertcircle')).toBeInTheDocument();


   expect(screen.getByTestId('icon-gauge')).toBeInTheDocument();
 });


 it('defaults to normal status if status prop not provided', () => {
   render(
     <MetricCard
       title="Methane"
       value="2.0"
       unit="ppm"
       description="Methane level normal"
       variant="methane"
     />
   );


   expect(screen.getByText('Methane')).toBeInTheDocument();
   expect(screen.getByText('2.0')).toBeInTheDocument();
   expect(screen.getByText('ppm')).toBeInTheDocument();
   expect(screen.getByText('Methane level normal')).toBeInTheDocument();


   expect(screen.queryByTestId('icon-alerttriangle')).toBeNull();
   expect(screen.queryByTestId('icon-alertcircle')).toBeNull();


   expect(screen.getByTestId('icon-activity')).toBeInTheDocument();
 });
});






