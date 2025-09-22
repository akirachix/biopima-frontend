import { Thermometer, AlertTriangle } from 'lucide-react';

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-green-300 max-w-sm">
      <h3 className="text-lg font-bold text-green-900 mb-1">Activity Feed</h3>
      <p className="text-xs text-green-700 mb-4">Recent system events and alerts.</p>

      <div className="space-y-5">
        <div className="flex flex-col">
          <div className="flex items-center mb-1 space-x-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <div className="flex items-center space-x-1 text-green-700">
              <Thermometer className="w-5 h-5 flex-shrink-0" />
              <strong className="text-base select-none">Temp Warning</strong>
            </div>
            <span className="ml-auto text-xs text-gray-500 select-none">
              less than a minute ago
            </span>
          </div>
          <p className="ml-5 text-sm text-gray-700 leading-snug">
            Low Temperature Warning: Digester temperature at 34.6°C.
          </p>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center mb-1 space-x-2">
            <span className="w-3 h-3 rounded-full bg-yellow-700"></span>
            <div className="flex items-center space-x-1 text-yellow-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <strong className="text-base select-none">Leak Warning</strong>
            </div>
            <span className="ml-auto text-xs text-gray-500 select-none">
              less than a minute ago
            </span>
          </div>
          <p className="ml-5 text-sm text-gray-700 leading-snug">
            Leak Warning: Pressure at 1.02 bar (15.0% drop).
          </p>
        </div>
      </div>
    </div>
  );
}
