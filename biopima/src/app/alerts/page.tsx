'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import useLiveSensorReadings from '../hooks/useFetchSensorReadings';
import InstitutionLayout from '../shared-components/Sidebar/InstitutionLayout';

interface Alert {
 id: string;
 type: 'warning' | 'critical';
 message: string;
 timestamp: Date;
 readingId: number;
}

type FilterType = 'all' | 'warning' | 'critical';
type FilterDate = 'all' | 'today' | 'week';

export default function AlertsPage() {
 const { sensorReadings } = useLiveSensorReadings();
 const allAlerts = useMemo<Alert[]>(() => {
   return sensorReadings
     .map((reading) => {
       const alerts: Alert[] = [];
       const createdAt = new Date(reading.created_at);
       const temp = parseFloat(reading.temperature_level);
       const pressure = parseFloat(reading.pressure_level);
       const methane = parseFloat(reading.methane_level);

       if (!isNaN(temp)) {
         if (temp < 35) {
           alerts.push({
             id: `temp-low-${reading.sensor_readings_id}`,
             type: 'warning',
             message: 'Temperature too low',
             timestamp: createdAt,
             readingId: reading.sensor_readings_id,
           });
         } else if (temp > 37) {
           alerts.push({
             id: `temp-high-${reading.sensor_readings_id}`,
             type: 'warning',
             message: 'Temperature too high',
             timestamp: createdAt,
             readingId: reading.sensor_readings_id,
           });
         }
       }
       if (!isNaN(pressure)) {
         if (pressure < 8) {
           alerts.push({
             id: `pressure-low-${reading.sensor_readings_id}`,
             type: 'warning',
             message: 'Pressure too low',
             timestamp: createdAt,
             readingId: reading.sensor_readings_id,
           });
         } else if (pressure > 15) {
           alerts.push({
             id: `pressure-high-${reading.sensor_readings_id}`,
             type: 'warning',
             message: 'Pressure too high',
             timestamp: createdAt,
             readingId: reading.sensor_readings_id,
           });
         }
       }
       if (!isNaN(methane) && methane > 2.0) {
         alerts.push({
           id: `methane-high-${reading.sensor_readings_id}`,
           type: 'critical',
           message: 'Methane levels too high',
           timestamp: createdAt,
           readingId: reading.sensor_readings_id,
         });
       }
       return alerts;
     })
     .flat()
     .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
 }, [sensorReadings]);

 const [filterType, setFilterType] = useState<FilterType>('all');
 const [filterDate, setFilterDate] = useState<FilterDate>('today');
 const [currentPage, setCurrentPage] = useState(1);

 const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
   const value = e.target.value;
   if (value === 'all' || value === 'warning' || value === 'critical') {
     setFilterType(value);
     setCurrentPage(1);
   }
 };

 const handleDateChange = (e: ChangeEvent<HTMLSelectElement>) => {
   const value = e.target.value;
   if (value === 'all' || value === 'today' || value === 'week') {
     setFilterDate(value);
     setCurrentPage(1);
   }
 };

 const filteredAlerts = useMemo(() => {
   return allAlerts.filter((alert) => {
     if (filterType !== 'all' && alert.type !== filterType) return false;
     if (filterDate === 'today') {
       const today = new Date();
       return (
         alert.timestamp.getDate() === today.getDate() &&
         alert.timestamp.getMonth() === today.getMonth() &&
         alert.timestamp.getFullYear() === today.getFullYear()
       );
     }
     if (filterDate === 'week') {
       const oneWeekAgo = new Date();
       oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
       return alert.timestamp >= oneWeekAgo;
     }
     return true;
   });
 }, [allAlerts, filterType, filterDate]);

 const itemsPerPage = 8;
 const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / itemsPerPage));
 const paginatedAlerts = filteredAlerts.slice(
   (currentPage - 1) * itemsPerPage,
   currentPage * itemsPerPage
 );

 const handlePrevPage = () => {
   if (currentPage > 1) setCurrentPage(currentPage - 1);
 };

 const handleNextPage = () => {
   if (currentPage < totalPages) setCurrentPage(currentPage + 1);
 };

 return (
   <InstitutionLayout>
     <div className="bg-white min-h-screen w-full px-25 py-12 pb-16">
       <main className="flex-1">
         <header className="mb-8">
           <h1 className="text-4xl font-extrabold text-green-900 tracking-wide mb-2">
             Alerts
           </h1>
           <p className="text-green-900 font-semibold text-lg tracking-tight">
             A historical log of all systems alerts and events
           </p>
         </header>

         <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
           <div className="flex gap-6 flex-wrap">
             <select
               value={filterType}
               onChange={handleTypeChange}
               className="rounded-md px-4 py-2 border border-green-400 bg-white text-green-800 font-semibold shadow-sm hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition ease-in-out"
               style={{ minWidth: 140 }}
               aria-label="Filter by Alert Type"
             >
               <option value="all">All Types</option>
               <option value="warning">Warning</option>
               <option value="critical">Critical</option>
             </select>
             <select
               value={filterDate}
               onChange={handleDateChange}
               className="rounded-md px-4 py-2 border border-green-400 bg-white text-green-800 font-semibold shadow-sm hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition ease-in-out"
               style={{ minWidth: 140 }}
               aria-label="Filter by Date Range"
             >
               <option value="today">Today</option>
               <option value="week">Last 7 Days</option>
               <option value="all">All Time</option>
             </select>
           </div>

           <div className="text-green-900 font-extrabold text-xl tracking-tight">
             Total Alerts:{' '}
             <span className="text-2xl pl-2 font-black">{filteredAlerts.length}</span>
           </div>
         </div>

         <section className="bg-white rounded-xl shadow border border-green-200 overflow-hidden">
           <table className="w-full text-left border-collapse" style={{ fontSize: 16 }}>
             <thead className="bg-green-900 text-white select-none shadow-inner">
               <tr>
                 <th className="py-5 px-8 font-semibold tracking-wide">Type</th>
                 <th className="py-5 font-semibold tracking-wide">Message</th>
                 <th className="py-5 px-8 font-semibold tracking-wide text-right">Timestamp</th>
               </tr>
             </thead>
             <tbody>
               {paginatedAlerts.length > 0 ? (
                 paginatedAlerts.map((alert) => (
                   <tr
                     key={alert.id}
                     className="border-b border-green-100 hover:bg-green-50 transition-colors duration-200"
                     style={{
                       color:
                         alert.type === 'critical'
                           ? '#9e2a2b'
                           : alert.type === 'warning'
                           ? '#856404' 
                           : '#234d20',
                       fontWeight: 600,
                     }}
                   >
                     <td className="py-4 px-8 align-middle whitespace-nowrap">
                       <span
                         style={{
                  
                           backgroundColor:
                             alert.type === 'critical'
                               ? '#fce8e8'
                               : 'transparent',
                           borderRadius: 9999,
                           padding: alert.type === 'critical' ? '6px 24px' : '4px 16px',
                           fontSize: 15,
                           color:
                             alert.type === 'critical'
                               ? '#b12f2f'
                               : alert.type === 'warning'
                               ? '#856404'
                               : '#187221',
                           border:
                             alert.type === 'critical'
                               ? '1.6px solid #f2a4a4'
                               : alert.type === 'warning'
                               ? '1.4px solid #ffeaa7'
                               : '1.5px solid transparent',
                           boxShadow:
                             alert.type === 'critical'
                               ? '0 0 10px #f9d0d0'
                               : 'none',
                           fontWeight: '600',
                           userSelect: 'none',
                           textTransform: 'capitalize',
                           letterSpacing: 0.5,
                           fontStyle: alert.type === 'critical' ? 'italic' : 'normal',
                         }}
                       >
                         {alert.type}
                       </span>
                     </td>
                     <td className="py-4 text-gray-700">{alert.message}</td>
                     <td className="py-4 px-8 text-right text-gray-600" style={{ opacity: 0.87 }}>
                       {alert.timestamp.toLocaleString()}
                     </td>
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan={3} className="py-16 text-center text-gray-400 font-semibold text-lg">
                     No alerts found
                   </td>
                 </tr>
               )}
             </tbody>
           </table>

           <div className="mt-8 flex justify-center items-center gap-2 py-5 bg-green-50 border-t border-green-200">
             <button
               onClick={handlePrevPage}
               disabled={currentPage === 1}
               className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                 currentPage === 1
                   ? 'text-gray-400 cursor-not-allowed'
                   : 'text-green-800 bg-white hover:bg-green-100 shadow-sm hover:shadow'
               }`}
               aria-label="Previous page"
             >
               ← Previous
             </button>

             <span className="mx-2 text-gray-500">|</span>
             <span className="text-green-800 font-semibold">
               Page <span className="font-bold">{currentPage}</span> of {totalPages}
             </span>
             <span className="mx-2 text-gray-500">|</span>

             <button
               onClick={handleNextPage}
               disabled={currentPage >= totalPages}
               className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                 currentPage >= totalPages
                   ? 'text-gray-400 cursor-not-allowed'
                   : 'text-green-800 bg-white hover:bg-green-100 shadow-sm hover:shadow'
               }`}
               aria-label="Next page"
             >
               Next →
             </button>
           </div>
         </section>
       </main>
     </div>
   </InstitutionLayout>
 );
}

