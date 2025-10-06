'use client';
import React, { useMemo, useState, useEffect, useRef } from 'react';
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
import useLiveSensorReadings from '../hooks/useFetchSensorReadings';
import Pagination from '../components/Pagination';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const DARK_GREEN = '#006400';
const LIGHT_GREEN = '#90EE90';

const barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: DARK_GREEN,
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
type UsageType = typeof USAGE_CATEGORIES[number];



export default function ReportsPage() {
 
  const { sensorReadings: allReadings = [], isConnected, error } = useLiveSensorReadings();
  const reportRef = useRef<HTMLDivElement>(null);

  const isLoading = !isConnected && !error;
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedUsage, setSelectedUsage] = useState<UsageType | 'All'>('All');
  const [page, setPage] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const itemsPerPage = 5; 

  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setStartDate(formatDate(thirtyDaysAgo));
    setEndDate(formatDate(today));
  }, []);



  const parseConsumption = (value: number | string | null | undefined): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  
  const filteredReadings = useMemo(() => {
    if (!Array.isArray(allReadings) || !startDate || !endDate) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1); 

    return allReadings.filter((r) => {
      const consumption = parseConsumption(r.gas_consumption);
      if (consumption <= 0) return false;

      const readingDate = new Date(r.created_at);
      return !isNaN(readingDate.getTime()) && readingDate >= start && readingDate < end;
    });
  }, [allReadings, startDate, endDate]);

  
  const totalHeaterConsumption = useMemo(() => {
    return filteredReadings.reduce((sum, r) => sum + parseConsumption(r.gas_consumption), 0);
  }, [filteredReadings]);

  
  const dailyTotals = useMemo(() => {
    const dailyMap: Record<string, number> = {};
    filteredReadings.forEach((r) => {
      const dateStr = new Date(r.created_at).toLocaleDateString('en-CA'); 
      const cons = parseConsumption(r.gas_consumption);
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + cons;
    });

    return Object.entries(dailyMap)
      .map(([date, total]) => ({
        date,
        totalConsumption: parseFloat(total.toFixed(2)),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 
  }, [filteredReadings]);

  
  const usageData: ChartData<'bar'> = {
    labels: [...USAGE_CATEGORIES],
    datasets: [
      {
        data: USAGE_CATEGORIES.map((usage) => (usage === 'Heater' ? totalHeaterConsumption : 0)),
        backgroundColor: USAGE_CATEGORIES.map((usage) =>
          usage === 'Heater' ? DARK_GREEN : LIGHT_GREEN
        ),
        borderColor: USAGE_CATEGORIES.map((usage) =>
          usage === 'Heater' ? DARK_GREEN : '#e5e7eb'
        ),
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  
  const displayTotal = selectedUsage === 'All' || selectedUsage === 'Heater' ? totalHeaterConsumption : 0;

  
  const totalPages = Math.max(1, Math.ceil(dailyTotals.length / itemsPerPage));
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const displayedReadings = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return dailyTotals.slice(start, start + itemsPerPage);
  }, [dailyTotals, page, itemsPerPage]);

  
  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const clone = reportRef.current.cloneNode(true) as HTMLElement;
      clone.style.width = '1600px';
      clone.style.backgroundColor = '#fff';
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: '#fff',
        logging: false,
      });
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`gas-consumption-report-${formatDate(new Date())}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  
  if (isLoading) {
    return (
      <div className="flex h-screen max-h-screen overflow-hidden">
        <main className="flex-1 relative overflow-y-auto p-4 sm:p-6 bg-gray-50 min-w-0 ml-56">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-20">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#006400] border-t-transparent mb-2" />
              <p className="text-gray-600">Loading historical data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen max-h-screen overflow-hidden">
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 min-w-0 ml-56">
          <div className="text-center max-w-md mx-auto mt-20">
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
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 min-w-0 mt-[40px]">
        <div ref={reportRef} className="max-w-[1600px] mx-auto space-y-6">
          
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#006400]">Gas Consumption Report</h1>
            <button
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              className="px-4 py-2 bg-[#006400] text-white rounded-lg hover:bg-[#004d00] transition flex items-center gap-2 disabled:opacity-70"
            >
              {isGeneratingPDF ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </header>

          
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006400] focus:border-[#006400]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006400] focus:border-[#006400]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usage Type</label>
              <select
                value={selectedUsage}
                onChange={(e) => setSelectedUsage(e.target.value as UsageType | 'All')}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006400] focus:border-[#006400] bg-white"
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
                Total: {displayTotal.toFixed(2)} m³
              </div>
            </div>
          </section>

     
          <section className="bg-white rounded-xl shadow-sm border border-[#006400] p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gas Usage Distribution</h2>
            <div className="h-64">
              <Bar data={usageData} options={barChartOptions} />
            </div>
          </section>

      
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Gas Consumption (Heater)</h2>
            {dailyTotals.length > 0 && (
              <p className="text-sm text-gray-600 mb-4">
                Showing {displayedReadings.length} of {dailyTotals.length} days
              </p>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-[#006400] text-white">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Consumption (m³)</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyTotals.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-10 text-center text-gray-500 italic">
                        No heater consumption records in this period.
                      </td>
                    </tr>
                  ) : (
                    displayedReadings.map((row, i) => (
                      <tr key={row.date} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>  
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{row.date}</td>
                        <td className="px-4 py-3 text-sm text-right font-mono text-[#006400]">
                          {row.totalConsumption.toFixed(2)}
                        </td>
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
              <div className="mt-6 flex justify-center">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}