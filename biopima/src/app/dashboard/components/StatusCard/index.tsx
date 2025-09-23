import { AlertTriangle, Activity } from 'lucide-react';

interface StatusCardProps {
  type: 'system' | 'monitoring';
}

export default function StatusCard({ type }: StatusCardProps) {
  if (type === 'system') {
    return (
      <div className="flex flex-col rounded-3xl p-4 bg-green-100 shadow-lg max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <span className="font-bold text-base text-gray-700">System Status</span>
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <span className="text-sm text-gray-700">All systems operational</span>
        <span className="text-lg font-bold text-red-500">Warning</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-3xl p-4 bg-green-100 shadow-lg max-w-xs"> 
      <div className="flex items-center mb-2">
        <Activity className="w-5 h-5 text-green-700 mr-2" />
        <span className="font-semibold text-gray-700">
          Automatically monitoring pressure, temperature, & volume.
        </span>
      </div>
    </div>
  );
}
