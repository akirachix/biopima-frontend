'use client';
import React from 'react';
import useFetchSensorReadings from '../hooks/useFetchSensorReadings';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import StatusCard from './components/StatusCard';
import ChartSection from './components/ChartSection';
import ActivityFeed from './components/ActivityFeed';
import AlertBox from './components/AlertBox';
import InstitutionLayout from '../shared-components/Sidebar/InstitutionLayout';

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

  const loadingContent = (
    <div className="flex items-center justify-center min-h-[60vh] py-10 px-4">
      <p className="text-xl">Loading sensor data, please wait...</p>
    </div>
  );

  const errorContent = (
    <div className="flex items-center justify-center min-h-[60vh] py-10 px-4">
      <p className="text-xl text-red-600">Oops! Something went wrong loading the data.</p>
    </div>
  );

  return (
    <InstitutionLayout>
      <div className="py-2 px-2 sm:py-3 sm:px-3 md:py-4 md:px-4 lg:py-5 lg:px-6 xl:py-6 xl:px-8 ml-0 sm:ml-2 md:ml-4 lg:ml-8 xl:ml-10">
        {loading ? (
          loadingContent
        ) : error ? (
          errorContent
        ) : (
          <>
            <Header />
            <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                <div className="lg:col-span-2 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                    <StatusCard type="system" />
                    <StatusCard type="monitoring" />
                  </div>
                  <ChartSection pressureData={pressureData} currentPressure={currentPressure} />
                </div>

                <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6">
                  <ActivityFeed />
                  <AlertBox
                    methaneLevel={
                      latest?.methane_level ? parseFloat(latest.methane_level as string) : null
                    }
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </InstitutionLayout>
  );
}
