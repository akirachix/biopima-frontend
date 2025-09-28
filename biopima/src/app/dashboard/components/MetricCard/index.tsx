import { Activity, Thermometer, Gauge } from 'lucide-react';
interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  variant: 'methane' | 'temperature' | 'pressure';
}
export default function MetricCard({
  title,
  value,
  unit,
  description,
  variant,
}: MetricCardProps) {
  const iconColor =
    variant === 'methane'
      ? 'text-green-600'
      : variant === 'temperature'
      ? 'text-pink-600'
      : 'text-orange-600';
  const borderColor =
    variant === 'methane'
      ? 'border-green-200'
      : variant === 'temperature'
      ? 'border-pink-200'
      : 'border-orange-200';
  const bgColor =
    variant === 'methane'
      ? 'bg-green-50'
      : variant === 'temperature'
      ? 'bg-pink-50'
      : 'bg-orange-50';
  const Icon =
    variant === 'methane'
      ? Activity
      : variant === 'temperature'
      ? Thermometer
      : Gauge;
  return (
    <div
      className={`bg-white rounded-2xl px-6 py-4 shadow-md border-2 ${borderColor} min-w-[220px] max-w-xs flex flex-col justify-between`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <div className="text-lg font-bold text-gray-900 mt-1">
            <span className="text-2xl font-bold">{value}</span>{' '}
            <span className="text-xs font-semibold">{unit}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${bgColor} flex-shrink-0 mt-1`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
















