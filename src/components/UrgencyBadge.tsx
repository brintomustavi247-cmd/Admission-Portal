import React from "react";
import { calculateUrgency } from "../lib/banglaUtils";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";

interface UrgencyBadgeProps {
  startDate: string;
  endDate: string;
  className?: string;
  showIcon?: boolean;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  startDate,
  endDate,
  className = "",
  showIcon = true,
}) => {
  const urgency = calculateUrgency(startDate, endDate);

  // Stronger contrast for light mode
  const iconColor = urgency.isUrgent
    ? "text-amber-600 dark:text-amber-400"
    : urgency.status === "ongoing"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-slate-600 dark:text-slate-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold border transition-all duration-200 whitespace-nowrap shrink-0 ${urgency.badgeClass} ${className}`}
    >
      {showIcon && (
        <>
          {urgency.isUrgent ? (
            <AlertCircle
              className={`w-3.5 h-3.5 shrink-0 animate-pulse ${iconColor}`}
            />
          ) : urgency.status === "ongoing" ? (
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
          ) : (
            <Clock className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
          )}
        </>
      )}
      <span className="whitespace-nowrap text-[11px] sm:text-xs">
        {urgency.badgeText}
      </span>
    </span>
  );
};
