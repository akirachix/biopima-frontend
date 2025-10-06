'use client';


import React from 'react';
import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
} from 'recharts';


interface ChartSectionProps {
 pressureData: Array<{
   time: string;
   pressure: number;
   timestamp: Date;
 }>;
 currentPressure: string | null;
}


export default function ChartSection({ pressureData, currentPressure }: ChartSectionProps) {
 const tickFormatter = (time: string, index: number) => {
   if (pressureData.length <= 6) return time;
   const step = Math.ceil(pressureData.length / 5);
   return index % step === 0 ? time : '';
 };


 return (
   <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-200">
     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
       <div>
         <h3 className="text-2xl font-bold text-green-800">Gas Production</h3>
         {pressureData.length > 0 && (
           <p className="text-sm text-green-600 mt-1 font-medium">
             Last updated: {new Date(pressureData[pressureData.length - 1].timestamp).toLocaleString()}
           </p>
         )}
       </div>
       {currentPressure && (
         <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-sm">
           <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg"></div>
           <span className="font-semibold text-green-800 tracking-wide">Live: {currentPressure}</span>
         </div>
       )}
     </div>


     <div className="w-full" style={{ height: '24rem' }}>
       {pressureData.length > 0 ? (
         <ResponsiveContainer width="100%" height="100%">
           <LineChart
             data={pressureData}
             margin={{ top: 30, right: 40, left: 20, bottom: 30 }}
           >
             <CartesianGrid strokeDasharray="5 5" stroke="#e6f0ea" />
             <XAxis
               dataKey="time"
               fontSize={14}
               tickLine={false}
               axisLine={{ stroke: '#a7c7b7' }}
               tick={{ fill: '#4b8078', fontWeight: 600 }}
               tickFormatter={tickFormatter}
               interval={0}
               height={60}
               padding={{ left: 20, right: 20 }}
             />
             <YAxis
               fontSize={14}
               tickLine={false}
               axisLine={{ stroke: '#a7c7b7' }}
               tick={{ fill: '#4b8078', fontWeight: 600 }}
               width={70}
               label={{
                 value: 'Gas (kPa)',
                 angle: -90,
                 position: 'insideLeft',
                 fill: '#2f5d56',
                 fontSize: 14,
                 fontWeight: 700,
                 dx: 15,
               }}
               domain={['auto', 'auto']}
             />
             <Tooltip
               contentStyle={{
                 background: 'white',
                 border: '1px solid #b4d8c3',
                 borderRadius: '10px',
                 boxShadow: '0 6px 12px rgba(75, 166, 134, 0.3)',
                 padding: '14px',
               }}
               itemStyle={{ color: '#097f68', fontSize: '15px', fontWeight: '600' }}
               labelStyle={{ fontWeight: '700', color: '#197754' }}
               labelFormatter={(label) => `Time: ${label}`}
               formatter={(value: number) => [`${value.toFixed(1)} kPa`, 'Gas Production']}
               cursor={{ stroke: '#197754', strokeWidth: 2, strokeDasharray: '7 5' }}
             />
             <Line
               type="monotone"
               dataKey="pressure"
               stroke="#198754"
               strokeWidth={3}
               dot={false}
               activeDot={{
                 r: 7,
                 stroke: '#198754',
                 strokeWidth: 3,
                 fill: 'white',
               }}
             />
           </LineChart>
         </ResponsiveContainer>
       ) : (
         <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
           <svg
             className="w-16 h-16 mb-4 text-green-300"
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg"
             aria-hidden="true"
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="1.8"
               d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
             />
           </svg>
           <p className="text-lg font-semibold text-green-600">No gas production data available</p>
         </div>
       )}
     </div>
   </div>
 );
}




