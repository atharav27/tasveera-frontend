"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableTripIdsProps {
  tripIds: string[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function ExpandableTripIds({ tripIds, isExpanded, onToggle }: ExpandableTripIdsProps) {
  if (tripIds.length === 0) {
    return <span className="text-slate-600">—</span>;
  }

  if (tripIds.length === 1) {
    return <span className="text-slate-900">{tripIds[0]}</span>;
  }

  const firstTripId = tripIds[0];
  const remainingCount = tripIds.length - 1;

  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-900">{firstTripId}</span>
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue-400 hover:text-brand-blue-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
      >
        <span>+ {remainingCount} more</span>
        {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>
    </div>
  );
}
