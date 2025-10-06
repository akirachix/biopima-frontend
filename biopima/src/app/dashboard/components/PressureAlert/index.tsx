

'use client';
import { Gauge } from 'lucide-react';


interface PressureAlertProps {
 pressureLevel: number | null;
}


export default function PressureAlert({ pressureLevel }: PressureAlertProps) {
 if (
   pressureLevel === null ||
   (pressureLevel >= 8 && pressureLevel <= 15)
 ) {
   return null;
 }


 const reason = pressureLevel < 8 ? 'too low' : 'too high';


 return (
   <div className="rounded-xl p-3 bg-red-600 text-white shadow-md border border-red-400 max-w-xs">
     <div className="flex items-start space-x-2">
       <Gauge size={16} className="text-white flex-shrink-0 mt-0.5" />
       <div>
         <h3 className="font-bold text-sm mb-0.5">Pressure Alert</h3>
         <p className="text-xs opacity-90 leading-tight">
           Pressure is {reason}: {pressureLevel.toFixed(1)} kPa.
         </p>
       </div>
     </div>
   </div>
 );
}




