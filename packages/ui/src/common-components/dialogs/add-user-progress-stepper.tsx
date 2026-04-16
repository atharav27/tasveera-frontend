"use client";

import { cn } from "../../lib/utils";

interface AddUserProgressStepperProps {
  currentStep: 1 | 2 | 3;
}

export function AddUserProgressStepper({ currentStep }: AddUserProgressStepperProps) {
  const isStep1Completed = currentStep > 1;
  const isStep2Completed = currentStep > 2;

  return (
    <div className="relative flex items-center w-full mb-8">
      {/* Step 1 - Leftmost */}
      <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-medium text-sm transition-colors bg-white border-primary text-primary">
        1
      </div>

      {/* Line between Step 1 and Step 2 */}
      <div
        className={cn(
          "h-0.5 flex-1 mx-4 transition-colors",
          isStep1Completed ? "bg-primary" : "bg-slate-300",
        )}
      />

      {/* Step 2 - Centered */}
      <div
        className={cn(
          "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-medium text-sm transition-colors",
          currentStep >= 2
            ? "bg-white border-primary text-primary"
            : "bg-white border-slate-300 text-slate-400",
        )}
      >
        2
      </div>

      {/* Line between Step 2 and Step 3 */}
      <div
        className={cn(
          "h-0.5 flex-1 mx-4 transition-colors",
          isStep2Completed ? "bg-primary" : "bg-slate-300",
        )}
      />

      {/* Step 3 - Rightmost */}
      <div
        className={cn(
          "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-medium text-sm transition-colors ml-auto",
          currentStep === 3
            ? "bg-white border-primary text-primary"
            : "bg-white border-slate-300 text-slate-400",
        )}
      >
        3
      </div>
    </div>
  );
}
