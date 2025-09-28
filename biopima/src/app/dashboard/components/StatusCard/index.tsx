import { AlertTriangle, Activity } from 'lucide-react';
interface StatusCardProps {
  type: 'system' | 'monitoring';
}
export default function StatusCard({ type }: StatusCardProps) {
  if (type === 'system') {
    return (
      <div className="flex flex-col rounded-xl p-6 bg-[#A9F5D0] max-w-xs shadow-md">
        <div className="flex items-center space-x-3 mb-1">
          <span className="font-extrabold text-black text-lg">System Status</span>
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <span className="text-sm text-black">All systems operational</span>
        <span className="mt-2 font-bold text-red-700 text-lg">Warning</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col rounded-xl p-6 bg-[#A9F5D0] max-w-xs shadow-md">
      <div className="flex items-center">
        <div className="rounded-full bg-green-300 p-2 mr-3">
          <Activity className="w-6 h-6 text-green-800" />
        </div>
        <span className="text-sm text-black">
          Automatically monitoring pressure, temperature, & volume.
        </span>
      </div>
    </div>
  );
}













