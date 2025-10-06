'use client';


import { Activity, Thermometer, Gauge, AlertTriangle, AlertCircle } from 'lucide-react';


type MetricVariant = 'methane' | 'temperature' | 'pressure';
type MetricStatus = 'normal' | 'warning' | 'critical';


interface MetricCardProps {
 title: string;
 value: string;
 unit: string;
 description: string;
 variant: MetricVariant;
 status?: MetricStatus;
}


export default function MetricCard({
 title,
 value,
 unit,
 description,
 variant,
 status = 'normal',
}: MetricCardProps) {
 const config = {
   methane: { Icon: Activity, color: 'green' },
   temperature: { Icon: Thermometer, color: 'pink' },
   pressure: { Icon: Gauge, color: 'orange' },
 }[variant];


 const { Icon, color } = config;


 const styles = {
   normal: {
     border: `border-${color}-200`,
     bg: `bg-${color}-50`,
     text: `text-${color}-600`,
     AlertIcon: null,
   },
   warning: {
     border: 'border-yellow-400',
     bg: 'bg-yellow-50',
     text: 'text-yellow-600',
     AlertIcon: AlertTriangle,
   },
   critical: {
     border: 'border-red-400',
     bg: 'bg-red-50',
     text: 'text-red-600',
     AlertIcon: AlertCircle,
   },
 }[status];


 const { border, bg, text, AlertIcon } = styles;


 return (
   <div
     className={`bg-white rounded-2xl px-6 py-4 shadow-md border-2 ${border} min-w-[220px] max-w-xs flex flex-col justify-between transition-colors duration-300`}
   >
     <div className="flex justify-between items-start">
       <div>
         <div className="flex items-center gap-2">
           <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
           {AlertIcon && <AlertIcon className={`w-4 h-4 ${text}`} />}
         </div>
         <div className="mt-1">
           <span className="text-2xl font-bold text-gray-900">{value}</span>
           <span className="ml-1 text-xs font-semibold text-gray-600">{unit}</span>
         </div>
         <p className="text-xs text-gray-500 mt-1">{description}</p>
       </div>
       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${bg} flex-shrink-0 mt-1`}>
         <Icon className={`w-5 h-5 ${text}`} />
       </div>
     </div>
   </div>
 );
}




