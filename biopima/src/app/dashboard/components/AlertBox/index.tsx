'use client';
import { AlertTriangle } from 'lucide-react';

interface AlertBoxProps {
  methaneLevel: number | null;
}

export default function AlertBox({ methaneLevel }: AlertBoxProps) {
  if (methaneLevel === null || methaneLevel <= 2) return null;

  return (
    <div className="rounded-3xl p-2 sm:p-3 bg-red-500 text-white shadow-lg border border-green-300 mt-[10rem] max-w-xs ml-6">
      <div className="flex items-center space-x-2 mb-1">
        <AlertTriangle size={48} className="text-white" />
        <span className="font-semibold text-lg">Methane Alert</span>
      </div>
      <p className="text-sm opacity-90 mb-1">High Methane Detected:</p>
      <p className="text-sm opacity-90">
        Methane level at {methaneLevel.toFixed(1)} ppm.
      </p>
    </div>
  );
}
