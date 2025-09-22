'use client';
import React, { useMemo } from 'react';
import useFetchSensorReadings from '../hooks/useFetchSensorReadings';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import StatusCard from './components/StatusCard';
import ChartSection from './components/ChartSection';
import ActivityFeed from './components/ActivityFeed';
import AlertBox from './components/AlertBox';
import InstitutionLayout from '../shared-components/Sidebar/InstitutionLayout';

export default function DashboardPage() {
  const { sensorReadings, loading, error } = useFetchSensorReadings();

  const readings = useMemo(() => {
    return sensorReadings || [];
  }, [sensorReadings]);

  const latest = readings[0];

  const pressureData = useMemo(() => {
    if (readings.length === 0) return [];

    return readings.slice(0, 24).map((reading) => ({
      time: new Date(reading.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      pressure: parseFloat(reading.pressure_level as string) || 0,
      timestamp: new Date(reading.created_at),
    })).reverse();
  }, [readings]);

  const currentPressure = useMemo(() => {
    if (pressureData.length === 0) return null;
    const latestPoint = pressureData[pressureData.length - 1];
    return `${latestPoint.pressure.toFixed(1)} kPa`;
  }, [pressureData]);

  if (loading) {
    return (
      <InstitutionLayout>
        <div className="flex items-center justify-center min-h-screen py-10">
          <p className="text-xl text-gray-600">Loading sensor data...</p>
        </div>
      </InstitutionLayout>
    );
  }

  if (error) {
    return (
      <InstitutionLayout>
        <div className="flex items-center justify-center min-h-screen py-10">
          <p className="text-xl text-red-600">Error: {error}</p>
        </div>
      </InstitutionLayout>
    );
  }

  return (
    <InstitutionLayout>
  
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
        <Header />

        <div className="space-y-4 sm:space-y-6">
      
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <MetricCard
              title="Methane"
              value={latest?.methane_level ?? 'N/A'}
              unit="ppm"
              description="Available methane level"
              variant="methane"
            />
            <MetricCard
              title="Temperature"
              value={latest?.temperature_level ?? 'N/A'}
              unit="°C"
              description="Digester core temperature"
              variant="temperature"
            />
            <MetricCard
              title="Pressure"
              value={latest?.pressure_level ?? 'N/A'}
              unit="kPa"
              description="Current digester pressure"
              variant="pressure"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatusCard type="system" />
                <StatusCard type="monitoring" />
              </div>
              <ChartSection pressureData={pressureData} currentPressure={currentPressure} />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <ActivityFeed />
              <AlertBox />
            </div>
          </div>
        </div>
      </div>
    </InstitutionLayout>
  );
}