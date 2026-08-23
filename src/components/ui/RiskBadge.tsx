import type { RiskLevel } from '@/types';
import { Badge } from './Badge';
import {
  Circle,
  AlertTriangle,
  TriangleAlert,
  CircleAlert,
  OctagonAlert,
} from 'lucide-react';

const config: Record<
  RiskLevel,
  { variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral'; icon: React.ReactNode; label: string }
> = {
  LOW: { variant: 'success', icon: <Circle className="w-3 h-3" />, label: 'LOW' },
  MEDIUM: { variant: 'warning', icon: <AlertTriangle className="w-3 h-3" />, label: 'MEDIUM' },
  HIGH: { variant: 'info', icon: <TriangleAlert className="w-3 h-3" />, label: 'HIGH' },
  CRITICAL: { variant: 'danger', icon: <CircleAlert className="w-3 h-3" />, label: 'CRITICAL' },
  BREACHED: { variant: 'neutral', icon: <OctagonAlert className="w-3 h-3" />, label: 'BREACHED' },
};

export function RiskBadge({ level, className = '' }: { level: RiskLevel; className?: string }) {
  const c = config[level];
  return (
    <Badge variant={c.variant} icon={c.icon} className={className} aria-label={`Risk level: ${c.label}`}>
      {c.label}
    </Badge>
  );
}
