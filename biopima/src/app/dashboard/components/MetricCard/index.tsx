import { Activity, Thermometer, Gauge } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  variant: 'methane' | 'temperature' | 'pressure';
}

export default function MetricCard({ title, value, unit, description, variant }: MetricCardProps) {
  const iconColor =
    variant === 'methane' ? 'text-green-600' :
    variant === 'temperature' ? 'text-pink-600' : 'text-orange-600';

  const borderColor =
    variant === 'methane' ? 'border-green-300' :
    variant === 'temperature' ? 'border-pink-300' : 'border-orange-300';

  const bgColor =
    variant === 'methane' ? 'bg-green-100' :
    variant === 'temperature' ? 'bg-pink-100' : 'bg-orange-100';

  const Icon =
    variant === 'methane' ? Activity :
    variant === 'temperature' ? Thermometer : Gauge;

  return (
    <div className={`bg-white rounded-3xl p-4 shadow-lg border ${borderColor} max-w-xs mb-4`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <div className="text-xl font-extrabold text-gray-900 mt-1">
            {value} <span className="text-xs">{unit}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`w-10 h-10 rounded-3xl flex items-center justify-center ${bgColor} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
