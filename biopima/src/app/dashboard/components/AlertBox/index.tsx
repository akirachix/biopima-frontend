import { AlertTriangle } from 'lucide-react';

export default function AlertBox() {
  return (
    <div className="rounded-3xl p-4 sm:p-6 bg-red-500 text-white shadow-lg border border-green-300">
      <div className="flex items-center space-x-2 mb-2">
        <AlertTriangle className="w-5 h-5" />
        <span className="font-semibold">Temperature Alert</span>
      </div>
      <p className="text-sm opacity-90">Low Temperature Warning:</p>
      <p className="text-sm opacity-90">Digester temperature at 34.6°C.</p>
    </div>
  );
}