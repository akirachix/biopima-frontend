import { Thermometer, AlertTriangle } from 'lucide-react';
export default function ActivityFeed() {
  return (
    <div className="bg-[#F8FBF6] rounded-xl p-5 border border-green-200 shadow-sm max-w-xs">
      <h3 className="text-base font-bold text-green-800 mb-1">Activity Feed</h3>
      <p className="text-xs text-green-700 mb-4">Recent system events and alerts.</p>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <span className="w-3 h-3 mt-2 rounded-full bg-green-600" />
          <div className="flex-1">
            <div className="flex items-center space-x-1 text-sm text-black font-semibold">
              <Thermometer className="w-4 h-4 flex-shrink-0 text-green-600" />
              <span>Temp Warning</span>
            </div>
            <p className="text-xs text-gray-700 mt-1">
              Low Temperature Warning: Digester temperature at 34.6°C.
            </p>
            <p className="text-xs text-gray-500">less than a minute ago</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <span className="w-3 h-3 mt-2 rounded-full bg-green-600" />
          <div className="flex-1">
            <div className="flex items-center space-x-1 text-sm text-black font-semibold">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-green-600" />
              <span>Leak Warning</span>
            </div>
            <p className="text-xs text-gray-700 mt-1">
              Leak Warning: Pressure at 1.02 bar (15.0% drop).
            </p>
            <p className="text-xs text-gray-500">less than a minute ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}












