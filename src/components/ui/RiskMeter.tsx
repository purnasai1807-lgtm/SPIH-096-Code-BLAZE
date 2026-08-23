import type { RiskLevel } from '@/types';

const colors: Record<RiskLevel, { from: string; to: string; text: string; bg: string; ring: string }> = {
  LOW: { from: '#10b981', to: '#059669', text: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-200' },
  MEDIUM: { from: '#f59e0b', to: '#d97706', text: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-200' },
  HIGH: { from: '#f97316', to: '#ea580c', text: 'text-orange-700', bg: 'bg-orange-50', ring: 'ring-orange-200' },
  CRITICAL: { from: '#ef4444', to: '#dc2626', text: 'text-red-700', bg: 'bg-red-50', ring: 'ring-red-200' },
  BREACHED: { from: '#7c2d12', to: '#450a0a', text: 'text-red-900', bg: 'bg-red-950', ring: 'ring-red-800' },
};

function levelFromScore(score: number): RiskLevel {
  if (score >= 90) return 'BREACHED';
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

interface RiskMeterProps {
  score: number;
  level?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function RiskMeter({ score, level, size = 'md', showLabel = true }: RiskMeterProps) {
  const riskLevel = level || levelFromScore(score);
  const c = colors[riskLevel];

  const dimensions = {
    sm: { w: 80, h: 80, stroke: 6, fontSize: 16 },
    md: { w: 120, h: 120, stroke: 8, fontSize: 24 },
    lg: { w: 160, h: 160, stroke: 10, fontSize: 32 },
  }[size];

  const radius = (dimensions.w - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference * 0.75;
  const arcLength = circumference * 0.75;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dimensions.w, height: dimensions.h }}>
        <svg width={dimensions.w} height={dimensions.h} className="-rotate-[135deg]">
          <circle
            cx={dimensions.w / 2}
            cy={dimensions.h / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={dimensions.stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          <circle
            cx={dimensions.w / 2}
            cy={dimensions.h / 2}
            r={radius}
            fill="none"
            stroke={c.from}
            strokeWidth={dimensions.stroke}
            strokeDasharray={`${arcLength - offset} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{ stroke: `url(#gradient-${riskLevel})` }}
          />
          <defs>
            <linearGradient id={`gradient-${riskLevel}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={c.from} />
              <stop offset="100%" stopColor={c.to} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold ${c.text}`}
            style={{ fontSize: dimensions.fontSize }}
          >
            {score}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${c.bg} ${c.text} ring-1 ${c.ring}`}
        >
          {riskLevel}
        </span>
      )}
    </div>
  );
}
