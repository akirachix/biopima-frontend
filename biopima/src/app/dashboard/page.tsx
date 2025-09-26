'use client';
import React from 'react';
import useFetchSensorReadings from '../hooks/useFetchSensorReadings';
import Sidebar from '../shared-components/Sidebar/Institution';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import StatusCard from './components/StatusCard';
import ChartSection from './components/ChartSection';
import ActivityFeed from './components/ActivityFeed';
import AlertBox from './components/AlertBox';

interface PressurePoint {
  time: string;
  pressure: number;
  timestamp: Date;
}

export default function DashboardPage() {
  const { sensorReadings, loading, error } = useFetchSensorReadings();
  const latest = sensorReadings?.[0];

  let pressureData: PressurePoint[] = [];
  let currentPressure: string | null = null;

  if (sensorReadings && sensorReadings.length > 0) {
    pressureData = sensorReadings
      .slice(0, 24)
      .map((reading) => ({
        time: new Date(reading.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        pressure: parseFloat(reading.pressure_level as string) || 0,
        timestamp: new Date(reading.created_at),
      }))
      .reverse();

    const last = pressureData[pressureData.length - 1];
    currentPressure = last ? `${last.pressure.toFixed(1)} kPa` : null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen py-10 px-4">
        <p className="text-xl">Loading sensor data, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen py-10 px-4">
        <p className="text-xl text-red-600">Oops! Something went wrong loading the data.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
   
      <aside className="flex-shrink-0 w-[350px] bg-white shadow-sm">
        <Sidebar />
      </aside>

      <main className="flex-1 h-screen overflow-hidden py-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-0">
        <Header />

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <MetricCard
              title="Methane"
              value={latest?.methane_level ?? 'N/A'}
              unit="ppm"
              description="Bubbles in the tank!"
              variant="methane"
            />
            <MetricCard
              title="Temperature"
              value={latest?.temperature_level ?? 'N/A'}
              unit="°C"
              description="Is it warm enough?"
              variant="temperature"
            />
            <MetricCard
              title="Pressure"
              value={latest?.pressure_level ?? 'N/A'}
              unit="kPa"
              description="How strong is the gas?"
              variant="pressure"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <StatusCard type="system" />
                <StatusCard type="monitoring" />
              </div>
              <ChartSection pressureData={pressureData} currentPressure={currentPressure} />
            </div>

            <div className="space-y-6">
              <ActivityFeed />
              <AlertBox
                methaneLevel={
                  latest?.methane_level ? parseFloat(latest.methane_level as string) : null
                }
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
