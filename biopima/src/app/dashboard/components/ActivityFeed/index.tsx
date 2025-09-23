import { Thermometer, AlertTriangle } from 'lucide-react';

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-xl p-4 border border-green-300 shadow-sm max-w-xs">
      <h3 className="text-sm font-semibold text-green-800 mb-2">Activity Feed</h3>
      <p className="text-xs text-green-600 mb-3">Recent system events and alerts.</p>

      <div className="space-y-3">
      
        <div className="flex items-start space-x-2">
          <span className="w-2 h-2 mt-2 rounded-full bg-green-500"></span>
          <div className="flex-1">
            <div className="flex items-center space-x-1 text-sm text-green-700">
              <Thermometer className="w-4 h-4 flex-shrink-0" />
              <strong>Temp Warning</strong>
            </div>
            <p className="text-xs text-gray-600 mt-1">Low Temperature Warning: Digester temperature at 34.6°C.</p>
            <p className="text-xs text-gray-500">less than a minute ago</p>
          </div>
        </div>

 
        <div className="flex items-start space-x-2">
          <span className="w-2 h-2 mt-2 rounded-full bg-yellow-700"></span>
          <div className="flex-1">
            <div className="flex items-center space-x-1 text-sm text-yellow-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <strong>Leak Warning</strong>
            </div>
            <p className="text-xs text-gray-600 mt-1">Leak Warning: Pressure at 1.02 bar (15.0% drop).</p>
            <p className="text-xs text-gray-500">less than a minute ago</p>
          </div>
        </div>
      </div>

    </div>
  );
}