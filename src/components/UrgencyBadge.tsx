import React from 'react';
import { calculateUrgency } from '../lib/banglaUtils';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UrgencyBadgeProps {
  startDate: string;
  endDate: string;
  className?: string;
  showIcon?: boolean;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  startDate,
  endDate,
  className = '',
  showIcon = true,
}) => {
  const urgency = calculateUrgency(startDate, endDate);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap shrink-0 ${urgency.badgeClass} ${className}`}
    >
      {showIcon && (
        <>
          {urgency.isUrgent ? (
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
          ) : urgency.status === 'ongoing' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          )}
        </>
      )}
      <span className="whitespace-nowrap">{urgency.badgeText}</span>
    </span>
  );
};
