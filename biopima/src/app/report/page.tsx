'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 ChartOptions,
 ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import useFetchSensorReadings from '../hooks/useFetchSensorReadings';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const DARK_GREEN = '#006400';
const LIGHT_GREEN = 'rgba(0, 100, 0, 0.6)';

const barChartOptions: ChartOptions<'bar'> = {
 responsive: true,
 maintainAspectRatio: false,
 plugins: {
   legend: { display: false },
   tooltip: {
     backgroundColor: `${DARK_GREEN}CC`,
     titleColor: '#fff',
     bodyColor: '#f9fafb',
     borderColor: DARK_GREEN,
     borderWidth: 1,
     padding: 10,
     cornerRadius: 8,
     titleFont: { size: 13, weight: 'bold' },
     bodyFont: { size: 12 },
   },
 },
 scales: {
   x: {
     title: {
       display: true,
       text: 'Usage Type',
       color: '#374151',
       font: { size: 13, weight: 600 },
     },
     ticks: { color: '#4b5563', font: { size: 12 } },
     grid: { display: false },
   },
   y: {
     title: {
       display: true,
       text: 'Gas Consumption (m³)',
       color: '#374151',
       font: { size: 13, weight: 600 },
     },
     ticks: { color: '#4b5563', font: { size: 12 }, precision: 0 },
     beginAtZero: true,
     grid: { color: 'rgba(0, 0, 0, 0.03)' },
   },
 },
 animation: {
   duration: 800,
   easing: 'easeOutCubic',
 },
};


const USAGE_CATEGORIES = ['Heater', 'Cooking', 'Generator', 'Baking', 'Water Heater'] as const;
type UsageType = typeof USAGE_CATEGORIES[number] | 'All';


const formatDate = (date: Date): string => date.toISOString().split('T')[0];


