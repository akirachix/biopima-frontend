'use client';
import { AlertTriangle, Activity } from 'lucide-react';




interface SensorReadingLite {
 temperature_level: string;
 pressure_level: string;
 methane_level: string;
 created_at: string;
}


interface StatusCardProps {
 type: 'system' | 'monitoring';
 latestReading: SensorReadingLite | null;
}


export default function StatusCard({ type, latestReading }: StatusCardProps) {


 const temp = latestReading?.temperature_level
   ? parseFloat(latestReading.temperature_level)
   : null;
 const pressure = latestReading?.pressure_level
   ? parseFloat(latestReading.pressure_level)
   : null;
 const methane = latestReading?.methane_level
   ? parseFloat(latestReading.methane_level)
   : null;




 let statusText = 'Operational';
 let statusLevel: 'normal' | 'warning' | 'critical' = 'normal';


 if (methane !== null && methane > 2.0) {
   statusText = 'Critical';
   statusLevel = 'critical';
 } else if (
   (temp !== null && (temp < 35 || temp > 37)) ||
   (pressure !== null && (pressure < 8 || pressure > 15))
 ) {
   statusText = 'Warning';
   statusLevel = 'warning';
 }


 if (type === 'system') {
   return (
     <div className="flex flex-col rounded-xl p-6 bg-[#a9f5d0] max-w-xs shadow-md">
       <div className="flex items-center space-x-3 mb-1">
         <span className="font-extrabold text-black text-lg">System Status</span>
         <AlertTriangle className="w-6 h-6 text-red-600" />
       </div>
       <span className="text-sm text-black">
         {statusLevel === 'critical'
           ? 'Critical methane levels detected!'
           : statusLevel === 'warning'
           ? 'Sensor values out of normal range.'
           : 'All systems operational'}
       </span>
       <span className="mt-2 font-bold text-red-700 text-lg">
         {statusText}
       </span>
     </div>
   );
 }


  const lastUpdate = latestReading?.created_at
   ? new Date(latestReading.created_at).toLocaleTimeString([], {
       hour: '2-digit',
       minute: '2-digit',
     })
   : '–';


 return (
   <div className="flex flex-col rounded-xl p-6 bg-[#a9f5d0] max-w-xs shadow-md">
     <div className="flex items-center">
       <div className="rounded-full bg-green-300 p-2 mr-3">
         <Activity className="w-6 h-6 text-green-800" />
       </div>
       <span className="text-sm text-black">
         Automatically monitoring pressure, temperature, & volume.
         <span className="block text-xs text-gray-600 mt-1">
           Last update: {lastUpdate}
         </span>
       </span>
     </div>
   </div>
 );
}




