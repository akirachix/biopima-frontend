'use client';
import React, { useLayoutEffect, useRef } from 'react';

interface ChartSectionProps {
  pressureData: Array<{
    time: string;
    pressure: number;
    timestamp: Date;
  }>;
  currentPressure: string | null;
}

export default function ChartSection({ pressureData, currentPressure }: ChartSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    if (pressureData.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

    
      const rawWidth = container.clientWidth;
      const width = rawWidth > 0 ? rawWidth : 600;
      const height = 300;

     
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * scale);
      canvas.height = Math.floor(height * scale);
      ctx.scale(scale, scale);

   
      drawChart(ctx, width, height);
    };

    const drawChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const margin = 50;
      const chartWidth = width - 2 * margin;
      const chartHeight = height - 2 * margin;

      const pressures = pressureData.map(d => d.pressure);
      const maxPressure = Math.max(...pressures, 10);

      ctx.clearRect(0, 0, width, height);

    
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.textAlign = 'right';
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';

      const steps = 5;
      for (let i = 0; i <= steps; i++) {
        const value = (i * maxPressure) / steps;
        const y = height - margin - (i / steps) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
        ctx.fillText(value.toFixed(1), margin - 10, y + 4);
      }

      ctx.textAlign = 'center';
      const xStep = Math.max(1, Math.ceil(pressureData.length / 6));
      for (let i = 0; i < pressureData.length; i += xStep) {
        const x = margin + (i / (pressureData.length - 1)) * chartWidth;
        ctx.fillText(pressureData[i].time, x, height - margin + 20);
      }

    
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(margin, margin);
      ctx.lineTo(margin, height - margin);
      ctx.lineTo(width - margin, height - margin);
      ctx.stroke();

   
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Time', width / 2, height - 10);

    
      ctx.strokeStyle = '#006400';
      ctx.lineWidth = 3;
      ctx.beginPath();

      pressureData.forEach((point, i) => {
        const x = margin + (i / (pressureData.length - 1)) * chartWidth;
        const y = height - margin - (point.pressure / maxPressure) * chartHeight;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    };
    const redraw = () => {
      resizeCanvas();
      animationFrameId = requestAnimationFrame(redraw);
    };

 
    redraw();


    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [pressureData]);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-green-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <div>
          <h3 className="text-xl font-semibold text-green-900">Gas Pressure Chart</h3>
          {pressureData.length > 0 && (
            <p className="text-sm text-gray-500">
              Last updated: {new Date(pressureData[pressureData.length - 1].timestamp).toLocaleString()}
            </p>
          )}
        </div>
        {currentPressure && (
          <div className="flex items-center space-x-2 text-sm bg-green-50 px-3 py-1 rounded-full">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="font-medium">Current: {currentPressure}</span>
          </div>
        )}
      </div>

      <div className="relative w-full h-80 min-w-0">
        {pressureData.length > 0 ? (
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            style={{ maxWidth: '100%', height: '300px' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <p>No pressure data available</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Showing last {pressureData.length} readings. Hover over line to see details.</p>
      </div>
    </div>
  );
} 