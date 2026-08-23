import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  iconColor?: string;
  iconBg?: string;
  accent?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const accentClasses = {
  default: 'border-slate-200',
  success: 'border-emerald-200',
  warning: 'border-amber-200',
  danger: 'border-red-200',
  info: 'border-blue-200',
};

export function StatCard({
  icon,
  label,
  value,
  change,
  changeLabel,
  iconColor = 'text-brand-600',
  iconBg = 'bg-brand-50',
  accent = 'default',
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border ${accentClasses[accent]} p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-600' : 'text-slate-500'
            }`}
          >
            {change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : change < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
        {changeLabel && <p className="text-xs text-slate-400 mt-1">{changeLabel}</p>}
      </div>
    </div>
  );
}
