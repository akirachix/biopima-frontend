'use client';
import React from 'react';
import useLiveSensorReadings from '../hooks/useFetchSensorReadings';
import MetricCard from './components/MetricCard';
import StatusCard from './components/StatusCard';
import ChartSection from './components/ChartSection';
import ActivityFeed from './components/ActivityFeed';
import AlertBox from './components/AlertBox';
import TemperatureAlert from './components/TemperatureAlert';
import PressureAlert from './components/PressureAlert';
import InstitutionLayout from '../shared-components/Sidebar/InstitutionLayout';


interface PressurePoint {
 time: string;
 pressure: number;
 timestamp: Date;
}


type MetricStatus = 'normal' | 'warning' | 'critical';


export default function DashboardPage() {
 const { sensorReadings, latestReading, isConnected, error } = useLiveSensorReadings();


 const getTemperatureStatus = (temp: number | null): MetricStatus => {
   if (temp === null) return 'normal';
   if (temp < 35 || temp > 37) return 'warning';
   return 'normal';
 };


 const getPressureStatus = (pressure: number | null): MetricStatus => {
   if (pressure === null) return 'normal';
   if (pressure < 8 || pressure > 15) return 'critical';
   return 'normal';
 };


 const getMethaneStatus = (methane: number | null): MetricStatus => {
   if (methane === null) return 'normal';
   if (methane > 2.0) return 'critical';
   return 'normal';
 };


 const tempValue = latestReading?.temperature_level
   ? parseFloat(latestReading.temperature_level)
   : null;
 const pressureValue = latestReading?.pressure_level
   ? parseFloat(latestReading.pressure_level)
   : null;
 const methaneValue = latestReading?.methane_level
   ? parseFloat(latestReading.methane_level)
   : null;


 const tempStatus = getTemperatureStatus(tempValue);
 const pressureStatus = getPressureStatus(pressureValue);
 const methaneStatus = getMethaneStatus(methaneValue);




 const currentPressure = pressureValue !== null
   ? `${pressureValue.toFixed(1)} kPa`
   : null;


 const pressureData: PressurePoint[] = sensorReadings
   .filter(reading =>
     reading.pressure_level !== undefined &&
     reading.pressure_level !== "" &&
     !isNaN(parseFloat(reading.pressure_level))
   )
   .map(reading => {
     const timestamp = new Date(reading.created_at);
     return {
       time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
       pressure: parseFloat(reading.pressure_level),
       timestamp,
     };
   })
   .slice(0, 50)
   .reverse();


 const hasData = latestReading !== null;


 return (
   <InstitutionLayout>
     <div className="flex min-h-screen bg-gray-50">
       <aside className="flex-shrink-0 w-[] bg-white shadow-sm"></aside>


       <main className="flex-1 min-h-screen py-8 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 overflow-x-hidden">
         <header className="mb-6">
           <h1 className="text-4xl font-bold text-green-800">Dashboard</h1>
           <div className="mt-2 text-sm">
             {error ? (
               <span className="text-red-600">{error}</span>
             ) : isConnected ? (
               <span className="text-green-600">Live connection</span>
             ) : (
               <span className="text-yellow-600">Connecting...</span>
             )}
           </div>
         </header>


         <div className="mt-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-20">
             <MetricCard
               title="Methane"
               value={hasData && methaneValue !== null ? methaneValue.toFixed(2) : 'No data'}
               unit="ppm"
               description="Bubbles in the tank!"
               variant="methane"
               status={methaneStatus}
             />
             <MetricCard
               title="Temperature"
               value={hasData && tempValue !== null ? tempValue.toFixed(1) : 'No data'}
               unit="°C"
               description="Is it warm enough?"
               variant="temperature"
               status={tempStatus}
             />
             <MetricCard
               title="Pressure"
               value={hasData && pressureValue !== null ? pressureValue.toFixed(1) : 'No data'}
               unit="kPa"
               description="How strong is the gas?"
               variant="pressure"
               status={pressureStatus}
             />
           </div>
         </div>


         <div className="mt-8 max-w-100xl mx-auto space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <StatusCard type="system" latestReading={latestReading} />
                 <StatusCard type="monitoring" latestReading={latestReading} />
               </div>
               <ChartSection
                 pressureData={pressureData}
                 currentPressure={currentPressure}
               />
             </div>


             <div className="space-y-4 ml-4 lg:ml-10">
               <ActivityFeed latestReading={latestReading} />
               <AlertBox methaneLevel={methaneValue} />
               <TemperatureAlert temperatureLevel={tempValue} />
               <PressureAlert pressureLevel={pressureValue} />
             </div>
           </div>
         </div>
       </main>
     </div>
   </InstitutionLayout>
 );
}




