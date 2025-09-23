import React from 'react';
import { render, screen } from '@testing-library/react';
import MetricCard from './';

describe('MetricCard', () => {
  it('renders methane variant with correct texts and styles', () => {
    render(
      <MetricCard
        title="Methane Level"
        value="320"
        unit="ppm"
        description="Current methane concentration"
        variant="methane"
      />
    );

    expect(screen.getByText('Methane Level')).toBeInTheDocument();
    expect(screen.getByText('320')).toBeInTheDocument();
    expect(screen.getByText('ppm')).toBeInTheDocument();
    expect(screen.getByText('Current methane concentration')).toBeInTheDocument();

  
    expect(document.querySelector('.border-green-300')).toBeInTheDocument();

    expect(document.querySelector('.bg-green-100 svg')).toBeInTheDocument();
  });

  it('renders temperature variant with correct texts and styles', () => {
    render(
      <MetricCard
        title="Temperature"
        value="25"
        unit="°C"
        description="Ambient temperature"
        variant="temperature"
      />
    );

    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('°C')).toBeInTheDocument();
    expect(screen.getByText('Ambient temperature')).toBeInTheDocument();

    expect(document.querySelector('.border-pink-300')).toBeInTheDocument();
    expect(document.querySelector('.bg-pink-100 svg')).toBeInTheDocument();
  });

  it('renders pressure variant with correct texts and styles', () => {
    render(
      <MetricCard
        title="Pressure"
        value="101"
        unit="kPa"
        description="Gas pressure level"
        variant="pressure"
      />
    );

    expect(screen.getByText('Pressure')).toBeInTheDocument();
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('kPa')).toBeInTheDocument();
    expect(screen.getByText('Gas pressure level')).toBeInTheDocument();

    expect(document.querySelector('.border-orange-300')).toBeInTheDocument();
    expect(document.querySelector('.bg-orange-100 svg')).toBeInTheDocument();
  });
});
