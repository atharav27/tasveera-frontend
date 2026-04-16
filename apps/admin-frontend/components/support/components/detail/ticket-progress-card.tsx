import { CircleCheck, Clock } from "lucide-react";

import { SectionHeader } from "@corpora/ui";
import { Card, CardContent, CardHeader } from "@corpora/ui";
import { cn } from "@corpora/ui";
import type { TicketProgressStep } from "@/types/tickets";

interface TicketProgressCardProps {
  progress: TicketProgressStep[];
}

function ProgressStep({ step, isLast }: { step: TicketProgressStep; isLast: boolean }) {
  const isCompleted = step.status === "completed";

  return (
    <div className="relative flex items-start gap-6">
      <div className="relative flex flex-col items-center shrink-0">
        {/* Icon circle */}
        <div
          className={cn(
            "relative z-10 flex size-10 items-center justify-center rounded-full",
            isCompleted ? "bg-brand-blue-base" : "bg-neutral-50",
          )}
        >
          {isCompleted ? (
            <CircleCheck className="size-6 text-slate-900" strokeWidth={1.5} />
          ) : (
            <Clock className="size-6 text-slate-400 " strokeWidth={1.5} />
          )}
        </div>
        {/* Connecting line - starts from bottom edge of icon and extends to next icon */}
        {!isLast && (
          <div
            className={cn(
              "absolute top-6 left-1/2 w-0.5 -translate-x-1/2",
              isCompleted ? "bg-slate-300" : "bg-slate-200",
            )}
            style={{ height: "calc(100% + 5rem)" }}
          />
        )}
      </div>
      <div className={cn("flex-1 pb-16", isLast && "pb-0")}>
        <p
          className={cn(
            "text-base font-medium",
            isCompleted ? "text-slate-900" : "text-slate-400",
          )}
        >
          {step.label}
        </p>
        {step.timestamp && (
          <p className="mt-1 text-xs text-slate-500">{step.timestamp}</p>
        )}
      </div>
    </div>
  );
}

export function TicketProgressCard({ progress }: TicketProgressCardProps) {
  return (
    <Card className="shadow-sm flex flex-col">
      <CardHeader className="pb-0 md:pb-4 px-4 md:px-8">
        <SectionHeader icon={Clock} iconSize="md">Ticket Progress</SectionHeader>
      </CardHeader>
      <CardContent className="flex-1 px-4 md:px-8">
        <div className="flex flex-col">
          {progress.map((step, index) => (
            <ProgressStep key={step.id} step={step} isLast={index === progress.length - 1} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

