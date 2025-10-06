'use client';
import { Thermometer, AlertTriangle, Gauge, Flame } from 'lucide-react';


interface SensorReadingLite {
 temperature_level: string;
 pressure_level: string;
 methane_level: string;
 created_at: string;
}


interface ActivityFeedProps {
 latestReading: SensorReadingLite | null;
}


export default function ActivityFeed({ latestReading }: ActivityFeedProps) {
 const formatTimeAgo = (date: Date): string => {
   const now = new Date();
   const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
   const minutes = Math.floor(seconds / 60);
   const hours = Math.floor(minutes / 60);


   if (minutes < 1) return 'less than a minute ago';
   if (minutes === 1) return '1 minute ago';
   if (minutes < 60) return `${minutes} minutes ago`;
   if (hours === 1) return '1 hour ago';
   return `${hours} hours ago`;
 };


 const timestamp = latestReading?.created_at ? new Date(latestReading.created_at) : new Date();
 const timeAgo = latestReading?.created_at ? formatTimeAgo(timestamp) : 'Just now';


 const temp = latestReading?.temperature_level ? parseFloat(latestReading.temperature_level) : null;
 const pressure = latestReading?.pressure_level ? parseFloat(latestReading.pressure_level) : null;
 const methane = latestReading?.methane_level ? parseFloat(latestReading.methane_level) : null;


 const getTempEvent = () => {
   if (temp === null) {
     return {
       id: 'temp' as const,
       title: 'Temperature',
       message: 'No data',
       icon: Thermometer,
       color: 'gray' as const,
       timeAgo,
     };
   }


   if (temp < 35) {
     return {
       id: 'temp',
       title: 'Low Temp Warning',
       message: `Digester temperature at ${temp.toFixed(1)}°C.`,
       icon: Thermometer,
       color: 'yellow' as const,
       timeAgo,
     };
   }


   if (temp > 37) {
     return {
       id: 'temp',
       title: 'High Temp Alert',
       message: `Digester temperature at ${temp.toFixed(1)}°C.`,
       icon: AlertTriangle,
       color: 'red' as const,
       timeAgo,
     };
   }


   return {
     id: 'temp',
     title: 'Temperature',
     message: `Digester temperature at ${temp.toFixed(1)}°C.`,
     icon: Thermometer,
     color: 'green' as const,
     timeAgo,
   };
 };


 const getPressureEvent = () => {
   if (pressure === null) {
     return {
       id: 'pressure' as const,
       title: 'Pressure',
       message: 'No data',
       icon: Gauge,
       color: 'gray' as const,
       timeAgo,
     };
   }
   if (pressure < 8 || pressure > 15) {
     const isLow = pressure < 8;
     return {
       id: 'pressure',
       title: isLow ? 'Low Pressure Alert' : 'High Pressure Alert',
       message: `Pressure at ${pressure.toFixed(1)} kPa.`,
       icon: AlertTriangle,
       color: 'red' as const,
       timeAgo,
     };
   }
   return {
     id: 'pressure',
     title: 'Pressure',
     message: `Pressure at ${pressure.toFixed(1)} kPa.`,
     icon: Gauge,
     color: 'green' as const,
     timeAgo,
   };
 };


 const getMethaneEvent = () => {
   if (methane === null) {
     return {
       id: 'methane' as const,
       title: 'Methane',
       message: 'No data',
       icon: Flame,
       color: 'gray' as const,
       timeAgo,
     };
   }
   if (methane > 2.0) {
     return {
       id: 'methane',
       title: 'High Methane Alert',
       message: `Methane level at ${methane.toFixed(1)} ppm.`,
       icon: AlertTriangle,
       color: 'red' as const,
       timeAgo,
     };
   }
   return {
     id: 'methane',
     title: 'Methane',
     message: `Methane level at ${methane.toFixed(1)} ppm.`,
     icon: Flame,
     color: 'green' as const,
     timeAgo,
   };
 };


 const events = [getMethaneEvent(), getPressureEvent(), getTempEvent()];


 return (
   <div className="bg-[#f8fbf6] rounded-xl p-5 border border-green-200 shadow-sm max-w-xs">
     <h3 className="text-base font-bold text-green-800 mb-1">Activity Feed</h3>
     <p className="text-xs text-black mb-4">Recent system events and alerts.</p>
     <div className="space-y-4">
       {events.map((event) => {
         const Icon = event.icon;
         const bgColor =
           event.color === 'green'
             ? 'bg-green-600'
             : event.color === 'yellow'
             ? 'bg-yellow-500'
             : event.color === 'red'
             ? 'bg-red-600'
             : 'bg-gray-400';
         const iconColor =
           event.color === 'green'
             ? 'text-green-600'
             : event.color === 'yellow'
             ? 'text-yellow-600'
             : event.color === 'red'
             ? 'text-red-600'
             : 'text-gray-400';


         return (
           <div key={event.id} className="flex items-start space-x-3">
             <span className={`w-3 h-3 mt-2 rounded-full ${bgColor}`} />
             <div className="flex-1">
               <div className="flex items-center space-x-1 text-sm text-black font-semibold">
                 <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
                 <span>{event.title}</span>
               </div>
               <p className="text-xs text-black mt-1">{event.message}</p>
               <p className="text-xs text-black">{event.timeAgo}</p>
             </div>
           </div>
         );
       })}
     </div>
   </div>
 );
}


