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
      <div className="flex min-h-screen bg-white px-4">
        <main className="flex-1 min-h-screen py-10">
          <div className="w-full flex flex-col items-center">
          
            <header className="mb-6 w-full px-8" style={{ maxWidth: '100%' }}>
              <h1 className="text-4xl font-bold text-green-800">Alerts</h1>
              <p className="text-green-700 mt-2">A historical log of all systems alerts and events</p>
            </header>
            <section className="w-full flex justify-center">
              <div
                className="rounded-xl mx-auto w-full"
                style={{
                  maxWidth: '100%',
                  backgroundColor: '#014D00',
                  border: '2px solid #68c080',
                  minHeight: '420px',
                  boxShadow: '0 2px 14px rgba(14,76,2,0.06)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                }}
              >
                <div className="flex gap-6 mb-8 px-8 pt-8">
                  <select
                    value={filterType}
                    onChange={handleTypeChange}
                    className="rounded-lg px-4 py-2 border"
                    style={{
                      backgroundColor: 'white',
                      borderColor: '#056d05',
                      color: '#056d05',
                      fontWeight: 600,
                      minWidth: 120,
                    }}
                  >
                    <option value="all">All Types</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                  <select
                    value={filterDate}
                    onChange={handleDateChange}
                    className="rounded-lg px-4 py-2 border"
                    style={{
                      backgroundColor: 'white',
                      borderColor: '#056d05',
                      color: '#056d05',
                      fontWeight: 600,
                      minWidth: 120,
                    }}
                  >
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
                <table className="w-full text-left text-white" style={{ fontSize: 15 }}>
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#68c080' }}>
                      <th className="py-4 px-8">Types</th>
                      <th className="py-4">Message</th>
                      <th className="py-4 text-right px-8">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAlerts.length > 0 ? (
                      paginatedAlerts.map((alert) => (
                        <tr
                          key={alert.id}
                          className="border-b"
                          style={{ borderColor: '#68c080' }}
                        >
                          <td className="py-4 px-8">
                            <span
                              style={{
                                backgroundColor: 'white',
                                borderRadius: 9999,
                                padding: '4px 20px',
                                display: 'inline-block',
                                minWidth: 94,
                                fontSize: 13,
                                fontWeight: 600,
                                textAlign: 'center',
                                boxShadow:
                                  alert.type === 'warning'
                                    ? '0 0 5px #cfdba1'
                                    : '0 0 5px #ffd2d2',
                                textTransform: 'capitalize',
                                color: alert.type === 'warning' ? '#3c4603' : '#8a0c0c',
                                userSelect: 'none',
                              }}
                            >
                              {alert.type}
                            </span>
                          </td>
                          <td className="py-4">{alert.message}</td>
                          <td className="py-4 px-8 text-right" style={{ opacity: 0.78 }}>
                            {alert.timestamp.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-12 text-center text-gray-300">
                          No alerts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div
                  className="mt-6 flex justify-center items-center pb-6 px-8"
                  style={{ color: 'white', fontSize: 15 }}
                >
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-6 py-2 rounded-md cursor-pointer select-none font-semibold"
                      style={{
                        backgroundColor: 'white',
                        color: '#0a4602',
                        borderRadius: 8,
                        fontWeight: 600,
                        opacity: currentPage === 1 ? 0.5 : 1,
                        boxShadow: '0 1px 5px 0 rgba(0,0,0,0.07)',
                        pointerEvents: currentPage === 1 ? 'none' : 'auto',
                        border: 'none',
                      }}
                      aria-disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                      className="px-6 py-2 rounded-md cursor-pointer select-none font-semibold"
                      style={{
                        backgroundColor: 'white',
                        color: '#0a4602',
                        borderRadius: 8,
                        fontWeight: 600,
                        opacity: currentPage >= totalPages ? 0.5 : 1,
                        boxShadow: '0 1px 5px 0 rgba(0,0,0,0.07)',
                        pointerEvents: currentPage >= totalPages ? 'none' : 'auto',
                        border: 'none',
                      }}
                      aria-disabled={currentPage >= totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </InstitutionLayout>
  );
}