export default function ReportsPage() {
 const { sensorReadings: allReadings, loading, error } = useFetchSensorReadings();
 const [startDate, setStartDate] = useState<string>('');
 const [endDate, setEndDate] = useState<string>('');
 const [selectedUsage, setSelectedUsage] = useState<UsageType>('All');
 const [page, setPage] = useState(1);
 const itemsPerPage = 7;


 useEffect(() => {
   const today = new Date();
   const thirtyDaysAgo = new Date(today);
   thirtyDaysAgo.setDate(today.getDate() - 30);
   setStartDate(formatDate(thirtyDaysAgo));
   setEndDate(formatDate(today));
 }, []);


 const filteredReadings = useMemo(() => {
   if (!allReadings?.length || !startDate || !endDate) return [];
   const start = new Date(startDate);
   const end = new Date(endDate);
   end.setDate(end.getDate() + 1);
   return allReadings.filter((r) => {
     const readingDate = new Date(r.created_at);
     return readingDate >= start && readingDate < end;
   });
 }, [allReadings, startDate, endDate]);


 const grandTotal = useMemo(() => {
   return filteredReadings.reduce(
     (sum, r) => sum + (parseFloat(r.gas_consumption) || 0),
     0
   );
 }, [filteredReadings]);


 const dailyTotals = useMemo(() => {
   if (selectedUsage !== 'All' && selectedUsage !== 'Heater') {
     return [];
   }
   const map: Record<string, number> = {};
   filteredReadings.forEach((r) => {
     const date = new Date(r.created_at).toLocaleDateString('en-CA');
     const consumption = parseFloat(r.gas_consumption) || 0;
     map[date] = (map[date] || 0) + consumption;
   });
   return Object.entries(map)
     .map(([date, total]) => ({
       date,
       totalConsumption: parseFloat(total.toFixed(2)),
     }))
     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
 }, [filteredReadings, selectedUsage]);


 const totalPages = Math.max(1, Math.ceil(dailyTotals.length / itemsPerPage));


 useEffect(() => {
   setPage((prev) => Math.min(prev, totalPages));
 }, [totalPages]);


 const displayedReadings = useMemo(() => {
   const start = (page - 1) * itemsPerPage;
   return dailyTotals.slice(start, start + itemsPerPage);
 }, [dailyTotals, page, itemsPerPage]);


 const usageData: ChartData<'bar'> = useMemo(() => {
   const data = USAGE_CATEGORIES.map((usage) => {
     if ((selectedUsage === 'All' || selectedUsage === 'Heater') && usage === 'Heater') {
       return parseFloat(grandTotal.toFixed(2));
     }
     return 0;
   });

   return {
     labels: [...USAGE_CATEGORIES],
     datasets: [
       {
         data,
         backgroundColor: data.map((value, i) =>
           selectedUsage === 'All'
             ? value > 0
               ? `${DARK_GREEN}CC`
               : LIGHT_GREEN
             : USAGE_CATEGORIES[i] === selectedUsage
             ? `${DARK_GREEN}CC`
             : LIGHT_GREEN
         ),
         borderColor: data.map((_, i) =>
           selectedUsage === 'All'
             ? data[i] > 0
               ? DARK_GREEN
               : '#e5e7eb'
             : USAGE_CATEGORIES[i] === selectedUsage
             ? DARK_GREEN
             : '#e5e7eb'
         ),
         borderWidth: 1,
         borderRadius: 6,
         borderSkipped: false,
       },
     ],
   };
 }, [grandTotal, selectedUsage]);

 const selectedTotal = useMemo(() => {
   return selectedUsage === 'All' || selectedUsage === 'Heater' ? grandTotal : 0;
 }, [grandTotal, selectedUsage]);


 const getPageNumbers = (): number[] => {
   const maxVisible = 5;
   if (totalPages <= maxVisible) return Array.from({ length: totalPages }, (_, i) => i + 1);
   if (page <= 3) return [1, 2, 3, 4, 5];
   if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
   return [page - 2, page - 1, page, page + 1, page + 2];
 };

 if (loading) {
    return (
  
       <div className="flex h-screen max-h-screen overflow-hidden">
         <main className="flex-1 relative overflow-y-auto p-4 sm:p-6 bg-gray-50 min-w-0 ml-56">
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-70 z-20 gap-2">
             <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#006400] border-t-transparent" />
             <p className="text-gray-600">Loading sensor data...</p>
           </div>
         </main>
       </div>
  
   );
 }
 if (error) {
    return (
  
       <div className="flex h-screen max-h-screen overflow-hidden">
         <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 min-w-0 ml-56">
           <div className="text-center max-w-md">
             <div className="text-red-600 text-xl mb-2" aria-label="error-icon">
              
             </div>
             <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to Load Data</h3>
             <p className="text-gray-600 mb-4">{error}</p>
             <button
               onClick={() => window.location.reload()}
               className="px-4 py-2 bg-[#006400] text-white rounded-lg hover:bg-[#004d00] transition"
             >
               Retry
             </button>
           </div>
         </main>
       </div>
   
   );
 }

 return (
 
     <div className="flex h-screen max-h-screen overflow-hidden">
       <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 min-w-0  mt-[40px]">
         <div className="max-w-[1600px] mx-auto space-y-6">
           <header>
             <h1 className="text-4xl font-bold text-[#006400]">Gas Consumption Report</h1>
           </header>

           <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
             <div>
               <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                 Start Date
               </label>
               <input
                 id="startDate"
                 type="date"
                 value={startDate}
                 onChange={(e) => setStartDate(e.target.value)}
                 className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006400] focus:border-[#006400]"
               />
             </div>
             <div>
               <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                 End Date
               </label>
               <input
                 id="endDate"
                 type="date"
                 value={endDate}
                 min={startDate || undefined}
                 onChange={(e) => setEndDate(e.target.value)}
                 className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006400] focus:border-[#006400]"
               />
             </div>
             <div>
               <label htmlFor="usageType" className="block text-sm font-medium text-gray-700 mb-2">
                 Usage Type
               </label>
               <select
                 id="usageType"
                 value={selectedUsage}
                 onChange={(e) => setSelectedUsage(e.target.value as UsageType)}
                 className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006400] focus:border-[#006400] bg-white"
               >
                 <option value="All">All Usages</option>
                 {USAGE_CATEGORIES.map((usage) => (
                   <option key={usage} value={usage}>
                     {usage}
                   </option>
                 ))}
               </select>
             </div>
             <div className="flex items-end">
               <div className="bg-[#006400] rounded-lg px-4 py-2.5 w-full text-white text-center text-sm font-semibold">
                 Total: {selectedTotal.toFixed(2)} m³
               </div>
             </div>
           </section>

           <section className="bg-white rounded-xl shadow-sm border border-[#006400] p-5">
             <h2 className="text-lg font-semibold text-gray-900 mb-4">Gas Usage Distribution</h2>
             <div className="h-56">
               <Bar data={usageData} options={barChartOptions} />
             </div>
           </section>

           <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
             <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Gas Consumption</h2>
             {dailyTotals.length > 0 && (
               <p className="text-sm text-gray-600 mb-4">
                 Showing {displayedReadings.length} of {dailyTotals.length} days
               </p>
             )}
             <div className="overflow-x-auto">
               <table className="min-w-full border border-gray-300">
                 <thead>
                   <tr className="bg-[#006400] text-white">
                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Date</th>
                     <th className="px-4 py-3 text-right text-xs font-semibold uppercase whitespace-nowrap">
                       Total Consumption (m³)
                     </th>
                     <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Usage</th>
                   </tr>
                 </thead>
                 <tbody>
                   {dailyTotals.length === 0 ? (
                     <tr>
                       <td colSpan={3} className="px-4 py-10 text-center text-gray-500 italic">
                         {selectedUsage === 'All' || selectedUsage === 'Heater'
                           ? 'No consumption records in this date range.'
                           : `No data available for ${selectedUsage}.`}
                       </td>
                     </tr>
                   ) : (
                     displayedReadings.map((row, i) => (
                       <tr
                         key={row.date}
                         className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                       >
                         <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{row.date}</td>
                         <td className="px-4 py-3 text-sm text-right font-mono text-[#006400]">{row.totalConsumption.toFixed(2)}</td>
                         <td className="px-4 py-3 text-sm text-right">
                           <span className="font-medium text-[#006400]">Heater</span>
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>

             {dailyTotals.length > itemsPerPage && (
               <div className="fixed bottom-2 left-0 right-0 shadow-md z-10 flex justify-center items-center gap-2 sm:gap-4 p-4 bg-white">
                 <button
                   aria-label="Previous page"
                   className="px-3 py-1 sm:px-5 sm:py-2 rounded border border-[#006400] text-[#006400] font-semibold disabled:opacity-40 text-sm sm:text-base"
                   onClick={() => setPage(page - 1)}
                   disabled={page === 1}
                 >
                   ‹
                 </button>


                 {getPageNumbers().map((pageNum) => (
                   <button
                     key={pageNum}
                     aria-label={`Page ${pageNum}`}
                     className={`w-10 h-10 flex items-center justify-center rounded border ${
                       pageNum === page
                         ? 'bg-[#006400] text-white border-[#006400]'
                         : 'border-[#006400] text-[#006400] hover:bg-[#f0f7f0]'
                     }`}
                     onClick={() => setPage(pageNum)}
                   >
                     {pageNum}
                   </button>
                 ))}


                 <button
                   aria-label="Next page"
                   className="px-3 py-1 sm:px-5 sm:py-2 rounded border border-[#006400] bg-[#006400] text-white font-semibold disabled:opacity-40 text-sm sm:text-base"
                   onClick={() => setPage(page + 1)}
                   disabled={page === totalPages}
                 >
                   ›
                 </button>
               </div>
             )}
           </section>
         </div>
       </main>
     </div>
 );
}
