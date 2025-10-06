'use client';
import { AlertTriangle } from 'lucide-react';


interface AlertBoxProps {
 methaneLevel: number | null;
}


export default function AlertBox({ methaneLevel }: AlertBoxProps) {
 if (methaneLevel === null || methaneLevel <= 2) return null;


 return (
   <div className="rounded-xl p-3 bg-red-600 text-white shadow-md border border-red-400 max-w-xs mt-4">
     <div className="flex items-start space-x-2">
       <AlertTriangle size={20} className="text-white flex-shrink-0 mt-0.5" />
       <div>
         <h3 className="font-bold text-sm mb-0.5">Methane Alert</h3>
         <p className="text-xs opacity-90 leading-tight">
           High Methane Detected: Methane level at {methaneLevel.toFixed(1)} ppm.
         </p>
       </div>
     </div>
   </div>
 );
}






