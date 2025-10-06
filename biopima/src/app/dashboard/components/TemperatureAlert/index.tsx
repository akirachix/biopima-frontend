'use client';
import { Thermometer } from 'lucide-react';


interface TemperatureAlertProps {
 temperatureLevel: number | null;
}


export default function TemperatureAlert({ temperatureLevel }: TemperatureAlertProps) {
 if (
   temperatureLevel === null ||
   (temperatureLevel >= 35 && temperatureLevel <= 37)
 ) {
   return null;
 }


 const isTooLow = temperatureLevel < 35;
 const reason = isTooLow ? 'too low' : 'too high';


 return (
   <div className="rounded-xl p-3 bg-yellow-500 text-white shadow-md border border-yellow-400 max-w-xs">
     <div className="flex items-start space-x-2">
       <Thermometer size={16} className="text-white flex-shrink-0 mt-0.5" />
       <div>
         <h3 className="font-bold text-sm mb-0.5">Temperature Alert</h3>
         <p className="text-xs opacity-90 leading-tight">
           Temperature is {reason}: {temperatureLevel.toFixed(1)}°C.
         </p>
       </div>
     </div>
   </div>
 );
}




