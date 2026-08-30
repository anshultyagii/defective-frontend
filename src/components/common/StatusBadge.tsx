import React from 'react';
import { cn } from '#/lib/utils';
// Assuming these are the expected types in #/types/screening
import type { HealthStatus, RiskLevel } from '#/types/screening';

export interface StatusBadgeProps {
  status: HealthStatus | RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = false,
  className
}) => {
  const normalizedStatus = String(status).toLowerCase();
  
  let colorClasses = '';
  let dotColor = '';
  let isCritical = false;

  if (['healthy', 'low', 'nominal'].includes(normalizedStatus)) {
    colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    dotColor = 'bg-emerald-400';
  } else if (['at-risk', 'medium', 'elevated', 'warning'].includes(normalizedStatus)) {
    colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    dotColor = 'bg-amber-400';
  } else if (['critical', 'high', 'severe', 'error'].includes(normalizedStatus)) {
    colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    dotColor = 'bg-rose-400';
    isCritical = true;
  } else {
    colorClasses = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    dotColor = 'bg-slate-400';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs sm:text-sm px-2.5 py-1',
    lg: 'text-sm sm:text-base px-3 py-1.5'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-2 rounded-full border font-semibold uppercase tracking-wider backdrop-blur-md",
      sizeClasses[size],
      colorClasses,
      className
    )}>
      {showDot && (
        <span className="relative flex items-center justify-center">
          {isCritical && (
            <span className={cn("absolute inline-flex rounded-full opacity-75 animate-ping", dotSizes[size], dotColor)} />
          )}
          <span className={cn("relative inline-flex rounded-full", dotSizes[size], dotColor)} />
        </span>
      )}
      {status}
    </span>
  );
};
