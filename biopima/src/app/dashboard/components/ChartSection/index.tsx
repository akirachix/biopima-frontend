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
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-green-800">Gas Production</h3>
          {pressureData.length > 0 && (
            <p className="text-sm text-green-600 mt-1">
              Last updated: {new Date(pressureData[pressureData.length - 1].timestamp).toLocaleString()}
            </p>
          )}
        </div>
        {currentPressure && (
          <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-medium text-green-800">Live: {currentPressure}</span>
          </div>
        )}
      </div>

      <div className="w-full h-96">
        {pressureData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={pressureData}
              margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
              <XAxis
                dataKey="time"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#64748b', fontWeight: 500 }}
                tickFormatter={tickFormatter}
                interval={0}
                height={50}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#64748b', fontWeight: 500 }}
                width={60}
                label={{
                  value: 'Gas (kPa)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#475569',
                  fontSize: 12,
                  fontWeight: 600,
                  dx: 10,
                }}
              />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px',
                }}
                itemStyle={{ color: '#1e293b', fontSize: '14px' }}
                labelStyle={{ fontWeight: 600, color: '#059669' }}
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value: number) => [`${value.toFixed(1)} kPa`, 'Gas Production']}
                cursor={{ stroke: '#059669', strokeWidth: 1, strokeDasharray: '5 5' }}
              />

              <Line
                type="monotone"
                dataKey="pressure"
                stroke="#059669"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: '#059669',
                  strokeWidth: 3,
                  fill: 'white',
                  strokeOpacity: 1,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg font-medium">No gas production data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
